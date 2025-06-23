import React, { useState, useCallback, useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { ArrowRight, X, Plus, Upload, Image as ImageIcon, Loader2 } from 'lucide-react';
import {
  updateFormData,
  addTag,
  removeTag,
  addKeyword,
  removeKeyword,
  generateSlug,
  selectFormData
} from '@/redux/api/createArticleSlice';
import { getCategory } from '@/redux/api/getCategorySlice';
import imageCompression from 'browser-image-compression';
import axios from 'axios';

const ArticleForm = React.memo(({ onNext }) => {
  const dispatch = useDispatch();
  const formData = useSelector(selectFormData);
  const [tagInput, setTagInput] = useState('');
  const [keywordInput, setKeywordInput] = useState('');
  const [selectedCategory, setSelectedCategory] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState('');
  const fileInputRef = useRef(null);
  const { categories } = useSelector((state) => state.getCategory);

  // Cloudinary configuration
  const CLOUDINARY_CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
  const CLOUDINARY_UPLOAD_PRESET = import.meta.env.VITE_AW_ARTICLE_THUMBNAIL_UPLOAD_PRESET;

  useEffect(() => {
    dispatch(getCategory());
  }, [dispatch]);

  const handleTitleChange = useCallback((title) => {
    dispatch(updateFormData({ title }));
    if (title) {
      dispatch(generateSlug(title));
    }
  }, [dispatch]);

  const handleInputChange = useCallback((field, value) => {
    dispatch(updateFormData({ [field]: value }));
  }, [dispatch]);

  const handleAddTag = useCallback(() => {
    if (tagInput.trim() && !formData.tags.includes(tagInput.trim())) {
      dispatch(addTag(tagInput.trim()));
      setTagInput('');
    }
  }, [tagInput, formData.tags, dispatch]);

  const handleRemoveTag = useCallback((tagToRemove) => {
    dispatch(removeTag(tagToRemove));
  }, [dispatch]);

  const handleAddKeyword = useCallback(() => {
    if (keywordInput.trim() && !formData.keywords.includes(keywordInput.trim())) {
      dispatch(addKeyword(keywordInput.trim()));
      setKeywordInput('');
    }
  }, [keywordInput, formData.keywords, dispatch]);

  const handleRemoveKeyword = useCallback((keywordToRemove) => {
    dispatch(removeKeyword(keywordToRemove));
  }, [dispatch]);

  // Enhanced image compression with multiple options
  const compressImage = async (imageFile) => {
    try {
      const options = {
        maxSizeMB: 1, // Maximum file size in MB
        maxWidthOrHeight: 1920, // Maximum width or height
        useWebWorker: true,
        fileType: 'image/jpeg', // Convert to JPEG for better compression
        initialQuality: 0.8, // Initial quality (0.1 - 1.0)
      };

      console.log('Original file size:', (imageFile.size / 1024 / 1024).toFixed(2), 'MB');

      const compressedFile = await imageCompression(imageFile, options);

      console.log('Compressed file size:', (compressedFile.size / 1024 / 1024).toFixed(2), 'MB');

      return compressedFile;
    } catch (error) {
      console.error('Image compression error:', error);
      throw new Error('Failed to compress image');
    }
  };

  // Fixed Cloudinary upload function
  const uploadImageToCloudinary = async (file) => {
    try {
      // First compress the image
      const compressedFile = await compressImage(file);

      // Get signature from your backend (if using signed uploads)
      let signatureData = null;
      try {
        const signatureResponse = await axios.post(
          `${import.meta.env.VITE_BASE_URL}/generate/generateSignature`,
          {
            uploadPreset: CLOUDINARY_UPLOAD_PRESET,
            resourceType: 'image'
          }
        );
        signatureData = signatureResponse.data;
        console.log("signatureData", signatureData)
      } catch (signatureError) {
        console.log('Signature not available, using unsigned upload');
      }

      // Prepare FormData for Cloudinary
      const cloudinaryFormData = new FormData();
      cloudinaryFormData.append("file", compressedFile);
      cloudinaryFormData.append("upload_preset", CLOUDINARY_UPLOAD_PRESET);

      // Add signature data if available (for signed uploads)
      if (signatureData) {
        cloudinaryFormData.append("api_key", import.meta.env.VITE_CLOUDINARY_API_KEY);
        cloudinaryFormData.append("timestamp", signatureData.timestamp);
        cloudinaryFormData.append("signature", signatureData.signature);
      }

      // Additional upload parameters
      cloudinaryFormData.append("resource_type", "image");

      // Upload to Cloudinary
      const response = await fetch(
        `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`,
        {
          method: 'POST',
          body: cloudinaryFormData,
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        console.error('Cloudinary response error:', errorData);
        throw new Error(errorData.error?.message || 'Upload failed');
      }

      const data = await response.json();
      console.log('Upload successful:', data);

      return data.secure_url;

    } catch (error) {
      console.error('Cloudinary upload error:', error);
      throw error;
    }
  };

  const handleImageSelect = () => {
    if (isUploading) return;
    fileInputRef.current?.click();
  };

  const handleFileChange = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    // Reset any previous errors
    setUploadError('');

    // Validate file type
    if (!file.type.startsWith('image/')) {
      setUploadError('Please select a valid image file (JPEG, PNG, GIF, WebP)');
      return;
    }

    // Validate file size (10MB limit before compression)
    if (file.size > 10 * 1024 * 1024) {
      setUploadError('Image size should be less than 10MB');
      return;
    }

    setIsUploading(true);

    try {
      const secureUrl = await uploadImageToCloudinary(file);
      handleInputChange('thumbnail', secureUrl);
      console.log('Image uploaded successfully:', secureUrl);
    } catch (error) {
      console.error('Upload failed:', error);
      setUploadError(
        error.message || 'Failed to upload image. Please try again.'
      );
    } finally {
      setIsUploading(false);
      // Reset file input
      if (event.target) {
        event.target.value = '';
      }
    }
  };

  const isFormValid = () => {
    return formData.title && formData.slug && formData.metaTitle && formData.metaDescription;
  };

  const handleKeyPress = (e, action) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      action();
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-900">Article Details</h2>
        <p className="text-gray-600 mt-2">Fill in the basic information for your article</p>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {/* Title */}
        <div className="space-y-2">
          <Label htmlFor="title" className="text-sm font-medium">
            Article Title *
          </Label>
          <Input
            id="title"
            value={formData.title}
            onChange={(e) => handleTitleChange(e.target.value)}
            placeholder="Enter article title"
            className="w-full"
          />
        </div>

        {/* Slug */}
        <div className="space-y-2">
          <Label htmlFor="slug" className="text-sm font-medium">
            URL Slug *
          </Label>
          <Input
            id="slug"
            value={formData.slug}
            onChange={(e) => handleInputChange('slug', e.target.value)}
            placeholder="article-url-slug"
            className="w-full"
          />
        </div>

        {/* Thumbnail Upload */}
        <div className="space-y-2">
          <Label className="text-sm font-medium">Thumbnail Image</Label>

          {/* Upload Button */}
          <div className="flex gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={handleImageSelect}
              disabled={isUploading}
              className="flex items-center gap-2"
            >
              {isUploading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Upload className="h-4 w-4" />
              )}
              {isUploading ? 'Uploading...' : 'Upload Image'}
            </Button>

            {/* Manual URL Input */}
            <div className="flex-1">
              <Input
                value={formData.thumbnail}
                onChange={(e) => handleInputChange('thumbnail', e.target.value)}
                placeholder="Or paste image URL"
                className="w-full"
                disabled={isUploading}
              />
            </div>
          </div>

          {/* Hidden file input */}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="hidden"
          />

          {/* Upload Error */}
          {uploadError && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-md">
              <p className="text-sm text-red-600">{uploadError}</p>
            </div>
          )}

          {/* Image Preview */}
          {formData.thumbnail && !isUploading && (
            <div className="mt-2">
              <div className="relative inline-block">
                <img
                  src={formData.thumbnail}
                  alt="Thumbnail preview"
                  className="w-32 h-20 object-cover rounded border"
                  onError={(e) => {
                    e.target.style.display = 'none';
                    setUploadError('Failed to load image preview');
                  }}
                  onLoad={() => setUploadError('')}
                />
                <Button
                  type="button"
                  variant="destructive"
                  size="sm"
                  className="absolute -top-2 -right-2 h-6 w-6 rounded-full p-0"
                  onClick={() => handleInputChange('thumbnail', '')}
                >
                  <X className="h-3 w-3" />
                </Button>
              </div>
            </div>
          )}

          {/* Upload Progress */}
          {isUploading && (
            <div className="mt-2">
              <div className="w-32 h-20 bg-gray-100 rounded border flex items-center justify-center">
                <div className="flex flex-col items-center gap-1">
                  <Loader2 className="h-4 w-4 animate-spin text-gray-500" />
                  <span className="text-xs text-gray-500">Uploading...</span>
                </div>
              </div>
            </div>
          )}

          {/* Upload info */}
          <p className="text-xs text-gray-500">
            Supported formats: JPEG, PNG, GIF, WebP. Max size: 10MB (will be compressed automatically)
          </p>
        </div>

        {/* Category */}
        <div className="space-y-2">
          <Label className="text-sm font-medium">Category</Label>
          <Select
            value={formData.category}
            onValueChange={(value) => handleInputChange('category', value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select a category" />
            </SelectTrigger>
            <SelectContent>
              {categories?.map((cat) => (
                <SelectItem key={cat._id} value={cat._id}>
                  {cat.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Tags */}
        <div className="space-y-2">
          <Label className="text-sm font-medium">Tags</Label>
          <div className="flex gap-2">
            <Input
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              placeholder="Add a tag"
              onKeyPress={(e) => handleKeyPress(e, handleAddTag)}
              className="flex-1"
            />
            <Button type="button" onClick={handleAddTag} variant="outline" size="sm">
              <Plus className="h-4 w-4" />
            </Button>
          </div>
          <div className="flex flex-wrap gap-2 mt-2">
            {formData.tags?.map((tag) => (
              <Badge key={tag} variant="secondary" className="flex items-center gap-1">
                {tag}
                <X
                  className="h-3 w-3 cursor-pointer hover:text-red-500"
                  onClick={() => handleRemoveTag(tag)}
                />
              </Badge>
            ))}
          </div>
        </div>

        {/* Meta Title */}
        <div className="space-y-2">
          <Label htmlFor="metaTitle" className="text-sm font-medium">
            Meta Title * <span className="text-xs text-gray-500">(SEO)</span>
          </Label>
          <Input
            id="metaTitle"
            value={formData.metaTitle}
            onChange={(e) => handleInputChange('metaTitle', e.target.value)}
            placeholder="SEO optimized title (60 characters max)"
            maxLength={60}
            className="w-full"
          />
          <p className={`text-xs ${formData.metaTitle?.length > 50 ? 'text-orange-500' : 'text-gray-500'}`}>
            {formData.metaTitle?.length || 0}/60 characters
          </p>
        </div>

        {/* Meta Description */}
        <div className="space-y-2">
          <Label htmlFor="metaDescription" className="text-sm font-medium">
            Meta Description * <span className="text-xs text-gray-500">(SEO)</span>
          </Label>
          <Textarea
            id="metaDescription"
            value={formData.metaDescription}
            onChange={(e) => handleInputChange('metaDescription', e.target.value)}
            placeholder="Brief description for search engines (160 characters max)"
            maxLength={160}
            className="w-full"
            rows={3}
          />
          <p className={`text-xs ${formData.metaDescription?.length > 140 ? 'text-orange-500' : 'text-gray-500'}`}>
            {formData.metaDescription?.length || 0}/160 characters
          </p>
        </div>

        {/* Keywords */}
        <div className="space-y-2">
          <Label className="text-sm font-medium">SEO Keywords</Label>
          <div className="flex gap-2">
            <Input
              value={keywordInput}
              onChange={(e) => setKeywordInput(e.target.value)}
              placeholder="Add a keyword"
              onKeyPress={(e) => handleKeyPress(e, handleAddKeyword)}
              className="flex-1"
            />
            <Button type="button" onClick={handleAddKeyword} variant="outline" size="sm">
              <Plus className="h-4 w-4" />
            </Button>
          </div>
          <div className="flex flex-wrap gap-2 mt-2">
            {formData.keywords?.map((keyword) => (
              <Badge key={keyword} variant="outline" className="flex items-center gap-1">
                {keyword}
                <X
                  className="h-3 w-3 cursor-pointer hover:text-red-500"
                  onClick={() => handleRemoveKeyword(keyword)}
                />
              </Badge>
            ))}
          </div>
        </div>

        {/* Status and Flags */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 rounded-lg">
          <div className="space-y-2">
            <Label className="text-sm font-medium">Status</Label>
            <Select
              value={formData.status}
              onValueChange={(value) => handleInputChange('status', value)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Draft">Draft</SelectItem>
                <SelectItem value="Published">Published</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center space-x-2">
            <Switch
              id="featured"
              checked={formData.isFeatured}
              onCheckedChange={(checked) => handleInputChange('isFeatured', checked)}
            />
            <Label htmlFor="featured" className="text-sm font-medium">Featured Article</Label>
          </div>

          <div className="flex items-center space-x-2">
            <Switch
              id="trending"
              checked={formData.isTrending}
              onCheckedChange={(checked) => handleInputChange('isTrending', checked)}
            />
            <Label htmlFor="trending" className="text-sm font-medium">Trending</Label>
          </div>
        </div>
      </div>

      <div className="flex justify-end pt-6 border-t">
        <Button
          onClick={onNext}
          disabled={!isFormValid() || isUploading}
          className="flex items-center gap-2 px-6"
        >
          Next: Content Editor
          <ArrowRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
});

ArticleForm.displayName = 'ArticleForm';

export default ArticleForm;