'use client';

import { useState } from 'react';

export default function HomePage() {
  const [message, setMessage] = useState('Welcome to your PDF Utility website!');
  const [showFileTypeSelection, setShowFileTypeSelection] = useState(false);

  const handleButtonClick = () => {
    setMessage('Let’s build something awesome!');
    setShowFileTypeSelection(true);
  };

  return (
    <div className="flex flex-col items-center justify-center h-full">
      {!showFileTypeSelection ? (
        <>
          <h2 className="text-6xl font-semibold mb-4 text-center">{message}</h2>
          <p className="mb-8 text-gray-600 text-2xl text-center">
            Start building your PDF tools using Next.js and Tailwind CSS.
          </p>

          <button
            className="text-2xl font-extrabold bg-indigo-600 text-white px-6 py-2 rounded shadow hover:bg-blue-700 transition"
            onClick={handleButtonClick}
          >
            Upload
          </button>
        </>
      ) : (
        <div className="flex flex-col items-center justify-center">
          <h2 className="text-4xl font-semibold mb-4">Select File Type</h2>
          <div className="flex gap-4">
            <button
              className="text-xl bg-green-500 text-white px-6 py-2 rounded shadow hover:bg-green-700 transition"
              onClick={() => alert('Select Image file type')}
            >
              Image (JPEG, PNG, etc)
            </button>
            <button
              className="text-xl bg-blue-500 text-white px-6 py-2 rounded shadow hover:bg-blue-700 transition"
              onClick={() => alert('Select PDF file type')}
            >
              PDF
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
