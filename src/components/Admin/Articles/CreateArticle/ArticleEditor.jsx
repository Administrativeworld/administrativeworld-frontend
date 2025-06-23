import React, { useRef, useEffect, useCallback, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Bold,
  Italic,
  Underline,
  List,
  ListOrdered,
  Quote,
  Link,
  Image as ImageIcon,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Code,
  Undo,
  Redo,
  Save,
  ArrowLeft,
  Type,
  Palette,
  Paintbrush,
  Highlighter,
  ChevronDown
} from 'lucide-react';
import {
  updateFormData,
  saveArticle,
  setLoading,
  selectFormData,
  selectIsLoading
} from '@/redux/api/createArticleSlice';

// Quill.js imports
import Quill from 'quill';
import 'quill/dist/quill.snow.css';

// Cloudinary and image compression
import imageCompression from 'browser-image-compression';
import toast from 'react-hot-toast';

// Cloudinary configuration
const CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
const UPLOAD_PRESET = import.meta.env.VITE_AW_ARTICLE_UPLOAD_PRESET;

// Custom image format to store public ID
const BlockEmbed = Quill.import('blots/block/embed');

class CustomImage extends BlockEmbed {
  static create(value) {
    const node = super.create();
    node.setAttribute('src', value.url);
    node.setAttribute('alt', value.alt || '');
    node.setAttribute('data-public-id', value.publicId || '');
    node.setAttribute('class', 'embedded-image');
    return node;
  }

  static value(node) {
    return {
      url: node.getAttribute('src'),
      alt: node.getAttribute('alt'),
      publicId: node.getAttribute('data-public-id')
    };
  }
}

CustomImage.blotName = 'custom-image';
CustomImage.tagName = 'img';
Quill.register('formats/custom-image', CustomImage);

