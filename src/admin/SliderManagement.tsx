"use client";
import { useState, useEffect } from 'react';
import { Plus, UploadCloud, Eye, Pencil, Trash, X } from 'lucide-react';
import { db, storage } from '../firebaseConfig';
import toast from 'react-hot-toast';
import {
  collection,
  addDoc,
  onSnapshot,
  query,
  orderBy,
  doc,
  updateDoc,
  deleteDoc,
} from 'firebase/firestore';
import {
  ref,
  uploadBytes,
  getDownloadURL,
  deleteObject,
} from 'firebase/storage';

const SliderManagement = () => {
  const [sliders, setSliders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [openModal, setOpenModal] = useState(false);

  // Edit Mode Tracking
  const [isEditing, setIsEditing] = useState(false);
  const [currentEditId, setCurrentEditId] = useState(null);

  // Form States
  const [title, setTitle] = useState('');
  const [subTitle, setSubTitle] = useState('');
  const [desc, setDesc] = useState('');
  const [imagePreview, setImagePreview] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [oldImageUrl, setOldImageUrl] = useState('');

  // Other Modal States
  const [previewSlide, setPreviewSlide] = useState(null);
  const [deleteSlide, setDeleteSlide] = useState(null);

  // Fetch Data
  useEffect(() => {
    const q = query(collection(db, 'Sliders'), orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setSliders(snapshot.docs.map((d) => ({ id: d.id, ...d.data() })));
    });
    return () => unsubscribe();
  }, []);

  const handleImage = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  // --- EDIT BUTTON CLICK (Prefill Logic) ---
  const openEditModal = (item) => {
    setIsEditing(true);
    setCurrentEditId(item.id);
    setTitle(item.title);
    setSubTitle(item.subTitle);
    setDesc(item.desc);
    setImagePreview(item.imageUrl); // UI-la image-ai kaata
    setOldImageUrl(item.imageUrl); // Database update-ukku
    setOpenModal(true);
  };

  const resetForm = () => {
    setTitle('');
    setSubTitle('');
    setDesc('');
    setImagePreview(null);
    setImageFile(null);
    setIsEditing(false);
    setCurrentEditId(null);
    setOldImageUrl('');
    setOpenModal(false);
  };

  // --- SUBMIT (Add or Update) ---
  const handleSaveSlider = async () => {
    if (!title || !desc)
      return toast.error('Please fill Title and Description!');

    setLoading(true);
    try {
      let finalImageUrl = oldImageUrl;

      // Pudhu image upload panna mattum storage process nadakkum
      if (imageFile) {
        // Edit-il image maathunidha palaiya image-ai delete seiyum
        if (isEditing && oldImageUrl) {
          const oldRef = ref(storage, oldImageUrl);
          await deleteObject(oldRef).catch(() => null);
        }

        const imgRef = ref(storage, `Sliders/${Date.now()}-${imageFile.name}`);
        await uploadBytes(imgRef, imageFile);
        finalImageUrl = await getDownloadURL(imgRef);
      }

      if (isEditing) {
        // UPDATE Logic
        await updateDoc(doc(db, 'Sliders', currentEditId), {
          title,
          subTitle,
          desc,
          imageUrl: finalImageUrl,
        });
      } else {
        // ADD Logic
        if (!imageFile) {
          setLoading(false);
          return toast.error('Please upload an image!');
        }
        await addDoc(collection(db, 'Sliders'), {
          title,
          subTitle,
          desc,
          imageUrl: finalImageUrl,
          createdAt: Date.now(),
        });
      }

      resetForm();
    } catch (error) {
      console.error(error);
      toast.error('Error saving data!');
    }
    setLoading(false);
  };

  return (
    <div className="space-y-5 font-sans">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-semibold text-[#172b4d]">Sliders</h1>
          <p className="text-[13px] text-[#6b778c] mt-0.5">
            {sliders.length} banner slides
          </p>
        </div>
        <button
          onClick={() => {
            setIsEditing(false);
            setOpenModal(true);
          }}
          className="flex items-center gap-1.5 bg-[#0078d4] text-white px-4 py-2 rounded text-[13px] font-medium hover:bg-[#106ebe] transition-colors"
        >
          <Plus size={16} /> Add Slide
        </button>
      </div>

      {/* Slider Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {sliders.map((item, index) => (
          <div
            key={item.id}
            className="bg-white rounded-lg border border-[#dfe1e6] overflow-hidden hover:shadow-md transition-shadow"
          >
            <div className="relative h-40 bg-[#f4f5f7] overflow-hidden">
              <img
                src={item.imageUrl}
                className="w-full h-full object-cover"
                alt=""
              />
              <span className="absolute top-2 left-2 bg-white text-[#172b4d] px-2 py-0.5 rounded text-[11px] font-semibold border border-[#dfe1e6]">
                Slide {index + 1}
              </span>
            </div>
            <div className="p-4">
              <h3 className="text-[14px] font-semibold text-[#172b4d] line-clamp-1">
                {item.title}
              </h3>
              <p className="text-[12px] text-[#6b778c] mt-1 line-clamp-2">
                {item.desc}
              </p>
              <div className="flex gap-1.5 mt-3 pt-3 border-t border-[#f4f5f7]">
                <button
                  onClick={() => setPreviewSlide(item)}
                  className="flex-1 flex justify-center py-1.5 rounded text-[#6b778c] hover:bg-[#e9f2ff] hover:text-[#0078d4] transition-colors"
                >
                  <Eye size={15} />
                </button>
                <button
                  onClick={() => openEditModal(item)}
                  className="flex-1 flex justify-center py-1.5 rounded text-[#6b778c] hover:bg-[#fff0b3] hover:text-[#974f0c] transition-colors"
                >
                  <Pencil size={15} />
                </button>
                <button
                  onClick={() => setDeleteSlide(item)}
                  className="flex-1 flex justify-center py-1.5 rounded text-[#6b778c] hover:bg-[#ffebe6] hover:text-[#de350b] transition-colors"
                >
                  <Trash size={15} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add/Edit Modal */}
      {openModal && (
        <div className="fixed inset-0 bg-black/30 flex justify-center items-center z-50 p-4">
          <div className="bg-white w-full max-w-lg rounded-lg shadow-xl overflow-hidden">
            {/* Modal Header */}
            <div className="px-5 py-4 border-b border-[#dfe1e6] flex justify-between items-center bg-[#fafbfc]">
              <div>
                <p className="text-[11px] text-[#6b778c] uppercase font-semibold tracking-wide">
                  Banner Editor
                </p>
                <h3 className="text-[15px] font-semibold text-[#172b4d]">
                  {isEditing ? 'Edit Slide' : 'New Slide'}
                </h3>
              </div>
              <button
                onClick={resetForm}
                className="p-1.5 rounded hover:bg-[#dfe1e6] text-[#6b778c] transition-colors"
              >
                <X size={18} />
              </button>
            </div>

            <div className="p-5 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[11px] font-semibold text-[#6b778c] uppercase tracking-wide">
                    Title
                  </label>
                  <input
                    type="text"
                    className="w-full bg-[#fafbfc] border border-[#dfe1e6] p-2.5 rounded text-[13px] text-[#172b4d] outline-none focus:border-[#0078d4] focus:ring-2 focus:ring-[#0078d4]/20 transition-all"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[11px] font-semibold text-[#6b778c] uppercase tracking-wide">
                    Badge Text
                  </label>
                  <input
                    type="text"
                    className="w-full bg-[#fafbfc] border border-[#dfe1e6] p-2.5 rounded text-[13px] text-[#172b4d] outline-none focus:border-[#0078d4] focus:ring-2 focus:ring-[#0078d4]/20 transition-all"
                    value={subTitle}
                    onChange={(e) => setSubTitle(e.target.value)}
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-semibold text-[#6b778c] uppercase tracking-wide">
                  Description
                </label>
                <textarea
                  className="w-full bg-[#fafbfc] border border-[#dfe1e6] p-2.5 rounded h-20 text-[13px] text-[#172b4d] outline-none focus:border-[#0078d4] focus:ring-2 focus:ring-[#0078d4]/20 transition-all resize-none"
                  value={desc}
                  onChange={(e) => setDesc(e.target.value)}
                />
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-semibold text-[#6b778c] uppercase tracking-wide">
                  Banner Image
                </label>
                <label className="relative w-full h-28 bg-[#fafbfc] border-2 border-dashed border-[#dfe1e6] rounded flex flex-col items-center justify-center cursor-pointer hover:border-[#0078d4] transition-colors overflow-hidden">
                  {imagePreview ? (
                    <div className="w-full h-full relative">
                      <img
                        src={imagePreview}
                        className="w-full h-full object-cover"
                        alt="Preview"
                      />
                      <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                        <p className="text-white text-[11px] font-medium">
                          Change Image
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center">
                      <UploadCloud size={22} className="text-[#a5adba] mb-1" />
                      <p className="text-[11px] text-[#6b778c]">
                        Upload Banner
                      </p>
                    </div>
                  )}
                  <input
                    type="file"
                    className="hidden"
                    onChange={handleImage}
                  />
                </label>
              </div>

              {/* Buttons */}
              <div className="flex gap-2 pt-2">
                <button
                  onClick={resetForm}
                  className="flex-1 py-2 bg-[#f4f5f7] border border-[#dfe1e6] text-[#42526e] rounded text-[13px] font-medium hover:bg-[#ebecf0] transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveSlider}
                  disabled={loading}
                  className="flex-[2] py-2 bg-[#0078d4] text-white rounded text-[13px] font-medium hover:bg-[#106ebe] transition-colors disabled:opacity-50"
                >
                  {loading
                    ? 'Saving...'
                    : isEditing
                      ? 'Save Changes'
                      : 'Publish'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Preview Modal */}
      {previewSlide && (
        <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50 p-4">
          <div className="bg-white w-full max-w-sm rounded-lg overflow-hidden shadow-xl relative">
            <div className="h-[400px] relative">
              <img
                src={previewSlide.imageUrl}
                className="w-full h-full object-cover"
                alt=""
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent"></div>
              <div className="absolute bottom-6 left-5 right-5 text-white">
                {previewSlide.subTitle && (
                  <span className="bg-[#0078d4] text-[11px] font-medium px-2.5 py-0.5 rounded mb-2 inline-block">
                    {previewSlide.subTitle}
                  </span>
                )}
                <h2 className="text-2xl font-semibold leading-tight mb-2">
                  {previewSlide.title}
                </h2>
                <p className="text-white/70 text-[13px]">{previewSlide.desc}</p>
              </div>
            </div>
            <button
              onClick={() => setPreviewSlide(null)}
              className="absolute top-3 right-3 bg-white/20 backdrop-blur-sm p-1.5 rounded text-white hover:bg-white/40 transition-colors"
            >
              <X size={18} />
            </button>
          </div>
        </div>
      )}

      {/* Delete Modal */}
      {deleteSlide && (
        <div className="fixed inset-0 bg-black/30 flex justify-center items-center z-50 p-4">
          <div className="bg-white w-full max-w-sm p-6 rounded-lg shadow-xl text-center">
            <div className="w-12 h-12 bg-[#ffebe6] text-[#de350b] rounded-full flex items-center justify-center mx-auto mb-4">
              <Trash size={24} />
            </div>
            <h3 className="text-[15px] font-semibold text-[#172b4d] mb-1">
              Delete Slide?
            </h3>
            <p className="text-[13px] text-[#6b778c] mb-5">
              This banner will be permanently removed.
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => setDeleteSlide(null)}
                className="flex-1 py-2 bg-[#f4f5f7] border border-[#dfe1e6] text-[#42526e] rounded text-[13px] font-medium hover:bg-[#ebecf0] transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={async () => {
                  const fileRef = ref(storage, deleteSlide.imageUrl);
                  await deleteObject(fileRef).catch(() => null);
                  await deleteDoc(doc(db, 'Sliders', deleteSlide.id));
                  setDeleteSlide(null);
                }}
                className="flex-1 py-2 bg-[#de350b] text-white rounded text-[13px] font-medium hover:bg-[#bf2600] transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SliderManagement;
