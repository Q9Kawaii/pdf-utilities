'use client';

import { useState } from 'react';
import * as pdfLib from 'pdf-lib';
import { pdfToImg } from 'pdftoimg-js/browser';

export default function UploadPage() {
  const [files, setFiles] = useState([]);
  const [images, setImages] = useState([]);
  const [uploadPdfMsg, setUploadPdfMsg] = useState('Upload PDF');
  const [uploadDisabled, setUploadDisabled] = useState(false);

  const handleFileUpload = (e) => {
    setFiles(e.target.files);
    setImages([]);
    if (e.target.files.length > 0) {
      setUploadPdfMsg('PDFs uploaded! You can now choose an operation.');
      setUploadDisabled(true);
    } else {
      setUploadPdfMsg('Upload PDF');
      setUploadDisabled(false);
    }
  };

  // Merge PDFs and download result
  const handleMergePdfs = async () => {
    if (!files.length) return;

    const pdfFiles = Array.from(files).filter(file => file.type === 'application/pdf');
    if (pdfFiles.length < 2) {
      alert('Please upload at least two PDF files to merge.');
      return;
    }

    const pdfDocs = await Promise.all(pdfFiles.map(async (file) => {
      const pdfBytes = await file.arrayBuffer();
      return await pdfLib.PDFDocument.load(pdfBytes);
    }));

    const mergedPdf = await pdfLib.PDFDocument.create();
    for (const pdfDoc of pdfDocs) {
      const copiedPages = await mergedPdf.copyPages(pdfDoc, pdfDoc.getPageIndices());
      copiedPages.forEach((page) => mergedPdf.addPage(page));
    }

    const mergedPdfBytes = await mergedPdf.save();
    const mergedPdfBlob = new Blob([mergedPdfBytes], { type: 'application/pdf' });
    const mergedPdfUrl = URL.createObjectURL(mergedPdfBlob);

    const link = document.createElement('a');
    link.href = mergedPdfUrl;
    link.download = 'merged.pdf';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(mergedPdfUrl);
  };

  // Convert PDFs to images
  const handleConvertToImages = async () => {
    let allImages = [];
    for (const file of files) {
      const pdfUrl = URL.createObjectURL(file);
      const imgSrcs = await pdfToImg(pdfUrl, { imgType: 'png', pages: 'all' });
      allImages.push(...imgSrcs);
      URL.revokeObjectURL(pdfUrl);
    }
    setImages(allImages);
  };

  // Download image helper
  const handleDownloadImage = (src, idx) => {
    const link = document.createElement('a');
    link.href = src;
    link.download = `page-${idx + 1}.png`;
    link.click();
  };

  return (
    <div className="flex flex-col items-center justify-center h-full">
          <h2 className="text-4xl font-semibold mb-6">PDF to Image</h2>
      <div className="flex gap-4 mb-7">
        <input
          type="file"
          accept="application/pdf"
          multiple
          onChange={handleFileUpload}
          className="hidden"
          id="pdfUpload"
          disabled={uploadDisabled}
        />
        <label
          htmlFor="pdfUpload"
          className={`text-xl px-6 py-2 rounded shadow transition cursor-pointer
            ${uploadDisabled
              ? 'bg-gray-400 text-white cursor-not-allowed'
              : 'bg-indigo-600 text-white hover:bg-blue-500'
            }`}
          style={uploadDisabled ? { pointerEvents: 'none' } : {}}
        >
          {uploadPdfMsg}
        </label>
      </div>

      {files.length > 0 && (
        <div className="mt-6 flex flex-col items-center">
          <h3 className="text-2xl font-semibold mb-4">Choose an Operation</h3>
          <div className='flex justify-between'>
            <button
              className="mx-3 text-xl bg-teal-500 text-white px-6 py-2 rounded shadow hover:bg-teal-700 transition mb-4"
              onClick={handleMergePdfs}
            >
              Merge PDFs
            </button>
            <button
              className="mx-3 text-xl bg-teal-500 text-white px-6 py-2 rounded shadow hover:bg-teal-700 transition mb-4"
              onClick={handleConvertToImages}
            >
              Convert to Images
            </button>
          </div>
        </div>
      )}

      {images.length > 0 && (
        <div className="mt-8 w-full flex flex-col items-center">
          <h4 className="text-xl font-semibold mb-2">Download Images</h4>
          <div className="flex flex-wrap gap-4">
            {images.map((src, idx) => (
              <div key={idx} className="flex flex-col items-center">
                <img src={src} alt={`PDF Page ${idx + 1}`} className="w-32 h-auto border mb-2" />
                <button
                  className="bg-blue-600 text-white px-3 py-1 rounded"
                  onClick={() => handleDownloadImage(src, idx)}
                >
                  Download
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
