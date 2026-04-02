import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useProducts } from '../admin/ProductContext';
import {
  getStorage,
  ref as storageRef,
  uploadBytes,
  getDownloadURL,
  deleteObject,
} from 'firebase/storage'; // Updated storage import
import { db } from '../firebaseConfig';
import { collection, onSnapshot } from 'firebase/firestore';
import { ImagePlus, ArrowLeft, Save, X, UploadCloud, Eye } from 'lucide-react';
import toast from 'react-hot-toast';
import { slugify, makeUniqueSlug } from '../utils/slugify';

// --- Reusable UI Components (Zoho Books Style) ---

const SectionHeader = ({ title, subtitle }) => (
  <div className="mb-5 pb-4 border-b border-[#dfe1e6]">
    <h2 className="text-[15px] font-semibold text-[#172b4d]">{title}</h2>
    {subtitle && (
      <p className="text-[12px] text-[#6b778c] mt-0.5">{subtitle}</p>
    )}
  </div>
);

const InputField = ({
  label,
  name,
  value,
  onChange,
  type = 'text',
  placeholder,
  required = false,
  textarea = false,
  helpText,
  readOnly = false,
}) => (
  <div className="space-y-1">
    <label className="text-[11px] font-semibold text-[#6b778c] uppercase tracking-wide">
      {label} {required && <span className="text-[#de350b]">*</span>}
    </label>
    {textarea ? (
      <textarea
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        rows={4}
        className="w-full bg-[#fafbfc] border border-[#dfe1e6] p-2.5 rounded text-[13px] text-[#172b4d] placeholder-[#a5adba] outline-none focus:border-[#0078d4] focus:ring-2 focus:ring-[#0078d4]/20 transition-all resize-none"
      />
    ) : (
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        readOnly={readOnly}
        placeholder={placeholder}
        required={required}
        className="w-full bg-[#fafbfc] border border-[#dfe1e6] p-2.5 rounded text-[13px] text-[#172b4d] placeholder-[#a5adba] outline-none focus:border-[#0078d4] focus:ring-2 focus:ring-[#0078d4]/20 transition-all"
      />
    )}
    {helpText && <p className="text-[11px] text-[#a5adba]">{helpText}</p>}
  </div>
);

const ToggleSwitch = ({ label, name, checked, onChange }) => (
  <label className="flex items-center justify-between py-2 px-1 cursor-pointer group">
    <span className="text-[13px] text-[#42526e] group-hover:text-[#172b4d] transition-colors">
      {label}
    </span>
    <div className="relative">
      <input
        type="checkbox"
        name={name}
        checked={checked}
        onChange={onChange}
        className="sr-only"
      />
      <div
        className={`w-9 h-5 rounded-full transition-all duration-300 ${checked ? 'bg-[#0078d4]' : 'bg-[#dfe1e6]'}`}
      ></div>
      <div
        className={`absolute left-0.5 top-0.5 bg-white w-4 h-4 rounded-full transition-all duration-300 shadow-sm ${checked ? 'translate-x-4' : ''}`}
      ></div>
    </div>
  </label>
);

