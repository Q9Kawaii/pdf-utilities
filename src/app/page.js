'use client';

import { useRouter } from 'next/navigation';

export default function HomePage() {
  const router = useRouter();

  return (
    <div className="flex flex-col items-center justify-center h-full">
      <h2 className="text-6xl font-semibold mb-4 text-center">Welcome to your PDF Utility website!</h2>
      <p className="mb-8 text-gray-600 text-2xl text-center">
      Manage your PDFs effortlessly — upload, merge, convert, and extract in just a few clicks!
      </p>

      <button
          className="text-2xl font-extrabold bg-indigo-600 text-white px-6 py-2 rounded shadow hover:bg-blue-700 transition mb-4"
          onClick={() => router.push('/Upload')}
        >
          PDF Tools
        </button>
        <button
          className="text-2xl font-extrabold bg-teal-600 text-white px-6 py-2 rounded shadow hover:bg-teal-700 transition mb-4"
          onClick={() => router.push('/image-to-pdf')}
        >
          Image to PDF
        </button>
        <button
                className="text-2xl font-extrabold bg-amber-600 text-white px-6 py-2 rounded shadow hover:bg-amber-700 transition mb-4"
                onClick={() => router.push('/image-to-text')}
              >
                Image to Text (OCR)
      </button>

    </div>
  );
}
