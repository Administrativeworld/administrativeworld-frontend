import React, { useEffect, useState } from 'react';
import { AlertDialog, AlertDialogContent, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Check, Upload, X } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import imageCompression from 'browser-image-compression';
import axios from 'axios';
import toast from 'react-hot-toast';
import { fetchBooks } from '@/redux/api/booksSlice';
import PrimarySpinner from '@/components/Loaders/PrimarySpinner';

function CreateCombo() {
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({
    comboTitle: '',
    comboDescription: '',
    comboPrice: '',
    isFree: false,
    finalPrice: '',
    thumbnail: null,
    includedMaterials: []
  });
  const { books, loading, filters, meta } = useSelector((state) => state.books);

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedBooks, setSelectedBooks] = useState([]);
  const [thumbnailPreview, setThumbnailPreview] = useState(null);
  const [uploading, setUploading] = useState(false)

  useEffect(() => {
    dispatch(fetchBooks({ ...filters, adminView: true }));
  }, [dispatch, filters]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleThumbnailUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData(prev => ({ ...prev, thumbnail: file }));
      const reader = new FileReader();
      reader.onload = (e) => setThumbnailPreview(e.target.result);
      reader.readAsDataURL(file);
    }
  };

  const toggleBookSelection = (bookId) => {
    setSelectedBooks(prev =>
      prev.includes(bookId)
        ? prev.filter(id => id !== bookId)
        : [...prev, bookId]
    );
  };

  const handleSelectBooks = () => {
    setFormData(prev => ({
      ...prev,
      includedMaterials: selectedBooks
    }));
    setIsDialogOpen(false);
  };
  const resetForm = () => {
    setFormData({
      comboTitle: '',
      comboDescription: '',
      comboPrice: '',
      isFree: false,
      finalPrice: '',
      thumbnail: null,
      includedMaterials: []
    })
    setSelectedBooks([])
    setThumbnailPreview(null)
  }
  const compressImage = async (imageFile) => {
    const options = {
      maxSizeMB: 1,
      maxWidthOrHeight: 1000,
      useWebWorker: true,
    };
    return await imageCompression(imageFile, options);
  };
  const uploadToCloudinary = async (file, url, uploadPreset, resourceType) => {
    try {
      const { data: signatureData } = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/generate/generateSignature`,
        {
          uploadPreset: uploadPreset,
          resourceType: resourceType // ✅ Include resourceType in signature request
        }
      );

      const cloudinaryFormData = new FormData();
      cloudinaryFormData.append("file", file);
      cloudinaryFormData.append("api_key", import.meta.env.VITE_CLOUDINARY_API_KEY);
      cloudinaryFormData.append("upload_preset", uploadPreset);
      cloudinaryFormData.append("resource_type", resourceType);
      cloudinaryFormData.append("timestamp", signatureData.timestamp);
      cloudinaryFormData.append("signature", signatureData.signature);

      const response = await axios.post(url, cloudinaryFormData);

      return response.data;
    } catch (error) {
      throw new Error(`Upload failed: ${error.response?.data?.error?.message || error.message}`);
    }
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    setUploading(true)
    try {
      const { comboDescription, comboPrice, comboTitle, finalPrice, includedMaterials, isFree, thumbnail } = formData;
      if (!thumbnail) {
        toast.error("Thumbnail file is required");
        setUploading(false);
        return;
      }

      if (!comboDescription || !comboPrice || !comboTitle || !finalPrice || !includedMaterials) {
        toast.error("All required fields must be filled");
        setUploading(false);
        return;
      }

      const compressedThumbnail = await compressImage(thumbnail);


      const thumbnailData = await uploadToCloudinary(
        compressedThumbnail,
        import.meta.env.VITE_CLOUDINARY_URL,
        import.meta.env.VITE_AW_COURSES_UPLOAD_PRESET,
        "image"
      )
      const updatedFormData = {
        comboDescription: comboDescription,
        comboPrice: comboPrice,
        comboTitle: comboTitle,
        finalPrice: finalPrice,
        includedMaterials: includedMaterials,
        isFree: isFree,
        thumbnailUrl: thumbnailData.secure_url,
        thumbnail_public_id: thumbnailData.public_id,
        thumbnail_format: thumbnailData.format,
        status: "Published"
      };

      const response = await axios.post(`${import.meta.env.VITE_BASE_URL}/store/createBooksCombo`, { updatedFormData }, { withCredentials: true });

      if (response.status === 201) {
        toast.success("Combo created successfully!");
        setUploading(false)
        resetForm();
      } else {
        toast.error("Unexpected response from the server.");
        setUploading(false)
      }
    } catch (error) {
      console.error("Upload Error:", error);
      toast.error(error.response?.data?.message || "Something went wrong");
    } finally {
      setUploading(false);
    }
  };

  const getSelectedBooksDetails = () => {
    return books.filter(book => selectedBooks.includes(book._id));
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-background rounded-lg border shadow-sm">
      <h2 className="text-2xl font-semibold text-foreground mb-6">Create New Combo</h2>

      <div className="space-y-6">
        {/* Combo Title */}
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            Combo Title *
          </label>
          <input
            type="text"
            name="comboTitle"
            value={formData.comboTitle}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-input rounded-md bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-input"
            placeholder="Enter combo title"
            required
          />
        </div>

        {/* Combo Description */}
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            Combo Description *
          </label>
          <textarea
            name="comboDescription"
            value={formData.comboDescription}
            onChange={handleInputChange}
            rows={4}
            className="w-full px-3 py-2 border border-input rounded-md bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-input"
            placeholder="Enter combo description"
            required
          />
        </div>

        {/* Price Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Combo Price (₹) *
            </label>
            <input
              type="number"
              name="comboPrice"
              value={formData.comboPrice}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-input rounded-md bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-input"
              placeholder="0"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Final Price (₹) *
            </label>
            <input
              type="number"
              name="finalPrice"
              value={formData.finalPrice}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-input rounded-md bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-input"
              placeholder="0"
              required
            />
          </div>
        </div>

        {/* Is Free Checkbox */}
        <div className="flex items-center">
          <input
            type="checkbox"
            name="isFree"
            checked={formData.isFree}
            onChange={handleInputChange}
            className="h-4 w-4 text-primary focus:ring-ring border-input rounded"
          />
          <label className="ml-2 block text-sm text-foreground">
            This combo is free
          </label>
        </div>

        {/* Thumbnail Upload */}
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            Combo Thumbnail
          </label>
          <div className="flex items-center space-x-4">
            <div className="flex-1">
              <input
                type="file"
                accept="image/*"
                onChange={handleThumbnailUpload}
                className="hidden"
                id="thumbnail-upload"
              />
              <label
                htmlFor="thumbnail-upload"
                className="flex items-center justify-center px-4 py-2 border border-input rounded-md cursor-pointer hover:bg-accent hover:text-accent-foreground focus:outline-none focus:ring-2 focus:ring-ring"
              >
                <Upload className="w-4 h-4 mr-2" />
                Upload Thumbnail
              </label>
            </div>
            {thumbnailPreview && (
              <div className="relative">
                <img
                  src={thumbnailPreview}
                  alt="Thumbnail preview"
                  className="w-16 h-16 object-cover rounded-md"
                />
                <button
                  type="button"
                  onClick={() => {
                    setThumbnailPreview(null);
                    setFormData(prev => ({ ...prev, thumbnail: null }));
                  }}
                  className="absolute -top-2 -right-2 bg-destructive text-destructive-foreground rounded-full w-5 h-5 flex items-center justify-center text-xs hover:bg-destructive/80"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Select Books Button */}
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            Included Materials
          </label>
          <AlertDialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <AlertDialogTrigger asChild>
              <button
                type="button"
                className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-ring"
              >
                Select Books ({selectedBooks.length} selected)
              </button>
            </AlertDialogTrigger>
            <AlertDialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
              <AlertDialogHeader>
                <AlertDialogTitle>Select Books for Combo</AlertDialogTitle>
              </AlertDialogHeader>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
                {books.map((book) => (
                  <div
                    key={book._id}
                    className={`relative border rounded-lg p-4 cursor-pointer transition-all ${selectedBooks.includes(book._id)
                      ? 'border-primary bg-primary/10'
                      : 'border-border hover:border-primary/50'
                      }`}
                    onClick={() => toggleBookSelection(book._id)}
                  >
                    {selectedBooks.includes(book._id) && (
                      <div className="absolute top-2 right-2 bg-primary text-primary-foreground rounded-full w-6 h-6 flex items-center justify-center">
                        <Check className="w-4 h-4" />
                      </div>
                    )}
                    <img
                      src={book.thumbnailUrl}
                      alt={book.title}
                      className="w-full h-32 object-cover rounded-md mb-3"
                    />
                    <h3 className="font-semibold text-sm text-foreground mb-1 line-clamp-2">
                      {book.title}
                    </h3>
                    <p className="text-xs text-muted-foreground mb-2">by {book.author}</p>
                    <p className="text-sm font-bold text-green-600">₹{book.price}</p>
                  </div>
                ))}
              </div>
              <div className="flex justify-end space-x-3 mt-6">
                <button
                  type="button"
                  onClick={() => setIsDialogOpen(false)}
                  className="px-4 py-2 border border-input rounded-md text-foreground hover:bg-accent hover:text-accent-foreground"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleSelectBooks}
                  className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
                >
                  Select Books ({selectedBooks.length})
                </button>
              </div>
            </AlertDialogContent>
          </AlertDialog>
        </div>

        {/* Selected Books Preview */}
        {selectedBooks.length > 0 && (
          <div>
            <h3 className="text-sm font-medium text-foreground mb-3">Selected Books:</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {getSelectedBooksDetails().map((book) => (
                <div key={book._id} className="flex items-center space-x-3 bg-muted p-3 rounded-md">
                  <img
                    src={book.thumbnailUrl}
                    alt={book.title}
                    className="w-12 h-12 object-cover rounded-md"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground truncate">{book.title}</p>
                    <p className="text-xs text-muted-foreground">₹{book.price}</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => toggleBookSelection(book._id)}
                    className="text-destructive hover:text-destructive/80"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Submit Button */}
        <div className="flex justify-end space-x-4">
          <button
            type="button"
            disabled
            className="px-6 py-2 border border-input rounded-md text-muted-foreground bg-muted cursor-not-allowed opacity-50"
          >
            Save as Draft
          </button>
          {
            !uploading ? (<button
              type="submit"
              onClick={handleSubmit}
              className="px-6 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-ring"
            >
              Publish Combo
            </button>) : (<button
              type="submit"
              disabled
              className="px-6 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-ring"
            >
              Publish Combo <PrimarySpinner />
            </button>)
          }

        </div>
      </div>
    </div>
  );
}

export default CreateCombo;