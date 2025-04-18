import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { storage } from './firebase';

export const uploadFile = async (file: File, fileName: string): Promise<string> => {
    try {
        const storageRef = ref(storage, `pdf_uploads/${fileName}`);
        const snapshot = await uploadBytes(storageRef, file);
        const downloadURL = await getDownloadURL(snapshot.ref);
        return downloadURL;
    } catch (error) {
        console.error('Error uploading file:', error);
        throw error;
    }
};

export const deleteFile = async (fileName: string): Promise<void> => {
    try {
        const storageRef = ref(storage, `pdf_uploads/${fileName}`);
        await deleteObject(storageRef);
    } catch (error) {
        console.error('Error deleting file:', error);
        throw error;
    }
}; 