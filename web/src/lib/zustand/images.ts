import { create } from "zustand";

export interface Image {
  url: string;
  createdAt: Date;
}

interface ImageStore {
  images: Image[];
  setImages: (images: Image[]) => void;
}

export const useImageStore = create<ImageStore>()((set) => ({
  images: [],
  setImages: (images: Image[]) => set({ images }),
}));
