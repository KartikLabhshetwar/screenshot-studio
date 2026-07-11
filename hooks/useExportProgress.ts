import { create } from "zustand";

export const useExportProgress = create<{
  active: boolean;
  progress: number;
  controller: AbortController | null;
  /** Begins a new export and returns the signal that cancels it. */
  start: () => AbortSignal;
  set: (v: number) => void;
  done: () => void;
  /** Cancels the in-progress export, if any. */
  abort: () => void;
}>((set, get) => ({
  active: false,
  progress: 0,
  controller: null,
  start: () => {
    const controller = new AbortController();
    set({ active: true, progress: 0, controller });
    return controller.signal;
  },
  set: (v) => set({ progress: v }),
  done: () => set({ active: false, progress: 100, controller: null }),
  abort: () => {
    get().controller?.abort();
    set({ active: false, controller: null });
  },
}));
