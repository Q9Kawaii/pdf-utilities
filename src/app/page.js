'use client';

import { useRouter } from 'next/navigation';

export default function HomePage() {
  const router = useRouter();

  return (
    <div className="flex flex-col items-center justify-center h-full">
      <h2 className="text-6xl font-semibold mb-4 text-center">Welcome to your PDF Utility website!</h2>
      <p className="mb-8 text-gray-600 text-2xl text-center">
        Start building your PDF tools using Next.js and Tailwind CSS.
      </p>

      <button
        className="text-2xl font-extrabold bg-indigo-600 text-white px-6 py-2 rounded shadow hover:bg-blue-700 transition"
        onClick={() => router.push('/Upload')}
      >
        Upload
      </button>
    </div>
  );
}
