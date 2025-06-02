import React, { useEffect, useState } from 'react';
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

const Form = () => {
  const [formData, setFormData] = useState({
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
  });
  const [uploading, setUploading] = useState(false)

  // useEffect(() => {
  //   fetch("https://res.cloudinary.com/dqvkbnrlu/raw/upload/v1748850910/rakg6pw8ncrihhnnv46l.pdf")
  //     .then(response => {
  //       if (!response.ok) throw new Error("Network response was not ok");
  //       return response.blob();
  //     })
  //     .then(blob => {
  //       console.log("Fetched PDF Blob:", blob);
  //       // You can use URL.createObjectURL(blob) to view it in the browser
  //       const pdfUrl = URL.createObjectURL(blob);
  //       window.open(pdfUrl);
  //     })
  //     .catch(error => {
  //       console.error("Fetch error:", error);
  //     });

  // }, [])

  const [thumbnailPreview, setThumbnailPreview] = useState('');
  const [thumbnailFileName, setThumbnailFileName] = useState('');
  const [pdfFileName, setPdfFileName] = useState('');

  const contentTypes = [
    { value: 'Notes', label: 'Notes' },
    { value: 'TestSeries', label: 'Test Series' },
    { value: 'Material', label: 'Material' },
    { value: 'Books', label: 'Books' }
  ];

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleThumbnailFileChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith('image/')) {
      handleInputChange('thumbnailFile', file);
      setThumbnailFileName(file.name);

      const reader = new FileReader();
      reader.onload = (e) => {
        setThumbnailPreview(e.target.result);
      };
      reader.readAsDataURL(file);
    } else {
      alert('Please select a valid image file');
    }
  };

  const handlePdfFileChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type === 'application/pdf') {
      handleInputChange('pdfFile', file);
      setPdfFileName(file.name);
    } else {
      alert('Please select a valid PDF file');
    }
  };


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

  const handleSubmit = async () => {
    try {
      setUploading(true);

      const { thumbnailFile, pdfFile, title, description, type, author, price } = formData;

      // Basic validation
      if (!thumbnailFile || !pdfFile) {
        toast.error("Thumbnail and PDF file are required");
        setUploading(false);
        return;
      }

      if (!title || !description || !type || !author || price === "") {
        toast.error("All required fields must be filled");
        setUploading(false);
        return;
      }

      // Compress thumbnail before upload
      const compressedThumbnail = await compressImage(thumbnailFile);

      // Upload thumbnail & PDF to Cloudinary
      const [thumbnailData, pdfData] = await Promise.all([
        uploadToCloudinary(
          compressedThumbnail,
          import.meta.env.VITE_CLOUDINARY_URL,
          import.meta.env.VITE_AW_COURSES_UPLOAD_PRESET,
          "image"
        ),
        uploadToCloudinary(
          pdfFile,
          import.meta.env.VITE_CLOUDINARY_RAW_URL,
          import.meta.env.VITE_AW_BOOKPDF_UPLOAD_PRESET,
          "raw"
        )
      ]);

      // Prepare final payload
      const updatedFormData = {
        title,
        description,
        type,
        author,
        price,
        thumbnailUrl: thumbnailData.secure_url,
        downloadUrl: pdfData.secure_url,
        thumbnail_public_id: thumbnailData.public_id,
        pdf_public_id: pdfData.public_id,
        thumbnail_format: thumbnailData.format,
        pdf_format: pdfData.format,
        status: "Published",
        ...(formData.themes && { themes: formData.themes }) // optional themes
      };

      // Submit to backend
      const response = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/store/createProduct`,
        updatedFormData,
        { withCredentials: true }
      );

      if (response.status === 201 && response.data.success) {
        toast.success("Content created successfully");
        resetForm();
      } else {
        toast.error("Unexpected response from server");
      }
    } catch (error) {
      console.error("Upload Error:", error);
      toast.error(error.response?.data?.message || "Something went wrong");
    } finally {
      setUploading(false);
    }
  };


  const resetForm = () => {
    setFormData({
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
    });
    setThumbnailPreview('');
    setThumbnailFileName('');
    setPdfFileName('');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/20 p-4">
      <div className="max-w-6xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-center justify-center">
              <FileText className="h-6 w-6" />
              Create Content
            </CardTitle>
          </CardHeader>
          <CardContent>
            {/* First Row - Title, Author Name and Type */}
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
                    {contentTypes.map((type) => (
                      <SelectItem key={type.value} value={type.value}>
                        {type.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Second Row - Description and Price */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
              <div className="lg:col-span-2 space-y-2">
                <Label htmlFor="description" className="flex items-center gap-2">
                  <AlignLeft className="h-4 w-4" />
                  Description
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

            {/* Third Row - File Uploads */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
              {/* Thumbnail Upload */}
              <div className="space-y-2">
                <Label className="flex items-center gap-2">
                  <Image className="h-4 w-4" />
                  Thumbnail Image
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
                            onClick={() => document.getElementById('thumbnail-upload').click()}
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
                          onClick={() => document.getElementById('thumbnail-upload').click()}
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
                  PDF File *
                </Label>
                <div className="border-2 border-dashed border-border rounded-lg p-4 hover:border-primary/50 transition-colors">
                  <div className="text-center">
                    <Upload className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
                    <div className="space-y-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => document.getElementById('pdf-upload').click()}
                      >
                        Choose PDF File
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
                    <span>Creating</span>
                  </div>
                ) : (
                  <span className="text-base">Create Content</span>
                )}
              </Button>
              <Button
                variant="outline"
                onClick={resetForm}
                className="flex-1 p-3"
                size="lg"
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