import React, { useState, useRef, useEffect, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
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
import {
  Bold,
  Italic,
  Underline,
  List,
  ListOrdered,
  Quote,
  Link,
  Image,
  Type,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Code,
  Undo,
  Redo,
  Save,
  ArrowRight,
  ArrowLeft,
  X,
  Plus
} from 'lucide-react';

// CreateArticleSlice actions (you'll need to create this slice)
const createArticleSlice = {
  updateFormData: (data) => ({ type: 'createArticle/updateFormData', payload: data }),
  setStep: (step) => ({ type: 'createArticle/setStep', payload: step }),
  addTag: (tag) => ({ type: 'createArticle/addTag', payload: tag }),
  removeTag: (tag) => ({ type: 'createArticle/removeTag', payload: tag }),
  addKeyword: (keyword) => ({ type: 'createArticle/addKeyword', payload: keyword }),
  removeKeyword: (keyword) => ({ type: 'createArticle/removeKeyword', payload: keyword }),
  resetForm: () => ({ type: 'createArticle/resetForm' })
};

// Demo Redux store (replace with your actual slice)
const useCreateArticleStore = () => {
  const [state, setState] = useState({
    step: 0,
    formData: {
      title: '',
      slug: '',
      content: '',
      thumbnail: '',
      category: '',
      tags: [],
      metaTitle: '',
      metaDescription: '',
      keywords: [],
      isFeatured: false,
      isTrending: false,
      status: 'Draft'
    }
  });

  const dispatch = useCallback((action) => {
    switch (action.type) {
      case 'createArticle/updateFormData':
        setState(prev => ({
          ...prev,
          formData: { ...prev.formData, ...action.payload }
        }));
        break;
      case 'createArticle/setStep':
        setState(prev => ({ ...prev, step: action.payload }));
        break;
      case 'createArticle/addTag':
        setState(prev => ({
          ...prev,
          formData: {
            ...prev.formData,
            tags: [...prev.formData.tags, action.payload]
          }
        }));
        break;
      case 'createArticle/removeTag':
        setState(prev => ({
          ...prev,
          formData: {
            ...prev.formData,
            tags: prev.formData.tags.filter(tag => tag !== action.payload)
          }
        }));
        break;
      case 'createArticle/addKeyword':
        setState(prev => ({
          ...prev,
          formData: {
            ...prev.formData,
            keywords: [...prev.formData.keywords, action.payload]
          }
        }));
        break;
      case 'createArticle/removeKeyword':
        setState(prev => ({
          ...prev,
          formData: {
            ...prev.formData,
            keywords: prev.formData.keywords.filter(keyword => keyword !== action.payload)
          }
        }));
        break;
      case 'createArticle/resetForm':
        setState(prev => ({
          ...prev,
          formData: {
            title: '',
            slug: '',
            content: '',
            thumbnail: '',
            category: '',
            tags: [],
            metaTitle: '',
            metaDescription: '',
            keywords: [],
            isFeatured: false,
            isTrending: false,
            status: 'Draft'
          }
        }));
        break;
    }
  }, []);

  return { state, dispatch };
};

// Article Form Component (Step 1)
const ArticleForm = React.memo(({ formData, dispatch, onNext }) => {
  const [tagInput, setTagInput] = useState('');
  const [keywordInput, setKeywordInput] = useState('');

  const generateSlug = useCallback((title) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();
  }, []);

  const handleTitleChange = useCallback((title) => {
    dispatch(createArticleSlice.updateFormData({
      title,
      slug: generateSlug(title)
    }));
  }, [dispatch, generateSlug]);

  const handleInputChange = useCallback((field, value) => {
    dispatch(createArticleSlice.updateFormData({ [field]: value }));
  }, [dispatch]);

  const addTag = useCallback(() => {
    if (tagInput.trim() && !formData.tags.includes(tagInput.trim())) {
      dispatch(createArticleSlice.addTag(tagInput.trim()));
      setTagInput('');
    }
  }, [tagInput, formData.tags, dispatch]);

  const removeTag = useCallback((tagToRemove) => {
    dispatch(createArticleSlice.removeTag(tagToRemove));
  }, [dispatch]);

  const addKeyword = useCallback(() => {
    if (keywordInput.trim() && !formData.keywords.includes(keywordInput.trim())) {
      dispatch(createArticleSlice.addKeyword(keywordInput.trim()));
      setKeywordInput('');
    }
  }, [keywordInput, formData.keywords, dispatch]);

  const removeKeyword = useCallback((keywordToRemove) => {
    dispatch(createArticleSlice.removeKeyword(keywordToRemove));
  }, [dispatch]);

  const isFormValid = () => {
    return formData.title && formData.slug && formData.metaTitle && formData.metaDescription;
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

        {/* Thumbnail URL */}
        <div className="space-y-2">
          <Label htmlFor="thumbnail" className="text-sm font-medium">
            Thumbnail URL
          </Label>
          <Input
            id="thumbnail"
            value={formData.thumbnail}
            onChange={(e) => handleInputChange('thumbnail', e.target.value)}
            placeholder="https://example.com/image.jpg"
            className="w-full"
          />
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
              <SelectItem value="technology">Technology</SelectItem>
              <SelectItem value="programming">Programming</SelectItem>
              <SelectItem value="web-development">Web Development</SelectItem>
              <SelectItem value="design">Design</SelectItem>
              <SelectItem value="business">Business</SelectItem>
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
              onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
              className="flex-1"
            />
            <Button type="button" onClick={addTag} variant="outline" size="sm">
              <Plus className="h-4 w-4" />
            </Button>
          </div>
          <div className="flex flex-wrap gap-2 mt-2">
            {formData.tags.map((tag) => (
              <Badge key={tag} variant="secondary" className="flex items-center gap-1">
                {tag}
                <X
                  className="h-3 w-3 cursor-pointer"
                  onClick={() => removeTag(tag)}
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
          <p className="text-xs text-gray-500">{formData.metaTitle.length}/60 characters</p>
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
          <p className="text-xs text-gray-500">{formData.metaDescription.length}/160 characters</p>
        </div>

        {/* Keywords */}
        <div className="space-y-2">
          <Label className="text-sm font-medium">SEO Keywords</Label>
          <div className="flex gap-2">
            <Input
              value={keywordInput}
              onChange={(e) => setKeywordInput(e.target.value)}
              placeholder="Add a keyword"
              onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addKeyword())}
              className="flex-1"
            />
            <Button type="button" onClick={addKeyword} variant="outline" size="sm">
              <Plus className="h-4 w-4" />
            </Button>
          </div>
          <div className="flex flex-wrap gap-2 mt-2">
            {formData.keywords.map((keyword) => (
              <Badge key={keyword} variant="outline" className="flex items-center gap-1">
                {keyword}
                <X
                  className="h-3 w-3 cursor-pointer"
                  onClick={() => removeKeyword(keyword)}
                />
              </Badge>
            ))}
          </div>
        </div>

        {/* Status and Flags */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
                <SelectItem value="Archived">Archived</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center space-x-2">
            <Switch
              id="featured"
              checked={formData.isFeatured}
              onCheckedChange={(checked) => handleInputChange('isFeatured', checked)}
            />
            <Label htmlFor="featured" className="text-sm font-medium">Featured</Label>
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

      <div className="flex justify-end pt-6">
        <Button
          onClick={onNext}
          disabled={!isFormValid()}
          className="flex items-center gap-2"
        >
          Next: Content Editor
          <ArrowRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
});

// Rich Text Editor Component (Step 2)
const ArticleEditor = React.memo(({ formData, dispatch, onPrevious, onSave }) => {
  const editorRef = useRef(null);
  const [isEditorReady, setIsEditorReady] = useState(false);

  useEffect(() => {
    if (editorRef.current) {
      editorRef.current.innerHTML = formData.content || '';
      setIsEditorReady(true);
    }
  }, []);

  const execCommand = useCallback((command, value = null) => {
    document.execCommand(command, false, value);
    editorRef.current?.focus();
  }, []);

  const handleEditorChange = useCallback(() => {
    if (editorRef.current) {
      dispatch(createArticleSlice.updateFormData({ content: editorRef.current.innerHTML }));
    }
  }, [dispatch]);

  const insertHeading = useCallback((level) => {
    const selection = window.getSelection();
    if (selection.rangeCount > 0) {
      const range = selection.getRangeAt(0);
      const heading = document.createElement(`h${level}`);
      heading.textContent = selection.toString() || `Heading ${level}`;
      range.deleteContents();
      range.insertNode(heading);
      selection.removeAllRanges();
      handleEditorChange();
    }
  }, [handleEditorChange]);

  const insertLink = useCallback(() => {
    const url = prompt('Enter URL:');
    if (url) {
      execCommand('createLink', url);
      handleEditorChange();
    }
  }, [execCommand, handleEditorChange]);

  const insertImage = useCallback(() => {
    const url = prompt('Enter image URL:');
    if (url) {
      execCommand('insertImage', url);
      handleEditorChange();
    }
  }, [execCommand, handleEditorChange]);

  const handleSave = () => {
    console.log('Article Data:', formData);
    onSave();
  };

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-900">Content Editor</h2>
        <p className="text-gray-600 mt-2">Create your article content with our rich text editor</p>
      </div>

      {/* Editor Toolbar */}
      <div className="border border-gray-200 rounded-lg bg-gray-50 p-3">
        <div className="flex flex-wrap gap-2">
          {/* Text Formatting */}
          <div className="flex border-r border-gray-300 pr-2 mr-2">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => execCommand('bold')}
              className="p-2"
            >
              <Bold className="h-4 w-4" />
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => execCommand('italic')}
              className="p-2"
            >
              <Italic className="h-4 w-4" />
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => execCommand('underline')}
              className="p-2"
            >
              <Underline className="h-4 w-4" />
            </Button>
          </div>

          {/* Headings */}
          <div className="flex border-r border-gray-300 pr-2 mr-2">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => insertHeading(1)}
              className="p-2 text-xs"
            >
              H1
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => insertHeading(2)}
              className="p-2 text-xs"
            >
              H2
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => insertHeading(3)}
              className="p-2 text-xs"
            >
              H3
            </Button>
          </div>

          {/* Lists */}
          <div className="flex border-r border-gray-300 pr-2 mr-2">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => execCommand('insertUnorderedList')}
              className="p-2"
            >
              <List className="h-4 w-4" />
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => execCommand('insertOrderedList')}
              className="p-2"
            >
              <ListOrdered className="h-4 w-4" />
            </Button>
          </div>

          {/* Alignment */}
          <div className="flex border-r border-gray-300 pr-2 mr-2">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => execCommand('justifyLeft')}
              className="p-2"
            >
              <AlignLeft className="h-4 w-4" />
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => execCommand('justifyCenter')}
              className="p-2"
            >
              <AlignCenter className="h-4 w-4" />
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => execCommand('justifyRight')}
              className="p-2"
            >
              <AlignRight className="h-4 w-4" />
            </Button>
          </div>

          {/* Special Elements */}
          <div className="flex border-r border-gray-300 pr-2 mr-2">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => execCommand('formatBlock', 'blockquote')}
              className="p-2"
            >
              <Quote className="h-4 w-4" />
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => execCommand('formatBlock', 'pre')}
              className="p-2"
            >
              <Code className="h-4 w-4" />
            </Button>
          </div>

          {/* Insert */}
          <div className="flex border-r border-gray-300 pr-2 mr-2">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={insertLink}
              className="p-2"
            >
              <Link className="h-4 w-4" />
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={insertImage}
              className="p-2"
            >
              <Image className="h-4 w-4" />
            </Button>
          </div>

          {/* Undo/Redo */}
          <div className="flex">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => execCommand('undo')}
              className="p-2"
            >
              <Undo className="h-4 w-4" />
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => execCommand('redo')}
              className="p-2"
            >
              <Redo className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Editor Content */}
      <div className="border border-gray-200 rounded-lg min-h-[400px]">
        <div
          ref={editorRef}
          contentEditable
          className="p-4 min-h-[400px] outline-none prose max-w-none"
          onInput={handleEditorChange}
          style={{
            lineHeight: '1.6',
            fontSize: '16px'
          }}
          placeholder="Start writing your article content..."
        />
      </div>

      {/* Actions */}
      <div className="flex justify-between pt-6">
        <Button
          onClick={onPrevious}
          variant="outline"
          className="flex items-center gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Previous: Article Details
        </Button>

        <Button
          onClick={handleSave}
          className="flex items-center gap-2"
        >
          <Save className="h-4 w-4" />
          Save Article
        </Button>
      </div>
    </div>
  );
});

