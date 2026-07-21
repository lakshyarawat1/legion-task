import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface GlobalState {
  isSidebarCollapsed: boolean;
  authToken: string | null;
  isShortcutOverlayOpen: boolean;
  isNewTaskModalOpen: boolean;
}

const initialState: GlobalState = {
  isSidebarCollapsed: false,
  authToken: null,
  isShortcutOverlayOpen: false,
  isNewTaskModalOpen: false,
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
    toggleShortcutOverlay: (state) => {
      state.isShortcutOverlayOpen = !state.isShortcutOverlayOpen;
    },
    setShortcutOverlayOpen: (state, action: PayloadAction<boolean>) => {
      state.isShortcutOverlayOpen = action.payload;
    },
    setNewTaskModalOpen: (state, action: PayloadAction<boolean>) => {
      state.isNewTaskModalOpen = action.payload;
    },
  },
});

export const {
  setIsSidebarCollapsed,
  toggleSidebar,
  setAuthToken,
  toggleShortcutOverlay,
  setShortcutOverlayOpen,
  setNewTaskModalOpen,
} = globalSlice.actions;
export default globalSlice.reducer;

