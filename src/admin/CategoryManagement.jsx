import { useEffect, useMemo, useState } from 'react';
import {
  collection,
  onSnapshot,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  query,
  orderBy,
} from 'firebase/firestore';
import {
  getStorage,
  ref as storageRef,
  uploadBytes,
  getDownloadURL,
  deleteObject,
} from 'firebase/storage';
import { Edit2, Trash2, Plus, X, ImagePlus, Tag } from 'lucide-react';
import toast from 'react-hot-toast';
import { db } from '../firebaseConfig';
import { useProducts } from './ProductContext';
import { slugify, makeUniqueSlug } from '../utils/slugify';

const initialForm = {
  id: null,
  name: '',
  slug: '',
  imageFile: null,
  imagePreview: '',
  existingImage: '',
};

export default function CategoryManagement() {
  const storage = getStorage();
  const { products } = useProducts();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState(initialForm);

  useEffect(() => {
    const q = query(collection(db, 'categories'), orderBy('createdAt', 'desc'));
    const unsub = onSnapshot(
      q,
      (snapshot) => {
        setCategories(snapshot.docs.map((d) => ({ id: d.id, ...d.data() })));
        setLoading(false);
      },
      () => {
        toast.error('Unable to load categories');
        setLoading(false);
      }
    );

    return () => unsub();
  }, []);

  useEffect(() => {
    return () => {
      if (form.imagePreview && form.imageFile) {
        URL.revokeObjectURL(form.imagePreview);
      }
    };
  }, [form.imagePreview, form.imageFile]);

  const productCountByCategory = useMemo(() => {
    return products.reduce((acc, product) => {
      const key = (product.category || '').trim();
      if (!key) return acc;
      acc[key] = (acc[key] || 0) + 1;
      return acc;
    }, {});
  }, [products]);

  const resetForm = () => {
    if (form.imagePreview && form.imageFile) {
      URL.revokeObjectURL(form.imagePreview);
    }
    setForm(initialForm);
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (form.imagePreview && form.imageFile) {
      URL.revokeObjectURL(form.imagePreview);
    }

    setForm((prev) => ({
      ...prev,
      imageFile: file,
      imagePreview: URL.createObjectURL(file),
    }));
  };

  const uploadCategoryImage = async (file, categoryName) => {
    const safeName = categoryName.toLowerCase().replace(/\s+/g, '-');
    const fileName = `categories/${safeName}-${Date.now()}-${file.name}`;
    const fileRef = storageRef(storage, fileName);
    await uploadBytes(fileRef, file);
    return getDownloadURL(fileRef);
  };

  const saveCategory = async () => {
    const trimmedName = form.name.trim();
    const baseSlug = form.slug?.trim() || trimmedName;
    const uniqueSlug = makeUniqueSlug(
      baseSlug,
      categories.map((cat) => cat.slug || cat.name),
      categories.find((cat) => cat.id === form.id)?.slug || ''
    );

    if (!trimmedName) {
      toast.error('Category name is required');
      return;
    }

    const normalized = trimmedName.toLowerCase();
    const duplicate = categories.find(
      (cat) =>
        cat.name?.trim().toLowerCase() === normalized && cat.id !== form.id
    );
    if (duplicate) {
      toast.error('Category already exists');
      return;
    }

    const duplicateSlug = categories.find(
      (cat) =>
        slugify(cat.slug || cat.name) === uniqueSlug && cat.id !== form.id
    );
    if (duplicateSlug) {
      toast.error('Category slug already exists');
      return;
    }

    setSaving(true);
    try {
      let imageUrl = form.existingImage || '';
      if (form.imageFile) {
        imageUrl = await uploadCategoryImage(form.imageFile, trimmedName);
      }

      if (form.id) {
        const oldName = categories.find((cat) => cat.id === form.id)?.name;

        await updateDoc(doc(db, 'categories', form.id), {
          name: trimmedName,
          slug: uniqueSlug,
          img: imageUrl,
          updatedAt: new Date(),
        });

        // Keep products in sync when a category is renamed.
        if (oldName && oldName !== trimmedName) {
          const productsToUpdate = products.filter(
            (p) => p.category === oldName
          );
          await Promise.all(
            productsToUpdate.map((p) =>
              updateDoc(doc(db, 'products', p.id), {
                category: trimmedName,
                categorySlug: uniqueSlug,
              })
            )
          );
        }

        toast.success('Category updated');
      } else {
        if (!imageUrl) {
          toast.error('Category image is required');
          return;
        }
        await addDoc(collection(db, 'categories'), {
          name: trimmedName,
          slug: uniqueSlug,
          img: imageUrl,
          createdAt: new Date(),
          updatedAt: new Date(),
        });
        toast.success('Category created');
      }

      resetForm();
    } catch (error) {
      console.error(error);
      toast.error('Unable to save category');
    } finally {
      setSaving(false);
    }
  };

  const startEdit = (category) => {
    if (form.imagePreview && form.imageFile) {
      URL.revokeObjectURL(form.imagePreview);
    }

    setForm({
      id: category.id,
      name: category.name || '',
      slug: category.slug || slugify(category.name || ''),
      imageFile: null,
      imagePreview: category.img || '',
      existingImage: category.img || '',
    });
  };

  const handleDelete = async (category) => {
    const count = productCountByCategory[category.name] || 0;
    if (count > 0) {
      toast.error(
        'This category is used by products. Reassign products first.'
      );
      return;
    }

    const confirmed = window.confirm(`Delete category "${category.name}"?`);
    if (!confirmed) return;

    try {
      await deleteDoc(doc(db, 'categories', category.id));
      if (category.img) {
        try {
          await deleteObject(storageRef(storage, category.img));
        } catch {
          // If deleteObject fails due to a URL format or missing object, document delete is already done.
        }
      }

      if (form.id === category.id) {
        resetForm();
      }

      toast.success('Category deleted');
    } catch (error) {
      console.error(error);
      toast.error('Unable to delete category');
    }
  };

  return (
    <div className="space-y-5 font-sans">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-semibold text-[#172b4d]">
            Category Management
          </h1>
          <p className="text-[13px] text-[#6b778c] mt-0.5">
            Create and manage categories used across user pages.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">
        <div className="xl:col-span-1 bg-white border border-[#dfe1e6] rounded-lg p-4 h-fit">
          <h2 className="text-[14px] font-semibold text-[#172b4d] mb-4">
            {form.id ? 'Edit Category' : 'Add Category'}
          </h2>

          <div className="space-y-3">
            <div>
              <label className="text-[11px] font-semibold text-[#6b778c] uppercase tracking-wide">
                Category Name
              </label>
              <input
                value={form.name}
                onChange={(e) =>
                  setForm((prev) => ({
                    ...prev,
                    name: e.target.value,
                    slug: slugify(e.target.value),
                  }))
                }
                placeholder="Enter category name"
                className="mt-1 w-full bg-[#fafbfc] border border-[#dfe1e6] rounded px-3 py-2.5 text-[13px] text-[#172b4d] placeholder-[#a5adba] outline-none focus:border-[#0078d4] focus:ring-2 focus:ring-[#0078d4]/20"
              />
            </div>

            <div>
              <label className="text-[11px] font-semibold text-[#6b778c] uppercase tracking-wide">
                Category Slug
              </label>
              <input
                value={form.slug}
                onChange={(e) =>
                  setForm((prev) => ({
                    ...prev,
                    slug: slugify(e.target.value),
                  }))
                }
                placeholder="category-slug"
                className="mt-1 w-full bg-[#fafbfc] border border-[#dfe1e6] rounded px-3 py-2.5 text-[13px] text-[#172b4d] placeholder-[#a5adba] outline-none focus:border-[#0078d4] focus:ring-2 focus:ring-[#0078d4]/20"
              />
            </div>

            <div>
              <label className="text-[11px] font-semibold text-[#6b778c] uppercase tracking-wide">
                Category Image
              </label>
              <div className="relative mt-1 h-28 border-2 border-dashed border-[#dfe1e6] rounded bg-[#fafbfc] hover:border-[#0078d4] transition-colors overflow-hidden">
                {form.imagePreview ? (
                  <img
                    src={form.imagePreview}
                    alt="Category preview"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="h-full flex flex-col items-center justify-center text-[#a5adba]">
                    <ImagePlus size={18} />
                    <span className="text-[11px] mt-1">Upload Image</span>
                  </div>
                )}
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="absolute inset-0 opacity-0 cursor-pointer"
                />
              </div>
            </div>

            <div className="flex gap-2 pt-1">
              <button
                onClick={saveCategory}
                disabled={saving}
                className="flex-1 h-9 rounded bg-[#0078d4] text-white text-[13px] font-medium hover:bg-[#106ebe] transition-colors disabled:opacity-60 flex items-center justify-center gap-1.5"
              >
                {saving ? (
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <Plus size={14} />
                )}
                {form.id ? 'Update' : 'Create'}
              </button>
              {form.id && (
                <button
                  onClick={resetForm}
                  className="h-9 px-3 rounded border border-[#dfe1e6] text-[13px] font-medium text-[#6b778c] hover:bg-[#f4f5f7]"
                >
                  <X size={14} />
                </button>
              )}
            </div>
          </div>
        </div>

        <div className="xl:col-span-2 bg-white border border-[#dfe1e6] rounded-lg overflow-hidden">
          <div className="px-4 py-3 border-b border-[#dfe1e6] bg-[#fafbfc]">
            <h2 className="text-[14px] font-semibold text-[#172b4d]">
              Categories ({categories.length})
            </h2>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-16">
              <div className="w-7 h-7 border-2 border-[#0078d4] border-t-transparent rounded-full animate-spin" />
            </div>
          ) : categories.length === 0 ? (
            <div className="py-16 text-center text-[#6b778c] text-[13px]">
              No categories found.
            </div>
          ) : (
            <div className="divide-y divide-[#f4f5f7]">
              {categories.map((category) => {
                const count = productCountByCategory[category.name] || 0;
                return (
                  <div
                    key={category.id}
                    className="p-4 flex items-center justify-between gap-3 hover:bg-[#fafbfc] transition-colors"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-12 h-12 rounded border border-[#dfe1e6] overflow-hidden bg-[#f4f5f7] shrink-0">
                        {category.img ? (
                          <img
                            src={category.img}
                            alt={category.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-[#a5adba]">
                            <Tag size={14} />
                          </div>
                        )}
                      </div>
                      <div className="min-w-0">
                        <p className="text-[13px] font-medium text-[#172b4d] truncate">
                          {category.name}
                        </p>
                        <p className="text-[11px] text-[#a5adba] truncate">
                          /{category.slug || slugify(category.name || '')}
                        </p>
                        <p className="text-[11px] text-[#6b778c]">
                          {count} products
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => startEdit(category)}
                        className="p-2 rounded hover:bg-[#e9f2ff] text-[#6b778c] hover:text-[#0078d4] transition-colors"
                        title="Edit"
                      >
                        <Edit2 size={14} />
                      </button>
                      <button
                        onClick={() => handleDelete(category)}
                        className="p-2 rounded hover:bg-[#ffebe6] text-[#6b778c] hover:text-[#de350b] transition-colors"
                        title="Delete"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
