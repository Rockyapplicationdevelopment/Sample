import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Territory } from '@models/Territory';

interface TerritoryState {
  territories: Territory[];
  selectedTerritory: Territory | null;
  loading: boolean;
  error: string | null;
}

const initialState: TerritoryState = {
  territories: [],
  selectedTerritory: null,
  loading: false,
  error: null,
};

const territorySlice = createSlice({
  name: 'territory',
  initialState,
  reducers: {
    setTerritories: (state, action: PayloadAction<Territory[]>) => {
      state.territories = action.payload;
      state.loading = false;
      state.error = null;
    },
    setSelectedTerritory: (state, action: PayloadAction<Territory | null>) => {
      state.selectedTerritory = action.payload;
    },
    addTerritory: (state, action: PayloadAction<Territory>) => {
      state.territories.push(action.payload);
    },
    updateTerritory: (state, action: PayloadAction<Territory>) => {
      const index = state.territories.findIndex(t => t.id === action.payload.id);
      if (index !== -1) {
        state.territories[index] = action.payload;
      }
      if (state.selectedTerritory?.id === action.payload.id) {
        state.selectedTerritory = action.payload;
      }
    },
    deleteTerritory: (state, action: PayloadAction<string>) => {
      state.territories = state.territories.filter(t => t.id !== action.payload);
      if (state.selectedTerritory?.id === action.payload) {
        state.selectedTerritory = null;
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
    clearTerritories: (state) => {
      state.territories = [];
      state.selectedTerritory = null;
      state.error = null;
      state.loading = false;
    },
  },
});

export const {
  setTerritories,
  setSelectedTerritory,
  addTerritory,
  updateTerritory,
  deleteTerritory,
  setLoading,
  setError,
  clearError,
  clearTerritories,
} = territorySlice.actions;

export default territorySlice.reducer;
