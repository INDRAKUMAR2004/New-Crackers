"use client";
import { useEffect, useMemo, useState } from 'react';
import {
  collection,
  onSnapshot,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  query,
} from 'firebase/firestore';
import {
  getStorage,
  ref as storageRef,
  uploadBytes,
  getDownloadURL,
  deleteObject,
} from 'firebase/storage';
import { Edit2, Trash2, Plus, X, ImagePlus, Tag, ArrowUp, ArrowDown, ArrowLeft, ArrowRight, LayoutGrid, List } from 'lucide-react';
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
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [viewMode, setViewMode] = useState('list'); // 'list' or 'grid'

  useEffect(() => {
    const q = query(collection(db, 'categories'));
    const unsub = onSnapshot(
      q,
      (snapshot) => {
        let docs = snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
        docs.sort((a, b) => (Number(a.sortOrder) || 0) - (Number(b.sortOrder) || 0));
        setCategories(docs);
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
          setSaving(false);
          return;
        }
        await addDoc(collection(db, 'categories'), {
          name: trimmedName,
          slug: uniqueSlug,
          img: imageUrl,
          sortOrder: categories.length, // Add to end of list
          createdAt: new Date(),
          updatedAt: new Date(),
        });
        toast.success('Category created');
      }

      resetForm();
      setIsModalOpen(false);
    } catch (error) {
      console.error(error);
      toast.error('Unable to save category');
    } finally {
      setSaving(false);
    }
  };

  const openAddModal = () => {
    resetForm();
    setIsModalOpen(true);
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
    setIsModalOpen(true);
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
        setIsModalOpen(false);
      }

      toast.success('Category deleted');
    } catch (error) {
      console.error(error);
      toast.error('Unable to delete category');
    }
  };

  const handleSort = async (index, direction) => {
    if (direction === 'up' && index === 0) return;
    if (direction === 'down' && index === categories.length - 1) return;

    const newIndex = direction === 'up' ? index - 1 : index + 1;
    const newArray = [...categories];
    
    // Swap the elements
    [newArray[index], newArray[newIndex]] = [newArray[newIndex], newArray[index]];

    // Optimistically update UI
    setCategories(newArray);

    try {
      // Re-assign strict sequential sortOrder to all documents
      await Promise.all(
        newArray.map((cat, i) => updateDoc(doc(db, 'categories', cat.id), { sortOrder: i }))
      );
    } catch (e) {
      console.error(e);
      toast.error('Failed to sort categories');
    }
  };

  return (
    <div className="space-y-5 font-sans relative">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-semibold text-[#172b4d]">
            Category Management
          </h1>
          <p className="text-[13px] text-[#6b778c] mt-0.5">
            Create and manage categories used across user pages.
          </p>
        </div>
        
        <div className="flex items-center gap-2">
          {/* View Toggle */}
          <div className="flex bg-[#fafbfc] border border-[#dfe1e6] rounded p-1">
            <button
              onClick={() => setViewMode('list')}
              className={`p-1.5 rounded flex items-center justify-center transition-colors ${
                viewMode === 'list' 
                  ? 'bg-white shadow-sm text-[#0078d4] border border-[#dfe1e6]/50' 
                  : 'text-[#6b778c] hover:text-[#172b4d]'
              }`}
              title="List View"
            >
              <List size={16} />
            </button>
            <button
              onClick={() => setViewMode('grid')}
              className={`p-1.5 rounded flex items-center justify-center transition-colors ${
                viewMode === 'grid' 
                  ? 'bg-white shadow-sm text-[#0078d4] border border-[#dfe1e6]/50' 
                  : 'text-[#6b778c] hover:text-[#172b4d]'
              }`}
              title="Grid View"
            >
              <LayoutGrid size={16} />
            </button>
          </div>

          <button
            onClick={openAddModal}
            className="flex items-center gap-1.5 bg-[#0078d4] text-white px-4 py-2 rounded text-[13px] font-medium hover:bg-[#106ebe] transition-colors"
          >
            <Plus size={16} /> Add Category
          </button>
        </div>
      </div>

      <div className="bg-white border border-[#dfe1e6] rounded-lg overflow-hidden">
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
        ) : viewMode === 'list' ? (
          <div className="divide-y divide-[#f4f5f7]">
            {categories.map((category, index) => {
              const count = productCountByCategory[category.name] || 0;
              return (
                <div
                  key={category.id}
                  className="p-4 flex items-center justify-between gap-3 hover:bg-[#fafbfc] transition-colors"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="flex flex-col gap-1 mr-2">
                      <button
                        onClick={() => handleSort(index, 'up')}
                        disabled={index === 0}
                        className="text-[#a5adba] hover:text-[#0078d4] disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                      >
                        <ArrowUp size={16} />
                      </button>
                      <button
                        onClick={() => handleSort(index, 'down')}
                        disabled={index === categories.length - 1}
                        className="text-[#a5adba] hover:text-[#0078d4] disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                      >
                        <ArrowDown size={16} />
                      </button>
                    </div>

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
                      <p className="text-[14px] font-medium text-[#172b4d] truncate">
                        {category.name}
                      </p>
                      <p className="text-[12px] text-[#a5adba] truncate">
                        /{category.slug || slugify(category.name || '')}
                      </p>
                      <p className="text-[12px] text-[#6b778c]">
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
                      <Edit2 size={16} />
                    </button>
                    <button
                      onClick={() => handleDelete(category)}
                      className="p-2 rounded hover:bg-[#ffebe6] text-[#6b778c] hover:text-[#de350b] transition-colors"
                      title="Delete"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="p-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {categories.map((category, index) => {
              const count = productCountByCategory[category.name] || 0;
              return (
                <div key={category.id} className="group relative bg-white border border-[#dfe1e6] rounded-lg overflow-hidden hover:border-[#0078d4] transition-colors flex flex-col shadow-sm">
                  <div className="h-36 w-full bg-[#f4f5f7] relative">
                    {category.img ? (
                      <img src={category.img} alt={category.name} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-[#a5adba]">
                        <Tag size={24} />
                      </div>
                    )}
                  </div>
                  
                  <div className="p-3 flex-1 flex flex-col">
                    <p className="text-[14px] font-semibold text-[#172b4d] truncate" title={category.name}>{category.name}</p>
                    <p className="text-[11px] text-[#a5adba] truncate mt-0.5">/{category.slug || slugify(category.name || '')}</p>
                    <p className="text-[11px] font-medium text-[#6b778c] mt-2 bg-[#f4f5f7] inline-block w-fit px-2 py-0.5 rounded-full">{count} products</p>
                  </div>

                  <div className="p-2 border-t border-[#f4f5f7] bg-[#fafbfc] flex items-center justify-between">
                    <div className="flex items-center gap-1">
                      <button 
                        onClick={() => handleSort(index, 'up')} 
                        disabled={index === 0} 
                        className="p-1.5 rounded hover:bg-[#e9f2ff] text-[#6b778c] hover:text-[#0078d4] disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                        title="Move Left"
                      >
                        <ArrowLeft size={16} />
                      </button>
                      <button 
                        onClick={() => handleSort(index, 'down')} 
                        disabled={index === categories.length - 1} 
                        className="p-1.5 rounded hover:bg-[#e9f2ff] text-[#6b778c] hover:text-[#0078d4] disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                        title="Move Right"
                      >
                        <ArrowRight size={16} />
                      </button>
                    </div>
                    <div className="flex items-center gap-1">
                      <button onClick={() => startEdit(category)} className="p-1.5 rounded hover:bg-[#e9f2ff] text-[#6b778c] hover:text-[#0078d4] transition-colors" title="Edit">
                        <Edit2 size={14}/>
                      </button>
                      <button onClick={() => handleDelete(category)} className="p-1.5 rounded hover:bg-[#ffebe6] text-[#6b778c] hover:text-[#de350b] transition-colors" title="Delete">
                        <Trash2 size={14}/>
                      </button>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>

      {/* MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="flex items-center justify-between px-5 py-4 border-b border-[#dfe1e6]">
              <h2 className="text-[16px] font-semibold text-[#172b4d]">
                {form.id ? 'Edit Category' : 'Add Category'}
              </h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-[#6b778c] hover:text-[#172b4d] transition-colors p-1"
              >
                <X size={18} />
              </button>
            </div>

            <div className="p-5 space-y-4">
              <div>
                <label className="text-[12px] font-semibold text-[#6b778c] uppercase tracking-wide">
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
                  className="mt-1.5 w-full bg-[#fafbfc] border border-[#dfe1e6] rounded px-3 py-2.5 text-[14px] text-[#172b4d] placeholder-[#a5adba] outline-none focus:border-[#0078d4] focus:ring-2 focus:ring-[#0078d4]/20"
                />
              </div>

              <div>
                <label className="text-[12px] font-semibold text-[#6b778c] uppercase tracking-wide">
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
                  className="mt-1.5 w-full bg-[#fafbfc] border border-[#dfe1e6] rounded px-3 py-2.5 text-[14px] text-[#172b4d] placeholder-[#a5adba] outline-none focus:border-[#0078d4] focus:ring-2 focus:ring-[#0078d4]/20"
                />
              </div>

              <div>
                <label className="text-[12px] font-semibold text-[#6b778c] uppercase tracking-wide">
                  Category Image
                </label>
                <div className="relative mt-1.5 h-36 border-2 border-dashed border-[#dfe1e6] rounded bg-[#fafbfc] hover:border-[#0078d4] transition-colors overflow-hidden">
                  {form.imagePreview ? (
                    <img
                      src={form.imagePreview}
                      alt="Category preview"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="h-full flex flex-col items-center justify-center text-[#a5adba]">
                      <ImagePlus size={24} />
                      <span className="text-[12px] mt-2">Click to Upload Image</span>
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
            </div>

            <div className="px-5 py-4 border-t border-[#dfe1e6] bg-[#fafbfc] flex justify-end gap-2">
              <button
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 rounded text-[13px] font-medium text-[#42526e] hover:bg-[#ebecf0] transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={saveCategory}
                disabled={saving}
                className="px-4 py-2 rounded bg-[#0078d4] text-white text-[13px] font-medium hover:bg-[#106ebe] transition-colors disabled:opacity-60 flex items-center justify-center min-w-[80px]"
              >
                {saving ? (
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : form.id ? (
                  'Update'
                ) : (
                  'Create'
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