const ArticleEditor = React.memo(({ onPrevious, onSave }) => {
  const dispatch = useDispatch();
  const formData = useSelector(selectFormData);
  const isLoading = useSelector(selectIsLoading);
  const editorRef = useRef(null);
  const quillRef = useRef(null);
  const fileInputRef = useRef(null);
  const [isEditorReady, setIsEditorReady] = useState(false);
  const [wordCount, setWordCount] = useState(0);
  const [characterCount, setCharacterCount] = useState(0);
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [showBgColorPicker, setShowBgColorPicker] = useState(false);
  const [currentTextColor, setCurrentTextColor] = useState('#000000');
  const [currentBgColor, setCurrentBgColor] = useState('#ffffff');
  const [isImageUploading, setIsImageUploading] = useState(false);
  const [activeFormats, setActiveFormats] = useState({});
  const [hasContentChanged, setHasContentChanged] = useState(false);

  // Predefined color palette
  const colorPalette = [
    '#000000', '#ffffff', '#ff0000', '#00ff00', '#0000ff', '#ffff00', '#ff00ff', '#00ffff',
    '#800000', '#008000', '#000080', '#808000', '#800080', '#008080', '#c0c0c0', '#808080',
    '#9999ff', '#993366', '#ffffcc', '#ccffff', '#660066', '#ff8080', '#0066cc', '#ccccff',
    '#000080', '#ff00ff', '#ffff00', '#00ffff', '#800080', '#800000', '#008080', '#0000ff'
  ];

  // Track active formats at cursor position
  const updateActiveFormats = useCallback(() => {
    if (!quillRef.current) return;

    const selection = quillRef.current.getSelection();
    if (selection) {
      const formats = quillRef.current.getFormat(selection.index, selection.length);
      setActiveFormats(formats);

      // Update current colors
      if (formats.color) setCurrentTextColor(formats.color);
      if (formats.background) setCurrentBgColor(formats.background);
    }
  }, []);

  // Initialize Quill editor
  useEffect(() => {
    if (editorRef.current && !quillRef.current) {
      // Custom toolbar configuration
      const toolbarOptions = [
        [{ 'header': [1, 2, 3, false] }],
        ['bold', 'italic', 'underline'],
        [{ 'list': 'ordered' }, { 'list': 'bullet' }],
        [{ 'align': [] }],
        ['blockquote', 'code-block'],
        ['link', 'image'],
        ['clean']
      ];

      quillRef.current = new Quill(editorRef.current, {
        theme: 'snow',
        modules: {
          toolbar: {
            container: toolbarOptions,
            handlers: {
              'link': handleLinkInsert
            }
          },
          history: {
            delay: 1000,
            maxStack: 100,
            userOnly: false
          }
        },
        formats: [
          'header', 'bold', 'italic', 'underline',
          'list', 'bullet', 'align', 'blockquote',
          'code-block', 'link', 'custom-image', 'color', 'background'
        ],
        placeholder: 'Start writing your article content here...'
      });

      // Set initial content
      if (formData.content) {
        quillRef.current.root.innerHTML = formData.content;
      }

      // Listen for text changes
      quillRef.current.on('text-change', () => {
        handleEditorChange();
        updateActiveFormats();
      });

      // Listen for selection changes
      quillRef.current.on('selection-change', updateActiveFormats);

      setIsEditorReady(true);
      updateCounts();

      // Hide the default Quill toolbar since we're using custom buttons
      const quillToolbar = editorRef.current.previousSibling;
      if (quillToolbar && quillToolbar.classList.contains('ql-toolbar')) {
        quillToolbar.style.display = 'none';
      }
    }

    return () => {
      if (quillRef.current) {
        quillRef.current.off('text-change', handleEditorChange);
        quillRef.current.off('selection-change', updateActiveFormats);
      }
    };
  }, []);

  // Update content when formData changes
  useEffect(() => {
    if (quillRef.current && formData.content !== quillRef.current.root.innerHTML) {
      const currentSelection = quillRef.current.getSelection();
      quillRef.current.root.innerHTML = formData.content || '';
      if (currentSelection) {
        quillRef.current.setSelection(currentSelection);
      }
      updateCounts();
    }
  }, [formData.content]);

  const updateCounts = useCallback(() => {
    if (quillRef.current) {
      const text = quillRef.current.getText();
      const words = text.trim().split(/\s+/).filter(word => word.length > 0);

      // Only update counts if content has actually changed
      if (text.length > 0 || hasContentChanged) {
        setWordCount(words.length);
        setCharacterCount(text.length);
      }
    }
  }, [hasContentChanged]);

  const handleEditorChange = useCallback(() => {
    if (quillRef.current) {
      const content = quillRef.current.root.innerHTML;

      // Only update if content has meaningful changes
      if (content !== formData.content) {
        setHasContentChanged(true);
        dispatch(updateFormData({ content }));
        updateCounts();
      }
    }
  }, [dispatch, updateCounts, formData.content]);

  // Quill command wrapper
  const execQuillCommand = useCallback((format, value = true) => {
    if (quillRef.current) {
      const selection = quillRef.current.getSelection();
      if (!selection) {
        quillRef.current.focus();
        return;
      }

      quillRef.current.format(format, value);
      updateActiveFormats();
    }
  }, [updateActiveFormats]);

  const insertHeading = useCallback((level) => {
    execQuillCommand('header', level);
  }, [execQuillCommand]);

  const handleLinkInsert = useCallback(() => {
    if (quillRef.current) {
      const selection = quillRef.current.getSelection();
      if (!selection) return;

      const selectedText = quillRef.current.getText(selection.index, selection.length);
      const url = prompt('Enter URL:', 'https://');

      if (url && url !== 'https://') {
        if (selectedText.trim()) {
          quillRef.current.format('link', url);
        } else {
          const linkText = prompt('Enter link text:', 'Link');
          if (linkText) {
            quillRef.current.insertText(selection.index, linkText);
            quillRef.current.setSelection(selection.index, linkText.length);
            quillRef.current.format('link', url);
          }
        }
        handleEditorChange();
        updateActiveFormats();
      }
    }
  }, [handleEditorChange, updateActiveFormats]);

  const handleImageUpload = useCallback(async (file) => {
    if (!quillRef.current) return;

    setIsImageUploading(true);
    try {
      // Compress image
      const options = {
        maxSizeMB: 1,
        maxWidthOrHeight: 1920,
        useWebWorker: true
      };

      const compressedFile = await imageCompression(file, options);

      // Prepare form data for Cloudinary
      const formData = new FormData();
      formData.append('file', compressedFile);
      formData.append('upload_preset', UPLOAD_PRESET);

      // Upload to Cloudinary
      const response = await fetch(
        `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
        {
          method: 'POST',
          body: formData
        }
      );

      const data = await response.json();

      if (!response.ok) throw new Error(data.error?.message || 'Image upload failed');

      // Get current selection
      const selection = quillRef.current.getSelection();
      const index = selection ? selection.index : quillRef.current.getLength();

      // Insert image with Cloudinary data
      quillRef.current.insertEmbed(index, 'custom-image', {
        url: data.secure_url,
        publicId: data.public_id,
        alt: file.name
      });

      // Move cursor after image
      quillRef.current.setSelection(index + 1);
      handleEditorChange();
      updateActiveFormats();
    } catch (error) {
      console.error('Image upload error:', error);
      toast.error(`Failed to upload image: ${error.message}`);
    } finally {
      setIsImageUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  }, [handleEditorChange, updateActiveFormats]);

  const triggerImageUpload = useCallback(() => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  }, []);

  const handleFileChange = useCallback((e) => {
    const file = e.target.files?.[0];
    if (file && file.type.startsWith('image/')) {
      handleImageUpload(file);
    }
  }, [handleImageUpload]);

  const insertDivider = useCallback(() => {
    if (quillRef.current) {
      const selection = quillRef.current.getSelection();
      const index = selection ? selection.index : quillRef.current.getLength();

      // Insert a horizontal rule
      quillRef.current.insertText(index, '\n', 'user');
      quillRef.current.insertText(index + 1, '---', 'user');
      quillRef.current.insertText(index + 4, '\n', 'user');
      quillRef.current.setSelection(index + 5);
      handleEditorChange();
      updateActiveFormats();
    }
  }, [handleEditorChange, updateActiveFormats]);

  const applyTextColor = useCallback((color) => {
    execQuillCommand('color', color);
    setShowColorPicker(false);
  }, [execQuillCommand]);

  const applyBackgroundColor = useCallback((color) => {
    execQuillCommand('background', color);
    setShowBgColorPicker(false);
  }, [execQuillCommand]);

  const insertCodeBlock = useCallback(() => {
    execQuillCommand('code-block', true);
  }, [execQuillCommand]);

  const removeTextColor = useCallback(() => {
    execQuillCommand('color', false);
    setCurrentTextColor('#000000');
    setShowColorPicker(false);
  }, [execQuillCommand]);

  const removeBackgroundColor = useCallback(() => {
    execQuillCommand('background', false);
    setCurrentBgColor('#ffffff');
    setShowBgColorPicker(false);
  }, [execQuillCommand]);

  const insertLink = useCallback(() => {
    handleLinkInsert();
  }, [handleLinkInsert]);

  // Color picker component
  const ColorPicker = ({ colors, onColorSelect, onRemoveColor, isVisible, onClose, title }) => {
    if (!isVisible) return null;

    return (
      <div className="absolute top-full left-0 mt-1 border border-gray-200 rounded-lg shadow-lg p-3 z-50 min-w-[200px]">
        <div className="text-xs font-medium text-gray-700 mb-2">{title}</div>
        <div className="grid grid-cols-8 gap-1 mb-2">
          {colors.map((color, index) => (
            <button
              key={index}
              className="w-6 h-6 rounded border border-gray-300 hover:scale-110 transition-transform"
              style={{ backgroundColor: color }}
              onClick={() => onColorSelect(color)}
              title={color}
            />
          ))}
        </div>
        <div className="flex gap-2 pt-2 border-t">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={onRemoveColor}
            className="text-xs px-2 py-1 h-6"
          >
            Remove
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="text-xs px-2 py-1 h-6"
          >
            Close
          </Button>
        </div>
      </div>
    );
  };

  const formatText = useCallback((format) => {
    if (!quillRef.current) return;

    switch (format) {
      case 'bold':
        execQuillCommand('bold');
        break;
      case 'italic':
        execQuillCommand('italic');
        break;
      case 'underline':
        execQuillCommand('underline');
        break;
      case 'insertUnorderedList':
        execQuillCommand('list', 'bullet');
        break;
      case 'insertOrderedList':
        execQuillCommand('list', 'ordered');
        break;
      case 'justifyLeft':
        execQuillCommand('align', '');
        break;
      case 'justifyCenter':
        execQuillCommand('align', 'center');
        break;
      case 'justifyRight':
        execQuillCommand('align', 'right');
        break;
      case 'blockquote':
        execQuillCommand('blockquote', true);
        break;
      case 'undo':
        quillRef.current.history.undo();
        handleEditorChange();
        updateActiveFormats();
        break;
      case 'redo':
        quillRef.current.history.redo();
        handleEditorChange();
        updateActiveFormats();
        break;
      default:
        execQuillCommand(format);
    }
  }, [execQuillCommand, handleEditorChange, updateActiveFormats]);

  const handleSave = useCallback(async () => {
    if (!formData.content || !formData.content.trim()) {
      toast.error('Please add some content to your article before saving.');
      return;
    }

    dispatch(setLoading(true));

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));

      dispatch(saveArticle());

      if (onSave) {
        onSave();
      }

    } catch (error) {
      console.error('Error saving article:', error);
      alert('Error saving article. Please try again.');
    } finally {
      dispatch(setLoading(false));
    }
  }, [dispatch, formData.content, onSave]);

  // Helper function to determine if format is active
  const isFormatActive = (format, value = true) => {
    if (!activeFormats) return false;

    if (format === 'align') {
      return activeFormats[format] === value;
    }

    if (format === 'header') {
      return activeFormats[format] === value;
    }

    return activeFormats[format] === value;
  };

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-900">Content Editor</h2>
        <p className="text-gray-600 mt-2">Create your article content with our rich text editor</p>
      </div>

      {/* Editor Stats */}
      <div className="flex justify-between items-center text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">
        <div className="flex gap-6">
          <span>Words: <strong>{wordCount}</strong></span>
          <span>Characters: <strong>{characterCount}</strong></span>
        </div>
        <div className="flex gap-2">
          <span className={`px-2 py-1 rounded ${wordCount < 300 ? 'bg-red-100 text-red-700' : wordCount < 1000 ? 'bg-yellow-100 text-yellow-700' : 'bg-green-100 text-green-700'}`}>
            {wordCount < 300 ? 'Too Short' : wordCount < 1000 ? 'Good Length' : 'Great Length'}
          </span>
        </div>
      </div>

      {/* Editor Toolbar */}
      <div className="border border-gray-200 rounded-lg bg-white shadow-sm">
        <div className="p-3 border-b border-gray-200">
          <div className="flex flex-wrap gap-1">
            {/* Text Formatting */}
            <div className="flex border-r border-gray-200 pr-2 mr-2">
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => formatText('bold')}
                className={`p-2 hover:bg-gray-100 ${isFormatActive('bold') ? 'bg-gray-200' : ''}`}
                title="Bold"
              >
                <Bold className="h-4 w-4" />
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => formatText('italic')}
                className={`p-2 hover:bg-gray-100 ${isFormatActive('italic') ? 'bg-gray-200' : ''}`}
                title="Italic"
              >
                <Italic className="h-4 w-4" />
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => formatText('underline')}
                className={`p-2 hover:bg-gray-100 ${isFormatActive('underline') ? 'bg-gray-200' : ''}`}
                title="Underline"
              >
                <Underline className="h-4 w-4" />
              </Button>
            </div>

            {/* Headings */}
            <div className="flex border-r border-gray-200 pr-2 mr-2">
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => insertHeading(1)}
                className={`p-2 text-xs font-bold hover:bg-gray-100 ${isFormatActive('header', 1) ? 'bg-gray-200' : ''}`}
                title="Heading 1"
              >
                H1
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => insertHeading(2)}
                className={`p-2 text-xs font-bold hover:bg-gray-100 ${isFormatActive('header', 2) ? 'bg-gray-200' : ''}`}
                title="Heading 2"
              >
                H2
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => insertHeading(3)}
                className={`p-2 text-xs font-bold hover:bg-gray-100 ${isFormatActive('header', 3) ? 'bg-gray-200' : ''}`}
                title="Heading 3"
              >
                H3
              </Button>
            </div>

            {/* Lists */}
            <div className="flex border-r border-gray-200 pr-2 mr-2">
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => formatText('insertUnorderedList')}
                className={`p-2 hover:bg-gray-100 ${isFormatActive('list', 'bullet') ? 'bg-gray-200' : ''}`}
                title="Bullet List"
              >
                <List className="h-4 w-4" />
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => formatText('insertOrderedList')}
                className={`p-2 hover:bg-gray-100 ${isFormatActive('list', 'ordered') ? 'bg-gray-200' : ''}`}
                title="Numbered List"
              >
                <ListOrdered className="h-4 w-4" />
              </Button>
            </div>

            {/* Alignment */}
            <div className="flex border-r border-gray-200 pr-2 mr-2">
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => formatText('justifyLeft')}
                className={`p-2 hover:bg-gray-100 ${!activeFormats.align ? 'bg-gray-200' : ''}`}
                title="Align Left"
              >
                <AlignLeft className="h-4 w-4" />
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => formatText('justifyCenter')}
                className={`p-2 hover:bg-gray-100 ${isFormatActive('align', 'center') ? 'bg-gray-200' : ''}`}
                title="Align Center"
              >
                <AlignCenter className="h-4 w-4" />
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => formatText('justifyRight')}
                className={`p-2 hover:bg-gray-100 ${isFormatActive('align', 'right') ? 'bg-gray-200' : ''}`}
                title="Align Right"
              >
                <AlignRight className="h-4 w-4" />
              </Button>
            </div>

            {/* Special Elements */}
            <div className="flex border-r border-gray-200 pr-2 mr-2">
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => formatText('blockquote')}
                className={`p-2 hover:bg-gray-100 ${isFormatActive('blockquote') ? 'bg-gray-200' : ''}`}
                title="Quote"
              >
                <Quote className="h-4 w-4" />
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={insertCodeBlock}
                className={`p-2 hover:bg-gray-100 ${isFormatActive('code-block') ? 'bg-gray-200' : ''}`}
                title="Code Block"
              >
                <Code className="h-4 w-4" />
              </Button>
            </div>

            {/* Colors */}
            <div className="flex border-r border-gray-200 pr-2 mr-2">
              <div className="relative">
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setShowColorPicker(!showColorPicker);
                    setShowBgColorPicker(false);
                  }}
                  className={`p-2 hover:bg-gray-100 relative ${isFormatActive('color') ? 'bg-gray-200' : ''}`}
                  title="Text Color"
                >
                  <Palette className="h-4 w-4" />
                  <div
                    className="absolute bottom-0 right-0 w-2 h-2 rounded-full border border-white"
                    style={{ backgroundColor: currentTextColor }}
                  />
                </Button>
                <ColorPicker
                  colors={colorPalette}
                  onColorSelect={applyTextColor}
                  onRemoveColor={removeTextColor}
                  isVisible={showColorPicker}
                  onClose={() => setShowColorPicker(false)}
                  title="Text Color"
                />
              </div>
              <div className="relative">
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setShowBgColorPicker(!showBgColorPicker);
                    setShowColorPicker(false);
                  }}
                  className={`p-2 hover:bg-gray-100 relative ${isFormatActive('background') ? 'bg-gray-200' : ''}`}
                  title="Background Color"
                >
                  <Highlighter className="h-4 w-4" />
                  <div
                    className="absolute bottom-0 right-0 w-2 h-2 rounded-full border border-white"
                    style={{ backgroundColor: currentBgColor }}
                  />
                </Button>
                <ColorPicker
                  colors={colorPalette}
                  onColorSelect={applyBackgroundColor}
                  onRemoveColor={removeBackgroundColor}
                  isVisible={showBgColorPicker}
                  onClose={() => setShowBgColorPicker(false)}
                  title="Background Color"
                />
              </div>
            </div>

            {/* Insert */}
            <div className="flex border-r border-gray-200 pr-2 mr-2">
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={insertLink}
                className={`p-2 hover:bg-gray-100 ${isFormatActive('link') ? 'bg-gray-200' : ''}`}
                title="Insert Link"
              >
                <Link className="h-4 w-4" />
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={triggerImageUpload}
                className="p-2 hover:bg-gray-100 relative"
                title="Insert Image"
                disabled={isImageUploading}
              >
                {isImageUploading ? (
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-800"></div>
                ) : (
                  <ImageIcon className="h-4 w-4" />
                )}
              </Button>
            </div>

            {/* Undo/Redo */}
            <div className="flex">
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => formatText('undo')}
                className="p-2 hover:bg-gray-100"
                title="Undo"
              >
                <Undo className="h-4 w-4" />
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => formatText('redo')}
                className="p-2 hover:bg-gray-100"
                title="Redo"
              >
                <Redo className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Quill Editor Container */}
        <div className="min-h-[500px] max-h-[600px] overflow-y-auto">
          <div
            ref={editorRef}
            className="min-h-[500px] prose prose-lg max-w-none"
            style={{
              lineHeight: '1.7',
              fontSize: '16px'
            }}
          />
        </div>

        {/* Quick Insert Bar */}
        <div className="p-3 border-t border-gray-200 bg-gray-50">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <span>Quick Insert:</span>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={insertDivider}
              className="text-xs px-2 py-1 h-6"
            >
              Divider
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => insertHeading(2)}
              className="text-xs px-2 py-1 h-6"
            >
              Heading
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => formatText('blockquote')}
              className="text-xs px-2 py-1 h-6"
            >
              Quote
            </Button>
            <div className="flex items-center gap-1 ml-4">
              <span className="text-xs">Colors:</span>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => applyTextColor('#ff0000')}
                className="text-xs px-2 py-1 h-6"
                style={{ color: '#ff0000' }}
              >
                Red
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => applyTextColor('#0000ff')}
                className="text-xs px-2 py-1 h-6"
                style={{ color: '#0000ff' }}
              >
                Blue
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => applyBackgroundColor('#ffff00')}
                className="text-xs px-2 py-1 h-6"
                style={{ backgroundColor: '#ffff00' }}
              >
                Highlight
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Hidden file input for image upload */}
      <input
        type="file"
        ref={fileInputRef}
        className="hidden"
        accept="image/*"
        onChange={handleFileChange}
      />

      {/* Actions */}
      <div className="flex justify-between items-center pt-6 border-t">
        <Button
          onClick={onPrevious}
          variant="outline"
          className="flex items-center gap-2"
          disabled={isLoading}
        >
          <ArrowLeft className="h-4 w-4" />
          Previous: Article Details
        </Button>

        <div className="flex gap-3">
          <Button
            onClick={() => {
              dispatch(updateFormData({ status: 'Draft' }));
              handleSave();
            }}
            variant="outline"
            disabled={isLoading}
            className="flex items-center gap-2"
          >
            Save as Draft
          </Button>

          <Button
            onClick={() => {
              dispatch(updateFormData({ status: 'Published' }));
              handleSave();
            }}
            disabled={isLoading}
            className="flex items-center gap-2 px-6"
          >
            {isLoading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                Publishing...
              </>
            ) : (
              <>
                <Save className="h-4 w-4" />
                Publish Article
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Custom Quill Styles */}
      <style jsx>{`
        .ql-editor {
          font-size: 16px;
          line-height: 1.7;
          padding: 24px;
          min-height: 500px;
        }
        
        .ql-editor.ql-blank::before {
          color: #9ca3af;
          font-style: normal;
        }
        
        .ql-editor h1 {
          font-size: 2rem;
          font-weight: bold;
          margin: 1rem 0;
        }
        
        .ql-editor h2 {
          font-size: 1.5rem;
          font-weight: bold;
          margin: 1rem 0;
        }
        
        .ql-editor h3 {
          font-size: 1.25rem;
          font-weight: bold;
          margin: 1rem 0;
        }
        
        .ql-editor blockquote {
          border-left: 4px solid #e5e7eb;
          padding-left: 1rem;
          margin: 1rem 0;
          color: #6b7280;
          font-style: italic;
        }
        
        .ql-editor .embedded-image {
          max-width: 100%;
          height: auto;
          margin: 1rem 0;
          border-radius: 0.5rem;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
        }
        
        .ql-editor a {
          color: #2563eb;
          text-decoration: underline;
        }
        
        .ql-editor a:hover {
          color: #1e40af;
        }
        
        .ql-editor pre {
          background: #f3f4f6;
          padding: 1rem;
          border-radius: 0.5rem;
          margin: 1rem 0;
          overflow-x: auto;
        }
        
        .ql-editor ul, .ql-editor ol {
          margin: 1rem 0;
          padding-left: 1.5rem;
        }

        /* Color and background color support */
        .ql-editor [style*="color:"] {
          /* Text colors are handled by inline styles */
        }
        
        .ql-editor [style*="background-color:"] {
          padding: 2px 4px;
          border-radius: 2px;
        }

        /* Color picker overlay */
        .color-picker-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          z-index: 40;
        }
      `}</style>
    </div>
  );
});

ArticleEditor.displayName = 'ArticleEditor';

export default ArticleEditor;