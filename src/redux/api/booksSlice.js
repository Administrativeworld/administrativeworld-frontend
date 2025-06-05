import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// 🧠 Async thunk to fetch books from backend
export const fetchBooks = createAsyncThunk(
  'books/fetchBooks',
  async (params, { rejectWithValue }) => {

    try {
      // Build query parameters properly
      const queryParams = new URLSearchParams();

      // Add all parameters to URLSearchParams (handles encoding and formatting)
      Object.entries(params).forEach(([key, value]) => {
        if (value !== null && value !== undefined && value !== '') {
          queryParams.append(key, String(value));
        }
      });

      const queryString = queryParams.toString();
      const url = `${import.meta.env.VITE_BASE_URL}/store/getAllBooks${queryString ? `?${queryString}` : ''}`;


      const response = await axios.post(url, {}, { withCredentials: true });

      // Validate response structure
      if (!response.data) {
        throw new Error('Invalid response format');
      }
      return response.data;
    } catch (err) {
      console.error('Error fetching books:', err);

      // Enhanced error handling
      if (err.response) {
        // Server responded with error status
        return rejectWithValue({
          message: err.response.data?.message || `Server error: ${err.response.status}`,
          status: err.response.status,
          data: err.response.data
        });
      } else if (err.request) {
        // Network error
        return rejectWithValue({
          message: 'Network error. Please check your connection.',
          type: 'NETWORK_ERROR'
        });
      } else {
        // Other error
        return rejectWithValue({
          message: err.message || 'Unknown error occurred',
          type: 'UNKNOWN_ERROR'
        });
      }
    }
  }
);

const initialState = {
  books: [],
  meta: {
    totalItems: 0,
    currentPage: 1,
    totalPages: 1,
    hasNextPage: false,
    hasPrevPage: false,
    limit: 10,
  },
  filters: {
    page: 1,
    limit: 10,
    sort: 'createdAt',
    order: 'desc',
    category: '',
    author: '',
    search: '',
  },
  loading: false,
  error: null,
  lastFetch: null, // Track when data was last fetched
};

const bookSlice = createSlice({
  name: 'books',
  initialState,
  reducers: {
    // 🔧 Update filters with validation
    setFilters: (state, action) => {
      const newFilters = { ...action.payload };

      // Validate and sanitize filters
      if (newFilters.page && (newFilters.page < 1 || !Number.isInteger(Number(newFilters.page)))) {
        newFilters.page = 1;
      }

      if (newFilters.limit && (newFilters.limit < 1 || newFilters.limit > 100)) {
        newFilters.limit = Math.min(Math.max(1, newFilters.limit), 100);
      }

      if (newFilters.order && !['asc', 'desc'].includes(newFilters.order)) {
        newFilters.order = 'desc';
      }

      const validSortFields = ['createdAt', 'title', 'author', 'price', 'purchases'];
      if (newFilters.sort && !validSortFields.includes(newFilters.sort)) {
        newFilters.sort = 'createdAt';
      }

      state.filters = {
        ...state.filters,
        ...newFilters,
      };

      // Clear error when filters change
      state.error = null;
    },

    // 🔄 Update specific filter
    updateFilter: (state, action) => {
      const { key, value } = action.payload;
      if (key in state.filters) {
        state.filters[key] = value;
        state.error = null;
      }
    },

    // 📄 Reset to first page (useful for new searches)
    resetToFirstPage: (state) => {
      state.filters.page = 1;
    },

    // 🧼 Reset books and filters
    resetBooksState: () => initialState,

    // 🗑️ Clear error
    clearError: (state) => {
      state.error = null;
    },

    // 🔄 Set loading state manually (for optimistic updates)
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchBooks.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchBooks.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.lastFetch = new Date().toISOString();

        // Handle different response structures gracefully
        if (action.payload.data && Array.isArray(action.payload.data)) {
          state.books = action.payload.data;
        } else if (Array.isArray(action.payload)) {
          state.books = action.payload;
        } else {
          state.books = [];
        }

        // Update meta information with fallbacks
        if (action.payload.meta) {
          state.meta = {
            ...state.meta,
            ...action.payload.meta,
          };
        } else {
          // Fallback meta calculation if not provided by API
          state.meta = {
            ...state.meta,
            totalItems: state.books.length,
            currentPage: state.filters.page,
            totalPages: Math.ceil(state.books.length / state.filters.limit) || 1,
            hasNextPage: false,
            hasPrevPage: state.filters.page > 1,
            limit: state.filters.limit,
          };
        }
      })
      .addCase(fetchBooks.rejected, (state, action) => {
        state.loading = false;
        state.books = [];
        state.error = action.payload?.message || 'Failed to fetch books';

        // Reset meta on error
        state.meta = {
          ...initialState.meta,
          currentPage: state.filters.page,
          limit: state.filters.limit,
        };
      });
  },
});

export const {
  setFilters,
  updateFilter,
  resetToFirstPage,
  resetBooksState,
  clearError,
  setLoading
} = bookSlice.actions;

export default bookSlice.reducer;

// 🎯 Selectors for easy state access
export const selectBooks = (state) => state.books.books;
export const selectBooksLoading = (state) => state.books.loading;
export const selectBooksError = (state) => state.books.error;
export const selectBooksMeta = (state) => state.books.meta;
export const selectBooksFilters = (state) => state.books.filters;
export const selectLastFetch = (state) => state.books.lastFetch;

// 🔍 Computed selectors
export const selectHasBooks = (state) => state.books.books.length > 0;
export const selectIsFirstPage = (state) => state.books.filters.page === 1;
export const selectCanGoNext = (state) => state.books.meta.hasNextPage;
export const selectCanGoPrevious = (state) => state.books.meta.hasPrevPage;