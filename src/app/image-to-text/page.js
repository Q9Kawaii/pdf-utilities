'use client';

import { useState } from 'react';
import Tesseract from 'tesseract.js';

// Utility: Resize image in browser before OCR
function resizeImage(file, maxDim = 1000) {
  return new Promise((resolve) => {
    const img = new window.Image();
    img.onload = function () {
      let { width, height } = img;
      if (width > maxDim || height > maxDim) {
        if (width > height) {
          height *= maxDim / width;
          width = maxDim;
        } else {
          width *= maxDim / height;
          height = maxDim;
        }
      }
      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;
      canvas.getContext('2d').drawImage(img, 0, 0, width, height);
      canvas.toBlob(resolve, 'image/jpeg', 0.8);
    };
    img.src = URL.createObjectURL(file);
  });
}

export default function ImageToTextPage() {
  const [selectedImage, setSelectedImage] = useState(null); // File object
  const [previewUrl, setPreviewUrl] = useState(null); // For preview
  const [ocrText, setOcrText] = useState('');
  const [ocrStatus, setOcrStatus] = useState('');
  const [progress, setProgress] = useState(0);

  const handleImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedImage(e.target.files[0]);
      setPreviewUrl(URL.createObjectURL(e.target.files[0]));
      setOcrText('');
      setProgress(0);
      setOcrStatus('');
    }
  };

  const handleExtractText = async () => {
    if (!selectedImage) return;
    setOcrStatus('Processing...');
    setProgress(0);

    // Resize image before OCR for speed
    const resizedBlob = await resizeImage(selectedImage, 1000);

    Tesseract.recognize(
      resizedBlob,
      'eng',
      {
        logger: m => {
          if (m.status === 'recognizing text') {
            setProgress(Math.round(m.progress * 100));
          }
        },
        workerPath: 'https://cdn.jsdelivr.net/npm/tesseract.js@5/dist/worker.min.js'
      }
    ).then(({ data: { text } }) => {
      setOcrText(text);
      setOcrStatus('Completed!');
    }).catch(() => {
      setOcrStatus('Failed');
    });
  };

  return (
    <div className="flex flex-col items-center justify-center h-full">
      <h2 className="text-4xl font-semibold mb-6">Extract Text from Image (OCR)</h2>
      <div className="flex gap-4 mb-7">
      <input
  type="file"
  accept="image/*"
  capture="environment"
  multiple
  onChange={handleImgUpload}
  className="hidden"
  id="imgUpload"
/>

        <label
          htmlFor="imgUpload"
          className="text-xl bg-indigo-600 text-white px-6 py-2 rounded shadow hover:bg-blue-500 transition cursor-pointer"
        >
          Upload Image
        </label>
      </div>

      {previewUrl && (
        <div className="flex flex-col items-center mb-6">
          <img src={previewUrl} alt="Selected" className="w-48 h-auto border mb-4" />
          <button
            onClick={handleExtractText}
            className="text-xl bg-teal-500 text-white px-6 py-2 rounded shadow hover:bg-teal-700 transition"
          >
            Extract Text
          </button>
        </div>
      )}

      {ocrStatus && <p className="mb-2 text-gray-600">{ocrStatus} {progress > 0 && progress < 100 ? `${progress}%` : ''}</p>}
      {ocrText && (
        <div className="mx-5 w-full max-w-xl bg-slate-950 p-4 rounded shadow text-white">
          <h3 className="text-lg font-semibold mb-2">Extracted Text:</h3>
          <pre className="whitespace-pre-wrap">{ocrText}</pre>
        </div>
      )}
    </div>
  );
}
