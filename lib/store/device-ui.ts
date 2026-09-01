import { create } from "zustand";

interface DeviceUIState {
  selectedDeviceId: string | null;
  editingScreenDeviceId: string | null;
  galleryOpen: boolean;
  galleryMode: "add" | "change";
  setSelectedDeviceId: (id: string | null) => void;
  setEditingScreenDeviceId: (id: string | null) => void;
  openGallery: (mode?: "add" | "change") => void;
  closeGallery: () => void;
  reconcileMockups: (mockupIds: readonly string[]) => void;
  resetDeviceUI: () => void;
}

export const useDeviceUIStore = create<DeviceUIState>((set) => ({
  selectedDeviceId: null,
  editingScreenDeviceId: null,
  galleryOpen: true,
  galleryMode: "add",
  setSelectedDeviceId: (selectedDeviceId) => set({ selectedDeviceId }),
  setEditingScreenDeviceId: (editingScreenDeviceId) => set({ editingScreenDeviceId }),
  openGallery: (galleryMode = "add") => set({ galleryOpen: true, galleryMode }),
  closeGallery: () => set({ galleryOpen: false }),
  reconcileMockups: (mockupIds) => set((state) => {
    if (mockupIds.length === 0) {
      return {
        selectedDeviceId: null,
        editingScreenDeviceId: null,
        galleryOpen: true,
        galleryMode: "add",
      };
    }

    const selectedDeviceId = state.selectedDeviceId && mockupIds.includes(state.selectedDeviceId)
      ? state.selectedDeviceId
      : null;
    const editingScreenDeviceId = state.editingScreenDeviceId && mockupIds.includes(state.editingScreenDeviceId)
      ? state.editingScreenDeviceId
      : null;
    const galleryMode = state.galleryMode === "change" && !selectedDeviceId
      ? "add"
      : state.galleryMode;

    if (
      selectedDeviceId === state.selectedDeviceId
      && editingScreenDeviceId === state.editingScreenDeviceId
      && galleryMode === state.galleryMode
    ) {
      return state;
    }

    return { selectedDeviceId, editingScreenDeviceId, galleryMode };
  }),
  resetDeviceUI: () => set({ selectedDeviceId: null, editingScreenDeviceId: null, galleryOpen: true, galleryMode: "add" }),
}));
