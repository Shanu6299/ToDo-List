import { createSlice } from '@reduxjs/toolkit';

export const alertSlice = createSlice({
  name: "alerts",
  initialState: {
    loading: false,
  },
  reducers: {
    showLoading: (state) => {
      state.loading = true;
    },
    hideLoading: (state) => {
      state.loading = false; // Corrected from 'Loading' to 'loading'
    }
  }
});

export const { showLoading, hideLoading } = alertSlice.actions;
export default alertSlice;
