import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface GlobalState {
  isSidebarCollapsed: boolean;
  authToken: string | null;
}

const initialState: GlobalState = {
  isSidebarCollapsed: false,
  authToken: null,
};

const globalSlice = createSlice({
  name: "global",
  initialState,
  reducers: {
    setIsSidebarCollapsed: (state, action: PayloadAction<boolean>) => {
      state.isSidebarCollapsed = action.payload;
    },
    toggleSidebar: (state) => {
      state.isSidebarCollapsed = !state.isSidebarCollapsed;
    },
    setAuthToken: (state, action: PayloadAction<string | null>) => {
      state.authToken = action.payload;
    },
  },
});

export const { setIsSidebarCollapsed, toggleSidebar, setAuthToken } = globalSlice.actions;
export default globalSlice.reducer;
