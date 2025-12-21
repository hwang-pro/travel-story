import { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, X, Image as ImageIcon } from 'lucide-react';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { storage } from '../lib/firebase';

interface PhotoUploaderProps {
  tripId: string;
  uid: string;
  onPhotosUploaded: (urls: string[]) => void;
}

interface UploadedFile {
  file: File;
  preview: string;
  uploading: boolean;
  uploaded: boolean;
  url?: string;
}

export const PhotoUploader: React.FC<PhotoUploaderProps> = ({
  tripId,
  uid,
  onPhotosUploaded,
}) => {
  const [files, setFiles] = useState<UploadedFile[]>([]);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const newFiles = acceptedFiles.map(file => ({
      file,
      preview: URL.createObjectURL(file),
      uploading: false,
      uploaded: false,
    }));
    setFiles(prev => [...prev, ...newFiles]);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.webp', '.heic']
    },
    multiple: true,
  });

  const removeFile = (index: number) => {
    setFiles(prev => {
      const newFiles = [...prev];
      URL.revokeObjectURL(newFiles[index].preview);
      newFiles.splice(index, 1);
      return newFiles;
    });
  };

  const uploadFiles = async () => {
    const uploadedUrls: string[] = [];

    for (let i = 0; i < files.length; i++) {
      if (files[i].uploaded) {
        uploadedUrls.push(files[i].url!);
        continue;
      }

      setFiles(prev => {
        const newFiles = [...prev];
        newFiles[i].uploading = true;
        return newFiles;
      });

      try {
        const file = files[i].file;
        const timestamp = Date.now();
        const storageRef = ref(storage, `photos/${uid}/${tripId}/${timestamp}_${file.name}`);
        
        await uploadBytes(storageRef, file);
        const url = await getDownloadURL(storageRef);
        
        uploadedUrls.push(url);

        setFiles(prev => {
          const newFiles = [...prev];
          newFiles[i].uploading = false;
          newFiles[i].uploaded = true;
          newFiles[i].url = url;
          return newFiles;
        });
      } catch (error) {
        console.error('파일 업로드 오류:', error);
        setFiles(prev => {
          const newFiles = [...prev];
          newFiles[i].uploading = false;
          return newFiles;
        });
      }
    }

    if (uploadedUrls.length > 0) {
      onPhotosUploaded(uploadedUrls);
    }
  };

  return (
    <div className="space-y-4">
      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-colors ${
          isDragActive
            ? 'border-gray-900 bg-gray-50'
            : 'border-gray-300 hover:border-gray-400'
        }`}
      >
        <input {...getInputProps()} />
        <div className="flex flex-col items-center gap-3">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center">
            <Upload className="w-8 h-8 text-gray-600" />
          </div>
          <div>
            <p className="text-lg font-medium text-gray-900">
              {isDragActive ? '여기에 놓아주세요' : '사진을 드래그하거나 클릭하세요'}
            </p>
            <p className="text-sm text-gray-500 mt-1">
              JPG, PNG, WEBP (최대 10MB)
            </p>
          </div>
        </div>
      </div>

      {files.length > 0 && (
        <div className="space-y-4">
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {files.map((file, index) => (
              <div key={index} className="relative group">
                <div className="aspect-square rounded-xl overflow-hidden bg-gray-100">
                  <img
                    src={file.preview}
                    alt={`Preview ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </div>
                
                {file.uploading && (
                  <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center rounded-xl">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
                  </div>
                )}

                {file.uploaded && (
                  <div className="absolute inset-0 bg-green-500 bg-opacity-20 flex items-center justify-center rounded-xl">
                    <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                      <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                  </div>
                )}

                {!file.uploading && !file.uploaded && (
                  <button
                    onClick={() => removeFile(index)}
                    className="absolute top-2 right-2 w-8 h-8 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"
                  >
                    <X className="w-5 h-5" />
                  </button>
                )}
              </div>
            ))}
          </div>

          {files.some(f => !f.uploaded) && (
            <button
              onClick={uploadFiles}
              disabled={files.some(f => f.uploading)}
              className="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {files.some(f => f.uploading) ? '업로드 중...' : '사진 업로드하기'}
            </button>
          )}
        </div>
      )}
    </div>
  );
};

