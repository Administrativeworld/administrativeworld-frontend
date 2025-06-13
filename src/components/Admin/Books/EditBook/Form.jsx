import React, { useEffect, useState, useCallback } from 'react';
import { Upload, Image, FileText, Type, AlignLeft, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import imageCompression from "browser-image-compression";
import axios from 'axios';
import toast from 'react-hot-toast';
import PrimarySpinner from '@/components/Loaders/PrimarySpinner';
import { useLocation, useNavigate } from 'react-router-dom';

// Constants
const CONTENT_TYPES = [
  { value: 'Notes', label: 'Notes' },
  { value: 'TestSeries', label: 'Test Series' },
  { value: 'Material', label: 'Material' },
  { value: 'Books', label: 'Books' }
];

const INITIAL_FORM_STATE = {
  title: '',
  author: '',
  description: '',
  type: '',
  price: '',
  thumbnailFile: null,
  pdfFile: null,
  thumbnail_public_id: null,
  pdf_public_id: null,
  thumbnail_format: null,
  pdf_format: null,
};

const IMAGE_COMPRESSION_OPTIONS = {
  maxSizeMB: 1,
  maxWidthOrHeight: 1000,
  useWebWorker: true,
};

const Form = () => {
  const navigate = useNavigate();
  // State management
  const [formData, setFormData] = useState(INITIAL_FORM_STATE);
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(false);
  const [thumbnailPreview, setThumbnailPreview] = useState('');
  const [thumbnailFileName, setThumbnailFileName] = useState('');
  const [pdfFileName, setPdfFileName] = useState('');
  const [bookData, setBookData] = useState(null);

  // URL parsing
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const bookId = queryParams.get('id');
  const isEditMode = !!bookId;

  // Utility functions
  const resetForm = useCallback(() => {
    setFormData(INITIAL_FORM_STATE);
    setThumbnailPreview('');
    setThumbnailFileName('');
    setPdfFileName('');
  }, []);

  const handleInputChange = useCallback((field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  }, []);

  const compressImage = useCallback(async (imageFile) => {
    try {
      return await imageCompression(imageFile, IMAGE_COMPRESSION_OPTIONS);
    } catch (error) {
      console.error('Image compression failed:', error);
      throw new Error('Failed to compress image');
    }
  }, []);

  // File handling functions
  const handleThumbnailFileChange = useCallback((e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast.error('Please select a valid image file');
      return;
    }

    handleInputChange('thumbnailFile', file);
    setThumbnailFileName(file.name);

    const reader = new FileReader();
    reader.onload = (e) => {
      setThumbnailPreview(e.target.result);
    };
    reader.onerror = () => {
      toast.error('Failed to read image file');
    };
    reader.readAsDataURL(file);
  }, [handleInputChange]);

  const handlePdfFileChange = useCallback((e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.type !== 'application/pdf') {
      toast.error('Please select a valid PDF file');
      return;
    }

    handleInputChange('pdfFile', file);
    setPdfFileName(file.name);
  }, [handleInputChange]);

  // API functions
  const uploadToCloudinary = useCallback(async (file, url, uploadPreset, resourceType) => {
    try {
      // Get signature from backend
      const { data: signatureData } = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/generate/generateSignature`,
        {
          uploadPreset: uploadPreset,
          resourceType: resourceType
        },
        { withCredentials: true }
      );

      // Prepare form data for Cloudinary
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
      console.error('Cloudinary upload failed:', error);
      throw new Error(`Upload failed: ${error.response?.data?.error?.message || error.message}`);
    }
  }, []);

  const deleteExistingFiles = useCallback(async (bookId) => {
    const deletePromises = [];

    // Delete existing thumbnail
    deletePromises.push(
      axios.post(
        `${import.meta.env.VITE_BASE_URL}/store/deleteBookThumbnail`,
        { bookId },
        { withCredentials: true }
      ).catch(error => {
        console.warn('Failed to delete existing thumbnail:', error);
        // Don't throw error, just log warning
      })
    );

    // Delete existing PDF
    deletePromises.push(
      axios.post(
        `${import.meta.env.VITE_BASE_URL}/store/deleteBookPdf`,
        { bookId },
        { withCredentials: true }
      ).catch(error => {
        console.warn('Failed to delete existing PDF:', error);
        // Don't throw error, just log warning
      })
    );

    await Promise.allSettled(deletePromises);
  }, []);

  const fetchBookData = useCallback(async () => {
    if (!bookId) return;

    try {
      setLoading(true);
      const response = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/store/getBookByIdAdmin`,
        { bookId: bookId },
        { withCredentials: true }
      );

      if (response.data.success) {
        const book = response.data.data;
        setBookData(book);

        // Populate form with existing data
        setFormData({
          title: book.title || '',
          author: book.author || '',
          description: book.description || '',
          type: book.type || '',
          price: book.price?.toString() || '',
          thumbnailFile: null,
          pdfFile: null,
          thumbnail_public_id: book.thumbnail_public_id || null,
          pdf_public_id: book.pdf_public_id || null,
          thumbnail_format: book.thumbnail_format || null,
          pdf_format: book.pdf_format || null,
        });

        // Set preview for existing thumbnail
        if (book.thumbnailUrl) {
          setThumbnailPreview(book.thumbnailUrl);
          setThumbnailFileName('Current thumbnail');
        }

        // Set filename for existing PDF
        if (book.downloadUrl) {
          setPdfFileName('Current PDF file');
        }
      } else {
        toast.error(response.data.message || "Failed to load book data");
      }
    } catch (error) {
      console.error("Error fetching book data:", error);
      toast.error(error.response?.data?.message || "Failed to load book data");
    } finally {
      setLoading(false);
    }
  }, [bookId]);

  // Form validation
  const validateForm = useCallback(() => {
    const { title, description, type, author, price, thumbnailFile, pdfFile } = formData;

    if (!title?.trim()) {
      toast.error("Title is required");
      return false;
    }

    if (!description?.trim()) {
      toast.error("Description is required");
      return false;
    }

    if (!type) {
      toast.error("Content type is required");
      return false;
    }

    if (!author?.trim()) {
      toast.error("Author name is required");
      return false;
    }

    if (price === "" || price < 0) {
      toast.error("Valid price is required");
      return false;
    }

    // For new books, require files. For edits, files are optional
    if (!isEditMode) {
      if (!thumbnailFile) {
        toast.error("Thumbnail image is required");
        return false;
      }

      if (!pdfFile) {
        toast.error("PDF file is required");
        return false;
      }
    }

    return true;
  }, [formData, isEditMode]);

  // Form submission
  const handleSubmit = useCallback(async () => {
    if (!validateForm()) {
      return;
    }

    try {
      setUploading(true);

      const { thumbnailFile, pdfFile, title, description, type, author, price } = formData;

      let updatedFormData = {
        title: title.trim(),
        description: description.trim(),
        type,
        author: author.trim(),
        price: parseFloat(price),
        status: "Published",
        isFree: false,
        thumbnailUrl: "",
        downloadUrl: "",
        thumbnail_public_id: "",
        pdf_public_id: "",
        thumbnail_format: "",
        pdf_format: "",
        thumbnail_bytes: "",
        pdf_bytes: "",
      };

      // Delete existing files if we're updating and have new files
      if (isEditMode && (thumbnailFile || pdfFile)) {
        await deleteExistingFiles(bookId);
      }

      // Handle file uploads
      const uploadPromises = [];

      if (thumbnailFile) {
        const compressedThumbnail = await compressImage(thumbnailFile);
        uploadPromises.push(
          uploadToCloudinary(
            compressedThumbnail,
            import.meta.env.VITE_CLOUDINARY_URL,
            import.meta.env.VITE_AW_COURSES_UPLOAD_PRESET,
            "image"
          )
        );
      }

      if (pdfFile) {
        uploadPromises.push(
          uploadToCloudinary(
            pdfFile,
            import.meta.env.VITE_CLOUDINARY_RAW_URL,
            import.meta.env.VITE_AW_BOOKPDF_UPLOAD_PRESET,
            "raw"
          )
        );
      }

      // Wait for uploads to complete
      const uploadResults = await Promise.all(uploadPromises);
      // Process upload results
      let resultIndex = 0;

      if (thumbnailFile && uploadResults[resultIndex]) {
        const thumbnailData = uploadResults[resultIndex];
        console.log(thumbnailData)
        updatedFormData.thumbnailUrl = thumbnailData.secure_url;
        updatedFormData.thumbnail_public_id = thumbnailData.public_id;
        updatedFormData.thumbnail_format = thumbnailData.format;
        updatedFormData.thumbnail_bytes = thumbnailData.bytes;
        resultIndex++;
      } else if (isEditMode && bookData) {
        // Keep existing thumbnail data
        updatedFormData.thumbnailUrl = bookData.thumbnailUrl;
        updatedFormData.thumbnail_public_id = bookData.thumbnail_public_id;
        updatedFormData.thumbnail_format = bookData.thumbnail_format;
        updatedFormData.thumbnail_bytes = bookData.thumbnail_bytes;
      }

      if (pdfFile && uploadResults[resultIndex]) {
        const pdfData = uploadResults[resultIndex];
        updatedFormData.downloadUrl = pdfData.secure_url;
        updatedFormData.pdf_public_id = pdfData.public_id;
        updatedFormData.pdf_format = pdfData.format;
        updatedFormData.pdf_bytes = pdfData.bytes;
      } else if (isEditMode && bookData) {
        // Keep existing PDF data
        updatedFormData.downloadUrl = bookData.downloadUrl;
        updatedFormData.pdf_public_id = bookData.pdf_public_id;
        updatedFormData.pdf_format = bookData.pdf_format;
        updatedFormData.pdf_bytes = bookData.pdf_bytes;
      }

      // Submit to backend
      const endpoint = isEditMode
        ? `${import.meta.env.VITE_BASE_URL}/store/updateBook/?bookId=${bookId}`
        : `${import.meta.env.VITE_BASE_URL}/store/createProduct`;

      const response = await axios.post(
        endpoint,
        updatedFormData,
        { withCredentials: true }
      );

      if (response.data.success) {
        toast.success(isEditMode ? "Book updated successfully" : "Content created successfully");
        navigate('/admin/books/published')
        if (!isEditMode) {
          resetForm();
        }
      } else {
        toast.error(response.data.message || "Unexpected response from server");
      }
    } catch (error) {
      console.error("Submit Error:", error);
      toast.error(error.response?.data?.message || "Something went wrong");
    } finally {
      setUploading(false);
    }
  }, [
    validateForm,
    formData,
    isEditMode,
    bookId,
    bookData,
    deleteExistingFiles,
    compressImage,
    uploadToCloudinary,
    resetForm
  ]);

  // Effects
  useEffect(() => {
    fetchBookData();
  }, [fetchBookData]);

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background to-muted/20 p-4 flex items-center justify-center">
        <div className="flex items-center gap-2">
          <PrimarySpinner />
          <span>Loading book data...</span>
        </div>
      </div>
    );
  }

  // Render component
  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/20 p-4">
      <div className="max-w-6xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-center justify-center">
              <FileText className="h-6 w-6" />
              {isEditMode ? 'Edit Book' : 'Create Content'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {/* Basic Information */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
              <div className="space-y-2">
                <Label htmlFor="title" className="flex items-center gap-2">
                  <Type className="h-4 w-4" />
                  Title *
                </Label>
                <Input
                  id="title"
                  type="text"
                  placeholder="Enter content title"
                  value={formData.title}
                  onChange={(e) => handleInputChange('title', e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="author" className="flex items-center gap-2">
                  <User className="h-4 w-4" />
                  Author Name *
                </Label>
                <Input
                  id="author"
                  type="text"
                  placeholder="Enter author name"
                  value={formData.author}
                  onChange={(e) => handleInputChange('author', e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="type" className="flex items-center gap-2">
                  <FileText className="h-4 w-4" />
                  Content Type *
                </Label>
                <Select
                  value={formData.type}
                  onValueChange={(value) => handleInputChange('type', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select content type" />
                  </SelectTrigger>
                  <SelectContent>
                    {CONTENT_TYPES.map((type) => (
                      <SelectItem key={type.value} value={type.value}>
                        {type.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Description and Price */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
              <div className="lg:col-span-2 space-y-2">
                <Label htmlFor="description" className="flex items-center gap-2">
                  <AlignLeft className="h-4 w-4" />
                  Description *
                </Label>
                <Textarea
                  id="description"
                  placeholder="Enter content description"
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  rows={4}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="price" className="flex items-center gap-2">
                  <span className="text-lg">₹</span>
                  Price *
                </Label>
                <Input
                  id="price"
                  type="number"
                  placeholder="0.00"
                  min="0"
                  step="0.01"
                  value={formData.price}
                  onChange={(e) => handleInputChange('price', e.target.value)}
                />
              </div>
            </div>

            {/* File Uploads */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
              {/* Thumbnail Upload */}
              <div className="space-y-2">
                <Label className="flex items-center gap-2">
                  <Image className="h-4 w-4" />
                  Thumbnail Image {!isEditMode && '*'}
                </Label>
                <div className="border-2 border-dashed border-border rounded-lg p-4 hover:border-primary/50 transition-colors">
                  <div className="text-center">
                    {thumbnailPreview ? (
                      <div className="space-y-3">
                        <img
                          src={thumbnailPreview}
                          alt="Thumbnail preview"
                          className="max-w-full max-h-32 mx-auto rounded-md border"
                        />
                        <div className="space-y-2">
                          <p className="text-xs font-medium truncate">{thumbnailFileName}</p>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => document.getElementById('thumbnail-upload')?.click()}
                          >
                            Change Image
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <div>
                        <Image className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => document.getElementById('thumbnail-upload')?.click()}
                        >
                          Choose Image
                        </Button>
                        <p className="text-xs text-muted-foreground mt-2">
                          Select image file
                        </p>
                      </div>
                    )}
                    <input
                      id="thumbnail-upload"
                      type="file"
                      accept="image/*"
                      onChange={handleThumbnailFileChange}
                      className="hidden"
                    />
                  </div>
                </div>
              </div>

              {/* PDF Upload */}
              <div className="space-y-2">
                <Label className="flex items-center gap-2">
                  <Upload className="h-4 w-4" />
                  PDF File {!isEditMode && '*'}
                </Label>
                <div className="border-2 border-dashed border-border rounded-lg p-4 hover:border-primary/50 transition-colors">
                  <div className="text-center">
                    <Upload className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
                    <div className="space-y-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => document.getElementById('pdf-upload')?.click()}
                      >
                        {pdfFileName && pdfFileName !== 'Current PDF file' ? 'Change PDF File' : 'Choose PDF File'}
                      </Button>
                      <input
                        id="pdf-upload"
                        type="file"
                        accept=".pdf"
                        onChange={handlePdfFileChange}
                        className="hidden"
                      />
                      <p className="text-xs text-muted-foreground">
                        {pdfFileName || 'Select PDF file'}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t">
              <Button
                onClick={handleSubmit}
                className="flex-1 p-3"
                size="lg"
                disabled={uploading}
              >
                {uploading ? (
                  <div className="flex items-center justify-center gap-2">
                    <PrimarySpinner />
                    <span>{isEditMode ? 'Updating...' : 'Creating...'}</span>
                  </div>
                ) : (
                  <span className="text-base">
                    {isEditMode ? 'Update Book' : 'Create Content'}
                  </span>
                )}
              </Button>
              <Button
                variant="outline"
                onClick={resetForm}
                className="flex-1 p-3"
                size="lg"
                disabled={uploading}
              >
                Reset Form
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Form;