import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { recipeAPI } from '../../services/recipeAPI';

// Async thunks
export const fetchRecipes = createAsyncThunk(
  'recipes/fetchRecipes',
  async (filters = {}, { rejectWithValue }) => {
    try {
      const response = await recipeAPI.getRecipes(filters);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to fetch recipes'
      );
    }
  }
);

export const fetchRecipe = createAsyncThunk(
  'recipes/fetchRecipe',
  async (recipeId, { rejectWithValue }) => {
    try {
      const response = await recipeAPI.getRecipe(recipeId);
      return response.data.data.recipe;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to fetch recipe'
      );
    }
  }
);

export const createRecipe = createAsyncThunk(
  'recipes/createRecipe',
  async (recipeData, { rejectWithValue }) => {
    try {
      const response = await recipeAPI.createRecipe(recipeData);
      return response.data.data.recipe;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to create recipe'
      );
    }
  }
);

export const updateRecipe = createAsyncThunk(
  'recipes/updateRecipe',
  async ({ id, recipeData }, { rejectWithValue }) => {
    try {
      const response = await recipeAPI.updateRecipe(id, recipeData);
      return response.data.data.recipe;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to update recipe'
      );
    }
  }
);

export const deleteRecipe = createAsyncThunk(
  'recipes/deleteRecipe',
  async (recipeId, { rejectWithValue }) => {
    try {
      await recipeAPI.deleteRecipe(recipeId);
      return recipeId;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to delete recipe'
      );
    }
  }
);

// Recipe slice
const recipeSlice = createSlice({
  name: 'recipes',
  initialState: {
    recipes: [],
    currentRecipe: null,
    loading: false,
    error: null,
    filters: {
      category: 'All',
      search: '',
      difficulty: 'All',
      maxTime: '',
      tags: [],
      sortBy: 'createdAt',
      sortOrder: 'desc'
    },
    pagination: {
      currentPage: 1,
      totalPages: 1,
      totalRecipes: 0
    },
    availableTags: []
  },
  reducers: {
    clearCurrentRecipe: (state) => {
      state.currentRecipe = null;
    },
    clearError: (state) => {
      state.error = null;
    },
    setFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    clearFilters: (state) => {
      state.filters = { category: 'All', search: '' };
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch Recipes
      .addCase(fetchRecipes.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchRecipes.fulfilled, (state, action) => {
        state.loading = false;
        state.recipes = action.payload.recipes;
        state.pagination = {
          currentPage: action.payload.currentPage,
          totalPages: action.payload.totalPages,
          totalRecipes: action.payload.total
        };
        state.availableTags = action.payload.availableTags || [];
      })
      .addCase(fetchRecipes.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Fetch Single Recipe
      .addCase(fetchRecipe.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchRecipe.fulfilled, (state, action) => {
        state.loading = false;
        state.currentRecipe = action.payload;
      })
      .addCase(fetchRecipe.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Create Recipe
      .addCase(createRecipe.fulfilled, (state, action) => {
        state.recipes.unshift(action.payload);
      })
      .addCase(createRecipe.rejected, (state, action) => {
        state.error = action.payload;
      })
      // Update Recipe
      .addCase(updateRecipe.fulfilled, (state, action) => {
        const index = state.recipes.findIndex(recipe => recipe._id === action.payload._id);
        if (index !== -1) {
          state.recipes[index] = action.payload;
        }
        state.currentRecipe = action.payload;
      })
      .addCase(updateRecipe.rejected, (state, action) => {
        state.error = action.payload;
      })
      // Delete Recipe
      .addCase(deleteRecipe.fulfilled, (state, action) => {
        state.recipes = state.recipes.filter(recipe => recipe._id !== action.payload);
        if (state.currentRecipe && state.currentRecipe._id === action.payload) {
          state.currentRecipe = null;
        }
      })
      // Fetch User Tags
      .addCase(fetchUserTags.fulfilled, (state, action) => {
        state.availableTags = action.payload;
      });
  }
});

export const fetchUserTags = createAsyncThunk(
  'recipes/fetchUserTags',
  async (_, { rejectWithValue }) => {
    try {
      const response = await recipeAPI.getUserTags();
      return response.data.data.tags;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to fetch tags'
      );
    }
  }
);

export const { clearCurrentRecipe, clearError, setFilters, clearFilters } = recipeSlice.actions;
export default recipeSlice.reducer;