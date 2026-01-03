import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Agent } from '@models/Agent';
import { Franchise } from '@models/Franchise';

interface AppState {
  user: Agent | Franchise | null;
  userType: 'AGENT' | 'FRANCHISE' | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
}

const initialState: AppState = {
  user: null,
  userType: null,
  isAuthenticated: false,
  loading: false,
  error: null,
};

const appSlice = createSlice({
  name: 'app',
  initialState,
  reducers: {
    login: (state, action: PayloadAction<{ user: Agent | Franchise; userType: 'AGENT' | 'FRANCHISE' }>) => {
      state.user = action.payload.user;
      state.userType = action.payload.userType;
      state.isAuthenticated = true;
      state.error = null;
      state.loading = false;
    },
    logout: (state) => {
      state.user = null;
      state.userType = null;
      state.isAuthenticated = false;
      state.error = null;
      state.loading = false;
    },
    updateUser: (state, action: PayloadAction<Agent | Franchise>) => {
      state.user = action.payload;
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
  },
});

export const {
  login,
  logout,
  updateUser,
  setLoading,
  setError,
  clearError,
} = appSlice.actions;

export default appSlice.reducer;
