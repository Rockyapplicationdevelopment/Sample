import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Franchise } from '@models/Franchise';

interface FranchiseState {
  franchises: Franchise[];
  currentFranchise: Franchise | null;
  loading: boolean;
  error: string | null;
}

const initialState: FranchiseState = {
  franchises: [],
  currentFranchise: null,
  loading: false,
  error: null,
};

const franchiseSlice = createSlice({
  name: 'franchise',
  initialState,
  reducers: {
    setFranchises: (state, action: PayloadAction<Franchise[]>) => {
      state.franchises = action.payload;
      state.loading = false;
      state.error = null;
    },
    setCurrentFranchise: (state, action: PayloadAction<Franchise | null>) => {
      state.currentFranchise = action.payload;
    },
    addFranchise: (state, action: PayloadAction<Franchise>) => {
      state.franchises.push(action.payload);
    },
    updateFranchise: (state, action: PayloadAction<Franchise>) => {
      const index = state.franchises.findIndex(f => f.id === action.payload.id);
      if (index !== -1) {
        state.franchises[index] = action.payload;
      }
      if (state.currentFranchise?.id === action.payload.id) {
        state.currentFranchise = action.payload;
      }
    },
    deleteFranchise: (state, action: PayloadAction<string>) => {
      state.franchises = state.franchises.filter(f => f.id !== action.payload);
      if (state.currentFranchise?.id === action.payload) {
        state.currentFranchise = null;
      }
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
      state.loading = false;
    },
    clearError: (state) => {
      state.error = null;
    },
    clearFranchises: (state) => {
      state.franchises = [];
      state.currentFranchise = null;
      state.error = null;
      state.loading = false;
    },
  },
});

export const {
  setFranchises,
  setCurrentFranchise,
  addFranchise,
  updateFranchise,
  deleteFranchise,
  setLoading,
  setError,
  clearError,
  clearFranchises,
} = franchiseSlice.actions;

export default franchiseSlice.reducer;
