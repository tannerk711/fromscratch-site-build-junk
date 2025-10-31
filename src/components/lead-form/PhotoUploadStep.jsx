import { useFormContext } from 'react-hook-form';
import { useEffect, useRef, useState } from 'react';

export default function PhotoUploadStep() {
  const { setValue, watch, formState: { errors } } = useFormContext();
  const photos = watch('photos') || [];
  const [isUploading, setIsUploading] = useState(false);
  const widgetRef = useRef(null);

  useEffect(() => {
    // Load Cloudinary upload widget script
    if (!window.cloudinary) {
      const script = document.createElement('script');
      script.src = 'https://upload-widget.cloudinary.com/global/all.js';
      script.async = true;
      document.body.appendChild(script);
    }
  }, []);

  const openUploadWidget = () => {
    if (!window.cloudinary) {
      alert('Upload widget is still loading. Please try again in a moment.');
      return;
    }

    // Cloudinary configuration (hardcoded for client-side upload)
    const cloudName = 'dk6zsdaaj';
    const uploadPreset = 'junk-removal-unsigned';

    console.log('Initializing Cloudinary widget with:', { cloudName, uploadPreset });

    widgetRef.current = window.cloudinary.createUploadWidget(
      {
        cloudName,
        uploadPreset,
        sources: ['local', 'camera'],
        multiple: true,
        maxFiles: 10,
        clientAllowedFormats: ['jpg', 'jpeg', 'png', 'webp'],
        maxFileSize: 10000000, // 10MB
        cropping: false,
        resourceType: 'image',
      },
      (error, result) => {
        if (error) {
          console.error('Upload error:', error);
          console.error('Error details:', {
            message: error.message,
            statusText: error.statusText,
            status: error.status,
            name: error.name,
            fullError: JSON.stringify(error, null, 2)
          });
          alert(`Upload failed: ${error.statusText || error.message || 'Unknown error'}. Check console for details.`);
          setIsUploading(false);
          return;
        }

        if (result.event === 'queues-start') {
          setIsUploading(true);
        }

        if (result.event === 'success') {
          const newPhoto = {
            url: result.info.secure_url,
            publicId: result.info.public_id,
            thumbnail: result.info.thumbnail_url,
          };

          const currentPhotos = watch('photos') || [];
          setValue('photos', [...currentPhotos, newPhoto], { shouldValidate: true });
        }

        if (result.event === 'queues-end') {
          setIsUploading(false);
        }
      }
    );

    widgetRef.current.open();
  };

  const removePhoto = (index) => {
    const currentPhotos = watch('photos') || [];
    const updated = currentPhotos.filter((_, i) => i !== index);
    setValue('photos', updated, { shouldValidate: true });
  };

  return (
    <div>
      <h2 className="font-display text-2xl font-semibold text-slate-900">
        Upload photos of the junk
      </h2>
      <p className="mt-2 text-sm text-slate-600">
        Photos help us provide an accurate estimate. Upload multiple angles if possible.
      </p>

      <div className="mt-6">
        <button
          type="button"
          onClick={openUploadWidget}
          disabled={isUploading}
          className="relative flex w-full flex-col items-center justify-center rounded-lg border-2 border-dashed border-slate-300 bg-slate-50 p-12 hover:border-slate-400 hover:bg-slate-100 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isUploading ? (
            <>
              <div className="h-12 w-12 animate-spin rounded-full border-4 border-slate-300 border-t-blue-600"></div>
              <p className="mt-4 text-sm font-medium text-slate-900">Uploading photos...</p>
            </>
          ) : (
            <>
              <svg
                className="h-12 w-12 text-slate-400"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 0 0 1.5-1.5V6a1.5 1.5 0 0 0-1.5-1.5H3.75A1.5 1.5 0 0 0 2.25 6v12a1.5 1.5 0 0 0 1.5 1.5Zm10.5-11.25h.008v.008h-.008V8.25Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z"
                />
              </svg>
              <p className="mt-4 text-sm font-medium text-slate-900">
                Click to upload photos
              </p>
              <p className="mt-1 text-xs text-slate-500">
                PNG, JPG, WEBP up to 10MB each
              </p>
            </>
          )}
        </button>

        {photos.length > 0 && (
          <div className="mt-6">
            <p className="text-sm font-medium text-slate-900 mb-3">
              {photos.length} photo{photos.length !== 1 ? 's' : ''} uploaded
            </p>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
              {photos.map((photo, index) => (
                <div key={index} className="relative group">
                  <img
                    src={photo.url}
                    alt={`Uploaded ${index + 1}`}
                    className="h-32 w-full rounded-lg object-cover"
                  />
                  <button
                    type="button"
                    onClick={() => removePhoto(index)}
                    className="absolute top-2 right-2 rounded-full bg-red-600 p-1.5 text-white opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-700"
                  >
                    <svg
                      className="h-4 w-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth="2"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M6 18 18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {errors.photos && (
          <p className="mt-2 text-sm text-red-600">{errors.photos.message}</p>
        )}
      </div>

      <div className="mt-6 rounded-lg bg-blue-50 p-4">
        <div className="flex">
          <svg
            className="h-5 w-5 text-blue-600 flex-shrink-0"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="1.5"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 18v-5.25m0 0a6.01 6.01 0 0 0 1.5-.189m-1.5.189a6.01 6.01 0 0 1-1.5-.189m3.75 7.478a12.06 12.06 0 0 1-4.5 0m3.75 2.383a14.406 14.406 0 0 1-3 0M14.25 18v-.192c0-.983.658-1.823 1.508-2.316a7.5 7.5 0 1 0-7.517 0c.85.493 1.509 1.333 1.509 2.316V18"
            />
          </svg>
          <div className="ml-3">
            <p className="text-sm font-medium text-blue-900">
              Tips for better photos:
            </p>
            <ul className="mt-2 text-sm text-blue-800 space-y-1">
              <li>• Take photos from multiple angles</li>
              <li>• Include surrounding area for context</li>
              <li>• Make sure items are clearly visible</li>
              <li>• More photos = more accurate estimate</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