// Main Stepper Component
const ArticleCreateSteps = () => {
  const { state, dispatch } = useCreateArticleStore();
  const { step, formData } = state;

  const handleNext = useCallback(() => {
    dispatch(createArticleSlice.setStep(step + 1));
  }, [dispatch, step]);

  const handlePrevious = useCallback(() => {
    dispatch(createArticleSlice.setStep(step - 1));
  }, [dispatch, step]);

  const handleSave = useCallback(() => {
    console.log('Article Data:', formData);
    alert('Article saved successfully!');
    dispatch(createArticleSlice.resetForm());
    dispatch(createArticleSlice.setStep(0));
  }, [dispatch, formData]);

  const StepComponent = step === 0
    ? React.memo(() => <ArticleForm
      formData={formData}
      dispatch={dispatch}
      onNext={handleNext}
    />)
    : React.memo(() => <ArticleEditor
      formData={formData}
      dispatch={dispatch}
      onPrevious={handlePrevious}
      onSave={handleSave}
    />);

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <Card className="max-w-4xl mx-auto shadow-lg rounded-2xl">
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <CardTitle className="text-2xl font-bold">Create New Article</CardTitle>
            <Badge variant="outline">
              Step {step + 1} of 2
            </Badge>
          </div>
          <Progress value={(step + 1) * 50} className="mt-4" />
        </CardHeader>
        <CardContent className="pt-6">
          <StepComponent />
        </CardContent>
      </Card>
    </div>
  );
};

export default ArticleCreateSteps;