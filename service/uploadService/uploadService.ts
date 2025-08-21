import { axiosPrivate } from "@/axios/axios";


export interface PresignedUrlRequest {
  file_name: string;
  file_type: string;
}

export interface PresignedUrlResponse {
  upload_url: string;
  fields: {
    "Content-Type": string;
    key: string;
    "x-amz-algorithm": string;
    "x-amz-credential": string;
    "x-amz-date": string;
    policy: string;
    "x-amz-signature": string;
  };
  file_key: string;
}

export interface S3UploadResponse {
  status: number;
  message: string;
  data: {
    uploads: PresignedUrlResponse[];
  };
}

// Function to get presigned URLs
export const getPresignedUrls = async (files: PresignedUrlRequest[]): Promise<S3UploadResponse> => {
  try {
    const response = await axiosPrivate.post('/clinic/s3-presigned-url/', {
      files
    });
    return response.data;
  } catch (error) {
    console.error("Error getting presigned URLs:", error);
    throw error;
  }
};

// Function to upload file to S3 using presigned URL
export const uploadFileToS3 = async (presignedData: PresignedUrlResponse, file: File): Promise<string> => {
  try {
    const formData = new FormData();
    
    // Add all fields from the presigned URL response
    Object.entries(presignedData.fields).forEach(([key, value]) => {
      formData.append(key, value);
    });
    
    // Add the actual file
    formData.append('file', file);
    
    // Upload to S3
    const response = await fetch(presignedData.upload_url, {
      method: 'POST',
      body: formData,
    });
    
    if (!response.ok) {
      throw new Error(`S3 upload failed with status ${response.status}`);
    }
    
    // Return the file key for reference
    return presignedData.file_key;
  } catch (error) {
    console.error("Error uploading file to S3:", error);
    throw error;
  }
};

// Main function to handle multiple file uploads
export const uploadFiles = async (files: File[]): Promise<string[]> => {
  try {
    // Prepare file requests for presigned URLs
    const fileRequests: PresignedUrlRequest[] = files.map(file => ({
      file_name: file.name,
      file_type: file.type
    }));
    
    // Get presigned URLs
    const presignedResponse = await getPresignedUrls(fileRequests);
    
    // Upload each file to S3
    const uploadPromises = files.map((file, index) => 
      uploadFileToS3(presignedResponse.data.uploads[index], file)
    );
    
    // Wait for all uploads to complete
    const uploadedFileKeys = await Promise.all(uploadPromises);
    
    // Return full URLs (combine upload_url with file_key)
    // Note: You might need to adjust this based on your S3 bucket URL structure
    const baseUrl = presignedResponse.data.uploads[0]?.upload_url.split('/').slice(0, 3).join('/');
    const fullUrls = uploadedFileKeys.map(key => `${baseUrl}/${key}`);
    
    return fullUrls;
  } catch (error) {
    console.error("Error in upload process:", error);
    throw error;
  }
};