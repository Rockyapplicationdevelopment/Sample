import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Commission, CommissionSummary } from '@models/Commission';

interface CommissionState {
  commissions: Commission[];
  summary: CommissionSummary | null;
  loading: boolean;
  error: string | null;
}

const initialState: CommissionState = {
  commissions: [],
  summary: null,
  loading: false,
  error: null,
};

const commissionSlice = createSlice({
  name: 'commission',
  initialState,
  reducers: {
    setCommissions: (state, action: PayloadAction<Commission[]>) => {
      state.commissions = action.payload;
      state.loading = false;
      state.error = null;
    },
    setSummary: (state, action: PayloadAction<CommissionSummary>) => {
      state.summary = action.payload;
    },
    addCommission: (state, action: PayloadAction<Commission>) => {
      state.commissions.push(action.payload);
    },
    updateCommission: (state, action: PayloadAction<Commission>) => {
      const index = state.commissions.findIndex(c => c.id === action.payload.id);
      if (index !== -1) {
        state.commissions[index] = action.payload;
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
    clearCommissions: (state) => {
      state.commissions = [];
      state.summary = null;
      state.error = null;
      state.loading = false;
    },
  },
});

export const {
  setCommissions,
  setSummary,
  addCommission,
  updateCommission,
  setLoading,
  setError,
  clearError,
  clearCommissions,
} = commissionSlice.actions;

export default commissionSlice.reducer;
