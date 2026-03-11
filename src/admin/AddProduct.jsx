import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useProducts } from '../admin/ProductContext';
import {
  getStorage,
  ref as storageRef,
  uploadBytes,
  getDownloadURL,
} from 'firebase/storage'; // Updated storage import
import { db } from '../firebaseConfig';
import {
  doc,
  updateDoc,
  collection,
  addDoc,
  onSnapshot,
} from 'firebase/firestore';
import {
  ImagePlus,
  ArrowLeft,
  Save,
  Plus,
  X,
  DollarSign,
  Tag,
  ChevronRight,
  UploadCloud,
  Globe,
  Search,
  Eye,
  LayoutGrid,
} from 'lucide-react';
import toast from 'react-hot-toast';

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
  const { addProduct } = useProducts();
  const location = useLocation();
  const navigate = useNavigate();
  const storage = getStorage();

  const editingProduct = location.state?.editingProduct || null;

  // States
  const [uploading, setUploading] = useState(false);
  const [images, setImages] = useState([]);
  const [videos, setVideos] = useState([]);
  const [previews, setPreviews] = useState([]);

  const [categories, setCategories] = useState([]);
  const [newCategory, setNewCategory] = useState('');
  const [catImage, setCatImage] = useState(null);
  const [catPreview, setCatPreview] = useState(null);

  const [product, setProduct] = useState({
    category: '',
    productCode: '',
    name: '',
    per: '',
    mrp: '',
    price: '',
    sortOrder: '',
    image: '',
    images: [],
    videos: [],
    highlights: '',
    safety: '',
    description: '',
    moreInfo: '',
    isBestSeller: false,
    isFreshArrival: false,

    outOfStock: false,
    hideProduct: false,

    metaTitle: '',
    metaDescription: '',
    slug: '',
    keywords: '',
  });

  // Effects
  useEffect(() => {
    if (editingProduct) {
      setProduct(editingProduct);
      if (editingProduct.image) setPreviews([editingProduct.image]);
    }
  }, [editingProduct]);

  useEffect(() => {
    const unsub = onSnapshot(collection(db, 'categories'), (snap) => {
      setCategories(snap.docs.map((d) => ({ id: d.id, name: d.data().name })));
    });
    return () => unsub();
  }, []);

  useEffect(() => {
    if (images.length === 0) return;
    const objectUrls = images.map((img) => URL.createObjectURL(img));
    setPreviews(objectUrls);
    return () => objectUrls.forEach((url) => URL.revokeObjectURL(url));
  }, [images]);

  useEffect(() => {
    if (!editingProduct && product.name) {
      const slug = product.name
        .toLowerCase()
        .replace(/ /g, '-')
        .replace(/[^\w-]+/g, '');
      setProduct((prev) => ({
        ...prev,
        slug: prev.slug || slug,
        metaTitle: prev.metaTitle || product.name,
      }));
    }
  }, [product.name, editingProduct]);

  // Handlers
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setProduct({ ...product, [name]: type === 'checkbox' ? checked : value });
  };

  const handleCatImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setCatImage(file);
      setCatPreview(URL.createObjectURL(file));
    }
  };

  const handleAddCategory = async () => {
    if (!newCategory.trim() || !catImage)
      return toast.error('Please add both name and image for the category.');

    setUploading(true);
    try {
      const fileName = `categories/${Date.now()}-${catImage.name}`;
      const fileRef = storageRef(storage, fileName);

      await uploadBytes(fileRef, catImage);
      const downloadURL = await getDownloadURL(fileRef);

      await addDoc(collection(db, 'categories'), {
        name: newCategory.trim(),
        img: downloadURL,
        count: '0 Styles',
        createdAt: new Date(),
      });

      setNewCategory('');
      setCatImage(null);
      setCatPreview(null);
      toast.success('Category added successfully!');
    } catch (err) {
      console.error(err);
      toast.error('Error adding category.');
    } finally {
      setUploading(false);
    }
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
      : product.images;
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

    setUploading(true);
    try {
      const uploaded = await uploadAllMedia();
      const finalData = { ...product, ...uploaded, updatedAt: new Date() };

      if (editingProduct) {
        await updateDoc(doc(db, 'products', editingProduct.id), finalData);
      } else {
        await addProduct(finalData);
      }
      navigate('/admin/products');
    } catch (err) {
      console.error(err);
      toast.error('Error saving product.');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-5 font-sans">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate(-1)}
            className="w-8 h-8 rounded border border-[#dfe1e6] flex items-center justify-center hover:bg-[#f4f5f7] transition-colors"
          >
            <ArrowLeft size={16} className="text-[#6b778c]" />
          </button>
          <div>
            <h1 className="text-xl font-semibold text-[#172b4d]">
              {editingProduct ? 'Edit Product' : 'New Product'}
            </h1>
            <p className="text-[12px] text-[#6b778c]">Inventory</p>
          </div>
        </div>
        <button
          disabled={uploading}
          onClick={handleSaveProduct}
          className="flex items-center gap-1.5 bg-[#0078d4] text-white px-5 py-2 rounded text-[13px] font-medium hover:bg-[#106ebe] transition-colors disabled:opacity-50"
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
                <select
                  name="category"
                  value={product.category}
                  onChange={handleChange}
                  className="w-full bg-[#fafbfc] border border-[#dfe1e6] p-2.5 rounded text-[13px] text-[#42526e] outline-none focus:border-[#0078d4] cursor-pointer appearance-none"
                >
                  <option value="">Select Category</option>
                  {categories.map((c) => (
                    <option key={c.id} value={c.name}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>
              <InputField
                label="SKU Code"
                name="productCode"
                value={product.productCode}
                onChange={handleChange}
                required
                placeholder="SKU-123"
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
            </div>
          </div>

          {/* Media */}
          <div className="bg-white rounded-lg border border-[#dfe1e6] p-5">
            <SectionHeader title="Gallery" subtitle="Upload product images." />
            <div className="border-2 border-dashed border-[#dfe1e6] rounded-lg bg-[#fafbfc] hover:border-[#0078d4] transition-colors p-8 text-center cursor-pointer relative">
              <input
                multiple
                type="file"
                accept="image/*"
                onChange={(e) => setImages(Array.from(e.target.files))}
                className="absolute inset-0 opacity-0 cursor-pointer z-10"
              />
              <UploadCloud size={28} className="text-[#a5adba] mx-auto mb-2" />
              <p className="text-[13px] font-medium text-[#172b4d]">
                Click to upload images
              </p>
              <p className="text-[11px] text-[#a5adba] mt-1">
                PNG, JPG (Max 800x800px)
              </p>
            </div>
            {previews.length > 0 && (
              <div className="grid grid-cols-4 sm:grid-cols-6 gap-3 mt-4">
                {previews.map((url, i) => (
                  <div
                    key={i}
                    className="relative aspect-square rounded border border-[#dfe1e6] overflow-hidden group"
                  >
                    <img
                      src={url}
                      alt="Preview"
                      className="w-full h-full object-cover"
                    />
                    <button
                      onClick={() =>
                        setImages(images.filter((_, idx) => idx !== i))
                      }
                      className="absolute top-1 right-1 w-5 h-5 bg-white text-[#de350b] rounded flex items-center justify-center shadow opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X size={12} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* SEO */}
          <div className="bg-white rounded-lg border border-[#dfe1e6] p-5">
            <SectionHeader
              title="Content & SEO"
              subtitle="Description and search optimization."
            />
            <div className="space-y-4">
              <InputField
                name="description"
                label="Description"
                value={product.description}
                onChange={handleChange}
                textarea
                placeholder="Write a compelling description..."
              />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-3 border-t border-[#f4f5f7]">
                <div className="md:col-span-2">
                  <InputField
                    label="Meta Title"
                    name="metaTitle"
                    value={product.metaTitle}
                    onChange={handleChange}
                    placeholder="SEO Title"
                    helpText="Recommended: 50-60 chars"
                  />
                </div>
                <InputField
                  label="URL Slug"
                  name="slug"
                  value={product.slug}
                  onChange={handleChange}
                  placeholder="product-slug"
                  helpText="Auto-generated"
                />
                <InputField
                  label="Keywords"
                  name="keywords"
                  value={product.keywords}
                  onChange={handleChange}
                  placeholder="tags, keys"
                  helpText="Comma separated"
                />
              </div>
            </div>
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

          {/* New Category */}
          <div className="bg-white rounded-lg border border-[#dfe1e6] p-4">
            <h3 className="text-[13px] font-semibold text-[#172b4d] mb-3 pb-3 border-b border-[#f4f5f7]">
              New Category
            </h3>
            <div className="space-y-3">
              <input
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value)}
                className="w-full bg-[#fafbfc] border border-[#dfe1e6] rounded px-3 py-2 text-[13px] text-[#172b4d] placeholder-[#a5adba] outline-none focus:border-[#0078d4]"
                placeholder="Category Name..."
              />
              <div className="relative h-20 w-full border-2 border-dashed border-[#dfe1e6] rounded flex flex-col items-center justify-center bg-[#fafbfc] hover:border-[#0078d4] transition-colors overflow-hidden cursor-pointer">
                {catPreview ? (
                  <img
                    src={catPreview}
                    className="w-full h-full object-cover"
                    alt="Preview"
                  />
                ) : (
                  <>
                    <ImagePlus size={18} className="text-[#a5adba] mb-1" />
                    <span className="text-[11px] text-[#a5adba]">
                      Select Image
                    </span>
                  </>
                )}
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleCatImageChange}
                  className="absolute inset-0 opacity-0 cursor-pointer"
                />
              </div>
              <button
                onClick={handleAddCategory}
                disabled={uploading}
                className="w-full bg-[#0078d4] text-white py-2 rounded text-[13px] font-medium hover:bg-[#106ebe] transition-colors flex items-center justify-center gap-1.5 disabled:opacity-50"
              >
                {uploading ? (
                  'Processing...'
                ) : (
                  <>
                    <Plus size={14} /> Add Category
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddProduct;
