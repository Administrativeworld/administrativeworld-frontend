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
  savedArticles: []
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
    },
    resetForm: (state) => {
      state.formData = initialState.formData;
      state.step = 0;
      state.error = null;
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
  addTag,
  removeTag,
  addKeyword,
  removeKeyword,
  setLoading,
  setError,
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

export default createArticleSlice.reducer;