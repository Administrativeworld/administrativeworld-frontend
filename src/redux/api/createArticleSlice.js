import { createSlice } from '@reduxjs/toolkit';

const initialState = {
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
  },
  loading: false,
  error: null,
  savedArticles: [],
  isEditMode: false,
  originalArticleId: null
};

const createArticleSlice = createSlice({
  name: 'createArticle',
  initialState,
  reducers: {
    setStep: (state, action) => {
      state.step = action.payload;
    },
    updateFormData: (state, action) => {
      state.formData = { ...state.formData, ...action.payload };
    },
    setFormData: (state, action) => {
      state.formData = action.payload;
    },
    addTag: (state, action) => {
      if (!state.formData.tags.includes(action.payload)) {
        state.formData.tags.push(action.payload);
      }
    },
    removeTag: (state, action) => {
      state.formData.tags = state.formData.tags.filter(tag => tag !== action.payload);
    },
    addKeyword: (state, action) => {
      if (!state.formData.keywords.includes(action.payload)) {
        state.formData.keywords.push(action.payload);
      }
    },
    removeKeyword: (state, action) => {
      state.formData.keywords = state.formData.keywords.filter(keyword => keyword !== action.payload);
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
    setEditMode: (state, action) => {
      state.isEditMode = action.payload.isEditMode;
      state.originalArticleId = action.payload.articleId || null;
    },
    loadArticleForEdit: (state, action) => {
      const articleData = action.payload;
      state.formData = {
        title: articleData.title || '',
        slug: articleData.slug || '',
        content: articleData.content || '',
        thumbnail: articleData.thumbnail || '',
        category: typeof articleData.category === 'object' ? articleData.category._id : articleData.category || '',
        tags: articleData.tags || [],
        metaTitle: articleData.metaTitle || '',
        metaDescription: articleData.metaDescription || '',
        keywords: articleData.keywords || [],
        isFeatured: articleData.isFeatured || false,
        isTrending: articleData.isTrending || false,
        status: articleData.status || 'Draft'
      };
      state.isEditMode = true;
      state.originalArticleId = articleData._id;
      state.error = null;
    },
    saveArticle: (state, action) => {
      const articleWithId = {
        ...state.formData,
        id: Date.now().toString(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      state.savedArticles.push(articleWithId);
      state.formData = initialState.formData;
      state.step = 0;
      state.loading = false;
      state.error = null;
      state.isEditMode = false;
      state.originalArticleId = null;
    },
    resetForm: (state) => {
      state.formData = initialState.formData;
      state.step = 0;
      state.error = null;
      state.isEditMode = false;
      state.originalArticleId = null;
    },
    generateSlug: (state, action) => {
      const slug = action.payload
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .trim();
      state.formData.slug = slug;
    }
  }
});

export const {
  setStep,
  updateFormData,
  setFormData,
  addTag,
  removeTag,
  addKeyword,
  removeKeyword,
  setLoading,
  setError,
  setEditMode,
  loadArticleForEdit,
  saveArticle,
  resetForm,
  generateSlug
} = createArticleSlice.actions;

// Selectors
export const selectCreateArticle = (state) => state.createArticle;
export const selectFormData = (state) => state.createArticle.formData;
export const selectCurrentStep = (state) => state.createArticle.step;
export const selectIsLoading = (state) => state.createArticle.loading;
export const selectError = (state) => state.createArticle.error;
export const selectSavedArticles = (state) => state.createArticle.savedArticles;
export const selectIsEditMode = (state) => state.createArticle.isEditMode;
export const selectOriginalArticleId = (state) => state.createArticle.originalArticleId;

export default createArticleSlice.reducer;