const AddProduct = () => {
  const { addProduct, updateProduct, products } = useProducts();
  const location = useLocation();
  const navigate = useNavigate();
  const storage = getStorage();

  const editingProduct = location.state?.editingProduct || null;
  const existingStock = Number(editingProduct?.stock) || 0;

  // States
  const [uploading, setUploading] = useState(false);
  const [images, setImages] = useState([]);
  const [videos, setVideos] = useState([]);
  const [previews, setPreviews] = useState([]);
  const [existingImageUrls, setExistingImageUrls] = useState([]);
  const [categorySearch, setCategorySearch] = useState('');
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);

  const [categories, setCategories] = useState([]);
  const [isSkuManuallyEdited, setIsSkuManuallyEdited] = useState(false);

  const [product, setProduct] = useState({
    category: '',
    categorySlug: '',
    productCode: '',
    name: '',
    per: '',
    mrp: '',
    price: '',
    stock: '',
    sortOrder: '',
    image: '',
    images: [],
    videos: [],
    highlights: '',
    safety: '',
    moreInfo: '',
    isBestSeller: false,
    isFreshArrival: false,

    outOfStock: false,
    hideProduct: false,

    slug: '',
  });

  // Effects
  useEffect(() => {
    if (editingProduct) {
      setProduct({ ...editingProduct, stock: '' });
      setIsSkuManuallyEdited(true);
      const initialImages = Array.isArray(editingProduct.images)
        ? editingProduct.images.filter(Boolean)
        : [];
      const fallbackImage = editingProduct.image ? [editingProduct.image] : [];
      setExistingImageUrls(
        initialImages.length > 0 ? initialImages : fallbackImage
      );
    }
  }, [editingProduct]);

  const buildProductCode = (categoryName, productName) => {
    const toToken = (value, fallback) => {
      const clean = (value || '')
        .toUpperCase()
        .replace(/[^A-Z0-9\s]/g, '')
        .trim();
      if (!clean) return fallback;
      const words = clean.split(/\s+/).filter(Boolean);
      const byInitials = words
        .map((w) => w[0])
        .join('')
        .slice(0, 3);
      if (byInitials.length >= 2) return byInitials.padEnd(3, 'X');
      const compact = clean.replace(/\s+/g, '');
      return compact.slice(0, 3).padEnd(3, 'X');
    };

    const catToken = toToken(categoryName, 'CAT');
    const nameToken = toToken(productName, 'PRD');

    // Continue running series inside the same category.
    const categorySeries = products
      .map((p) => (p.productCode || '').toUpperCase())
      .map((code) =>
        code.match(new RegExp(`^${catToken}-[A-Z0-9]{3}-(\\d{4})$`))
      )
      .filter(Boolean)
      .map((match) => Number(match[1]))
      .filter((num) => Number.isFinite(num));

    const nextSeries =
      (categorySeries.length ? Math.max(...categorySeries) : 0) + 1;
    const serial = String(nextSeries).padStart(4, '0');

    return `${catToken}-${nameToken}-${serial}`;
  };

  useEffect(() => {
    const unsub = onSnapshot(collection(db, 'categories'), (snap) => {
      setCategories(
        snap.docs.map((d) => ({
          id: d.id,
          name: d.data().name,
          slug: d.data().slug || slugify(d.data().name || ''),
        }))
      );
    });
    return () => unsub();
  }, []);

  useEffect(() => {
    if (images.length > 0) {
      const objectUrls = images.map((img) => URL.createObjectURL(img));
      setPreviews(objectUrls);
      return () => objectUrls.forEach((url) => URL.revokeObjectURL(url));
    }

    setPreviews(existingImageUrls);
  }, [images, existingImageUrls]);

  useEffect(() => {
    if (!editingProduct && product.name) {
      const slug = slugify(product.name);
      setProduct((prev) => ({
        ...prev,
        slug: prev.slug || slug,
      }));
    }
  }, [product.name, editingProduct]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (name === 'category') {
      const selectedCategory = categories.find((cat) => cat.name === value);
      setProduct({
        ...product,
        category: value,
        categorySlug: selectedCategory?.slug || slugify(value),
      });
      return;
    }

    if (name === 'name') {
      setProduct((prev) => ({
        ...prev,
        name: value,
        slug: prev.slug || slugify(value),
      }));
      return;
    }

    if (name === 'slug') {
      setProduct({ ...product, slug: slugify(value) });
      return;
    }

    if (name === 'productCode') {
      setIsSkuManuallyEdited(true);
    }

    setProduct({ ...product, [name]: type === 'checkbox' ? checked : value });
  };

  const handleImageSelection = (fileList) => {
    const selectedFiles = Array.from(fileList || []);
    setImages(selectedFiles);

    // New selection replaces existing images on edit.
    if (editingProduct) {
      setExistingImageUrls([]);
    }

    if (selectedFiles.length === 0 && !editingProduct) {
      setPreviews([]);
    }
  };

  const removePreviewImage = (index) => {
    if (images.length > 0) {
      setImages((prev) => prev.filter((_, idx) => idx !== index));
      return;
    }

    setExistingImageUrls((prev) => prev.filter((_, idx) => idx !== index));
  };

  const clearAllImages = () => {
    setImages([]);
    setExistingImageUrls([]);
    setPreviews([]);
  };

  const uploadAllMedia = async () => {
    const uploadFiles = async (files, folder) => {
      const uploads = files.map(async (file, i) => {
        const ext = file.name.split('.').pop();
        const fileName = `${product.productCode}-${Date.now()}-${i}.${ext}`;
        const mediaRef = storageRef(
          storage,
          `products/${product.productCode}/${folder}/${fileName}`
        );
        await uploadBytes(mediaRef, file);
        return await getDownloadURL(mediaRef);
      });
      return Promise.all(uploads);
    };

    const imageURLs = images.length
      ? await uploadFiles(images, 'images')
      : existingImageUrls;
    const videoURLs = videos.length
      ? await uploadFiles(videos, 'videos')
      : product.videos;

    return {
      image: imageURLs[0] || product.image,
      images: imageURLs,
      videos: videoURLs,
    };
  };

  const handleSaveProduct = async () => {
    if (
      !product.category ||
      !product.productCode ||
      !product.name ||
      !product.price
    )
      return toast.error('Please fill all required fields.');

    if (!editingProduct && images.length === 0 && !product.image) {
      return toast.error('Please upload at least one product image.');
    }

    setUploading(true);
    try {
      const uploaded = await uploadAllMedia();
      if (!uploaded.image) {
        throw new Error('Image upload failed. Please re-upload and try again.');
      }

      if (editingProduct) {
        const previousImages = Array.isArray(editingProduct.images)
          ? editingProduct.images.filter(Boolean)
          : editingProduct.image
            ? [editingProduct.image]
            : [];
        const removedImages = previousImages.filter(
          (url) => !uploaded.images.includes(url)
        );

        await Promise.all(
          removedImages.map(async (url) => {
            try {
              await deleteObject(storageRef(storage, url));
            } catch (deleteError) {
              console.warn(
                'Could not delete old image from storage:',
                deleteError
              );
            }
          })
        );
      }

      const selectedCategory = categories.find(
        (cat) => cat.name === product.category
      );
      const finalProductSlug = makeUniqueSlug(
        product.slug || product.name,
        products.map((p) => p.slug || p.name),
        editingProduct?.slug || ''
      );
      const enteredStock = Number(product.stock) || 0;
      const finalStock = editingProduct
        ? existingStock + enteredStock
        : enteredStock;
      const finalData = {
        ...product,
        ...uploaded,
        stock: finalStock,
        outOfStock: finalStock <= 0,
        slug: finalProductSlug,
        categorySlug:
          selectedCategory?.slug ||
          product.categorySlug ||
          slugify(product.category),
        updatedAt: new Date(),
      };

      if (editingProduct) {
        const result = await updateProduct(editingProduct.id, finalData);
        if (!result?.success) {
          throw new Error(result?.message || 'Failed to update product');
        }
        toast.success('Product updated successfully');
      } else {
        const result = await addProduct(finalData);
        if (!result?.success) {
          throw new Error(result?.message || 'Failed to save product');
        }
        toast.success('Product added successfully');
      }

      navigate('/admin/products');
    } catch (err) {
      console.error(err);
      const readableMessage =
        err?.code && err?.message
          ? `${err.code}: ${err.message}`
          : err?.message || 'Error saving product.';
      toast.error(readableMessage);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-6 font-sans">
      {/* Header */}
      <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
        <div className="flex items-start gap-3">
          <button
            onClick={() => navigate(-1)}
            className="mt-0.5 w-9 h-9 rounded-lg border border-[#dfe1e6] bg-white flex items-center justify-center hover:bg-[#f4f5f7] transition-colors shadow-sm"
          >
            <ArrowLeft size={16} className="text-[#6b778c]" />
          </button>
          <div>
            <h1 className="text-2xl font-semibold text-[#172b4d] leading-tight">
              {editingProduct ? 'Edit Product' : 'New Product'}
            </h1>
            <p className="text-[13px] text-[#6b778c] mt-1 max-w-2xl">
              Add clean product information for admin, inventory, and catalog
              use. Keep the essentials accurate so stock and pricing stay in
              sync.
            </p>
          </div>
        </div>
        <button
          disabled={uploading}
          onClick={handleSaveProduct}
          className="flex items-center justify-center gap-1.5 bg-[#0078d4] text-white px-5 py-2.5 rounded-lg text-[13px] font-medium hover:bg-[#106ebe] transition-colors disabled:opacity-50 shadow-sm"
        >
          {uploading ? (
            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          ) : (
            <Save size={15} />
          )}
          <span>{editingProduct ? 'Save Changes' : 'Publish'}</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Main Content */}
        <div className="lg:col-span-8 space-y-5">
          {/* Essentials */}
          <div className="bg-white rounded-lg border border-[#dfe1e6] p-5">
            <SectionHeader
              title="Essentials"
              subtitle="Core product details & classification."
            />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <InputField
                  label="Product Name"
                  name="name"
                  value={product.name}
                  onChange={handleChange}
                  required
                  placeholder="e.g. 1000 Wala Premium"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[11px] font-semibold text-[#6b778c] uppercase tracking-wide">
                  Category <span className="text-[#de350b]">*</span>
                </label>
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search or type category..."
                    value={categorySearch || product.category}
                    onChange={(e) => {
                      setCategorySearch(e.target.value);
                      setShowCategoryDropdown(true);
                    }}
                    onFocus={() => setShowCategoryDropdown(true)}
                    className="w-full bg-[#fafbfc] border border-[#dfe1e6] p-2.5 rounded text-[13px] text-[#172b4d] placeholder-[#a5adba] outline-none focus:border-[#0078d4] focus:ring-2 focus:ring-[#0078d4]/20 transition-all"
                  />
                  {showCategoryDropdown && (
                    <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-[#dfe1e6] rounded shadow-lg z-50 max-h-48 overflow-y-auto">
                      {categories
                        .filter((cat) =>
                          cat.name
                            .toLowerCase()
                            .includes(
                              (categorySearch || product.category).toLowerCase()
                            )
                        )
                        .map((cat) => (
                          <button
                            key={cat.id}
                            type="button"
                            onClick={() => {
                              setProduct({
                                ...product,
                                category: cat.name,
                                categorySlug: cat.slug,
                              });
                              setCategorySearch('');
                              setShowCategoryDropdown(false);
                            }}
                            className="w-full text-left px-3 py-2 hover:bg-[#f4f5f7] transition-colors text-[13px] text-[#172b4d]"
                          >
                            {cat.name}
                          </button>
                        ))}
                      {categorySearch &&
                        !categories.some(
                          (cat) =>
                            cat.name.toLowerCase() ===
                            categorySearch.toLowerCase()
                        ) && (
                          <button
                            type="button"
                            onClick={() => {
                              setProduct({
                                ...product,
                                category: categorySearch,
                                categorySlug: slugify(categorySearch),
                              });
                              setCategorySearch('');
                              setShowCategoryDropdown(false);
                            }}
                            className="w-full text-left px-3 py-2 bg-[#e9f2ff] hover:bg-[#deecff] border-t border-[#dfe1e6] transition-colors text-[13px] text-[#0078d4] font-medium"
                          >
                            + Create new: "{categorySearch}"
                          </button>
                        )}
                    </div>
                  )}
                </div>
              </div>
              <InputField
                label="SKU Code"
                name="productCode"
                value={product.productCode}
                onChange={handleChange}
                required
                placeholder="Auto-generated"
                readOnly={!editingProduct}
                helpText={
                  editingProduct
                    ? 'You can edit SKU in edit mode.'
                    : 'Auto-generated using Category + Product Name + Category Series'
                }
              />
              <InputField
                label="MRP (₹)"
                name="mrp"
                type="number"
                value={product.mrp}
                onChange={handleChange}
                placeholder="0.00"
              />
              <InputField
                label="Selling Price (₹)"
                name="price"
                type="number"
                value={product.price}
                onChange={handleChange}
                required
                placeholder="0.00"
              />
              <InputField
                label="Stock Quantity"
                name="stock"
                type="number"
                value={product.stock}
                onChange={handleChange}
                placeholder="0"
                helpText={
                  editingProduct
                    ? `Current stock: ${existingStock}. Enter additional quantity to add.`
                    : 'Initial stock quantity for this product'
                }
              />
              <InputField
                label="Pack / Unit"
                name="per"
                value={product.per}
                onChange={handleChange}
                placeholder="Box, Packet, Dozen"
                helpText="Helpful for product presentation and billing"
              />
              <InputField
                label="Sort Order"
                name="sortOrder"
                type="number"
                value={product.sortOrder}
                onChange={handleChange}
                placeholder="0"
                helpText="Lower numbers appear earlier in lists"
              />
            </div>
          </div>

          {/* Product Details */}
          <div className="bg-white rounded-lg border border-[#dfe1e6] p-5">
            <SectionHeader
              title="Product Details"
              subtitle="Short highlights and operational notes for the team."
            />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <InputField
                label="Highlights"
                name="highlights"
                value={product.highlights}
                onChange={handleChange}
                textarea
                placeholder="Key selling points, bundle details, or features"
              />
              <InputField
                label="Safety Notes"
                name="safety"
                value={product.safety}
                onChange={handleChange}
                textarea
                placeholder="Storage, handling, and usage safety notes"
              />
              <div className="md:col-span-2">
                <InputField
                  label="Additional Info"
                  name="moreInfo"
                  value={product.moreInfo}
                  onChange={handleChange}
                  textarea
                  placeholder="Any extra notes for staff or customers"
                />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg border border-[#dfe1e6] p-5">
            <SectionHeader
              title="Gallery"
              subtitle="Upload product images in the right order."
            />
            <div className="border-2 border-dashed border-[#dfe1e6] rounded-xl bg-[#fafbfc] hover:border-[#0078d4] transition-all p-8 text-center cursor-pointer relative group">
              <input
                multiple
                type="file"
                accept="image/*"
                onChange={(e) => handleImageSelection(e.target.files)}
                className="absolute inset-0 opacity-0 cursor-pointer z-10"
              />
              <div className="group-hover:scale-105 transition-transform duration-200">
                <div className="w-12 h-12 bg-[#e9f2ff] rounded-lg flex items-center justify-center mx-auto mb-3">
                  <UploadCloud size={24} className="text-[#0078d4]" />
                </div>
                <p className="text-[13px] font-semibold text-[#172b4d]">
                  Click to upload or drag images here
                </p>
                <p className="text-[11px] text-[#6b778c] mt-1">
                  PNG, JPG, JPEG | First image becomes the cover
                </p>
              </div>
            </div>
            {previews.length > 0 && (
              <div className="mt-5 space-y-3">
                <div className="flex items-center justify-between">
                  <p className="text-[12px] font-semibold text-[#6b778c] uppercase tracking-wide">
                    Images ({previews.length})
                  </p>
                  <button
                    type="button"
                    onClick={clearAllImages}
                    className="text-[11px] text-[#de350b] hover:text-[#ae2a19] font-medium"
                  >
                    Clear All
                  </button>
                </div>
                <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3">
                  {previews.map((url, i) => (
                    <div
                      key={i}
                      className="relative aspect-square rounded-lg border border-[#dfe1e6] overflow-hidden group bg-[#fafbfc] hover:border-[#0078d4] transition-all"
                    >
                      <img
                        src={url}
                        alt={`Preview ${i + 1}`}
                        className="w-full h-full object-cover"
                      />
                      {i === 0 && (
                        <div className="absolute top-1 left-1 bg-[#0078d4] text-white text-[10px] px-1.5 py-0.5 rounded font-semibold">
                          Cover
                        </div>
                      )}
                      <button
                        type="button"
                        onClick={() => removePreviewImage(i)}
                        className="absolute top-1 right-1 w-6 h-6 bg-[#de350b] text-white rounded-full flex items-center justify-center shadow opacity-0 group-hover:opacity-100 transition-all hover:bg-[#ae2a19]"
                      >
                        <X size={14} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-4 space-y-5">
          {/* Live Preview */}
          <div className="bg-white rounded-lg border border-[#dfe1e6] p-4">
            <div className="flex items-center gap-2 mb-4 pb-3 border-b border-[#f4f5f7]">
              <Eye size={14} className="text-[#6b778c]" />
              <h3 className="text-[13px] font-semibold text-[#172b4d]">
                Live Preview
              </h3>
            </div>
            <div className="bg-[#fafbfc] rounded border border-[#dfe1e6] p-3">
              <div className="aspect-square bg-[#f4f5f7] rounded overflow-hidden mb-3">
                {previews[0] ? (
                  <img
                    src={previews[0]}
                    className="w-full h-full object-cover"
                    alt="Preview"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-[#a5adba]">
                    <ImagePlus size={28} />
                  </div>
                )}
              </div>
              <p className="text-[11px] text-[#6b778c] uppercase">
                {product.category || 'Category'}
              </p>
              <h4 className="text-[13px] font-semibold text-[#172b4d] mt-0.5 mb-2">
                {product.name || 'Product Name'}
              </h4>
              <span className="text-[15px] font-semibold text-[#172b4d]">
                ₹{Number(product.price || 0).toLocaleString()}
              </span>
            </div>
          </div>

          {/* Status Toggles */}
          <div className="bg-white rounded-lg border border-[#dfe1e6] p-4">
            <h3 className="text-[13px] font-semibold text-[#172b4d] mb-3 pb-3 border-b border-[#f4f5f7]">
              Visibility
            </h3>
            <div className="space-y-1">
              <ToggleSwitch
                label="Best Seller"
                name="isBestSeller"
                checked={product.isBestSeller}
                onChange={handleChange}
              />
              <ToggleSwitch
                label="Fresh Arrival"
                name="isFreshArrival"
                checked={product.isFreshArrival}
                onChange={handleChange}
              />
              <div className="my-2 h-px bg-[#f4f5f7]"></div>
              <ToggleSwitch
                label="Out of Stock"
                name="outOfStock"
                checked={product.outOfStock}
                onChange={handleChange}
              />
              <ToggleSwitch
                label="Hidden"
                name="hideProduct"
                checked={product.hideProduct}
                onChange={handleChange}
              />
            </div>
          </div>

          {/* Category Management */}
          <div className="bg-white rounded-lg border border-[#dfe1e6] p-4">
            <h3 className="text-[13px] font-semibold text-[#172b4d] mb-3 pb-3 border-b border-[#f4f5f7]">
              Category Management
            </h3>
            <p className="text-[12px] text-[#6b778c] mb-3">
              Categories are now managed from a dedicated admin tab.
            </p>
            <Link
              to="/admin/category-management"
              className="w-full h-9 rounded border border-[#dfe1e6] text-[13px] font-medium text-[#0078d4] hover:bg-[#e9f2ff] transition-colors flex items-center justify-center"
            >
              Open Category Management
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddProduct;
