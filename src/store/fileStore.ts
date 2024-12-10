import { create } from 'zustand';
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { storage } from '../config/firebase';
import { FileAttachment } from '../types';

interface FileState {
  uploadFile: (file: File, userId: string) => Promise<FileAttachment>;
  deleteFile: (fileId: string) => Promise<void>;
}

export const useFileStore = create<FileState>(() => ({
  uploadFile: async (file: File, userId: string) => {
    const fileId = crypto.randomUUID();
    const storageRef = ref(storage, `files/${fileId}-${file.name}`);
    await uploadBytes(storageRef, file);
    const url = await getDownloadURL(storageRef);

    return {
      id: fileId,
      name: file.name,
      url,
      type: file.type,
      size: file.size,
      createdAt: new Date().toISOString(),
      createdBy: userId,
    };
  },
  deleteFile: async (fileId: string) => {
    const storageRef = ref(storage, `files/${fileId}`);
    await deleteObject(storageRef);
  },
}));