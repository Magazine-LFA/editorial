import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { storage } from './firebase';

export const uploadFile = async (file: File, fileName: string): Promise<string> => {
    try {
        // Create a reference to the file location
        const storageRef = ref(storage, `pdf_uploads/${fileName}`);
        
        // Convert File to Blob
        const blob = new Blob([await file.arrayBuffer()], { type: file.type });
        
        // Upload the file
        const snapshot = await uploadBytes(storageRef, blob, {
            contentType: file.type,
            customMetadata: {
                originalName: file.name
            }
        });
        
        // Get the download URL
        const downloadURL = await getDownloadURL(snapshot.ref);
        return downloadURL;
    } catch (error) {
        console.error('Error uploading file:', error);
        if (error instanceof Error) {
            throw new Error(`Failed to upload file: ${error.message}`);
        }
        throw new Error('Failed to upload file: Unknown error');
    }
};

export const deleteFile = async (fileName: string): Promise<void> => {
    try {
        const storageRef = ref(storage, `pdf_uploads/${fileName}`);
        await deleteObject(storageRef);
    } catch (error) {
        console.error('Error deleting file:', error);
        if (error instanceof Error) {
            throw new Error(`Failed to delete file: ${error.message}`);
        }
        throw new Error('Failed to delete file: Unknown error');
    }
}; 