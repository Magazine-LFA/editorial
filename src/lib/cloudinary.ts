import { v2 as cloudinary } from 'cloudinary';

// Configure Cloudinary
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

export const uploadFile = async (file: File, fileName: string): Promise<{ success: boolean; url?: string; error?: string }> => {
    try {
        if (!file || !(file instanceof File)) {
            return { success: false, error: 'Invalid file object' };
        }

        // Convert File to base64
        const arrayBuffer = await file.arrayBuffer();
        const base64String = Buffer.from(arrayBuffer).toString('base64');
        const dataUri = `data:${file.type};base64,${base64String}`;

        // Upload to Cloudinary
        const result = await cloudinary.uploader.upload(dataUri, {
            resource_type: 'raw',
            public_id: `pdf_uploads/${fileName}`,
            format: 'pdf',
            overwrite: true
        });

        return { success: true, url: result.secure_url };
    } catch (error) {
        console.error('Cloudinary upload error:', error);
        return { 
            success: false, 
            error: error instanceof Error ? error.message : 'Failed to upload file to Cloudinary'
        };
    }
};

export const deleteFile = async (fileName: string): Promise<{ success: boolean; error?: string }> => {
    try {
        if (!fileName) {
            return { success: false, error: 'File name is required' };
        }

        // Delete from Cloudinary
        const result = await cloudinary.uploader.destroy(`pdf_uploads/${fileName}`, {
            resource_type: 'raw'
        });

        if (result.result !== 'ok') {
            return { success: false, error: 'Failed to delete file from Cloudinary' };
        }

        return { success: true };
    } catch (error) {
        console.error('Cloudinary delete error:', error);
        return { 
            success: false, 
            error: error instanceof Error ? error.message : 'Failed to delete file from Cloudinary'
        };
    }
}; 