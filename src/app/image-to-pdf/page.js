'use client';

import { useState, useRef, useCallback } from 'react';
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { PDFDocument } from 'pdf-lib';

// Draggable image card component
function DraggableImage({ imgObj, index, moveImage }) {
  const ref = useRef(null);
  const [, drop] = useDrop({
    accept: 'image',
    hover(item) {
      if (item.index === index) return;
      moveImage(item.index, index);
      item.index = index;
    },
  });
  const [{ isDragging }, drag] = useDrag({
    type: 'image',
    item: { index },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });
  drag(drop(ref));
  return (
    <div
      ref={ref}
      className={`flex flex-col items-center mx-2 ${isDragging ? 'opacity-50' : ''}`}
      style={{ cursor: 'move' }}
    >
      <img src={imgObj.url} alt={`img-${index}`} className="w-24 h-24 object-cover border mb-2" />
      <span className="text-xs">{index + 1}</span>
    </div>
  );
}

export default function ImageToPdfPage() {
  const [imgFiles, setImgFiles] = useState([]);
  const [imgPdfMsg, setImgPdfMsg] = useState('Upload Images');
  const inputRef = useRef(null);

  const openFilePicker = () => {
    if (inputRef.current) {
      inputRef.current.value = ''; // Always clear before open
      inputRef.current.click();
    }
  };

  const handleImgUpload = (e) => {
    const files = e.target.files;
    if (!files || !files.length) {
      console.log('No files selected');
      return;
    }
  
    const selectedFiles = Array.from(files);
    const imgObjs = selectedFiles.map((file, idx) => ({
      id: `${file.name}-${idx}-${Date.now()}`,
      file,
      url: URL.createObjectURL(file),
    }));
  
    setImgFiles(imgObjs);
    setImgPdfMsg('Images uploaded! Drag to reorder, then create PDF.');
  
    // ❌ Do NOT reset e.target.value on mobile. Causes gallery bugs.
    // e.target.value = '';  // REMOVE THIS LINE
  };
  
  

  const moveImage = useCallback((from, to) => {
    setImgFiles((prev) => {
      const updated = [...prev];
      const [moved] = updated.splice(from, 1);
      updated.splice(to, 0, moved);
      return updated;
    });
  }, []);

  const handleImagesToPdf = async () => {
    if (!imgFiles.length) return;
    const pdfDoc = await PDFDocument.create();
    for (const imgObj of imgFiles) {
      const imgBytes = await imgObj.file.arrayBuffer();
      let img;
      if (imgObj.file.type === 'image/jpeg' || imgObj.file.type === 'image/jpg') {
        img = await pdfDoc.embedJpg(imgBytes);
      } else {
        img = await pdfDoc.embedPng(imgBytes);
      }
      const page = pdfDoc.addPage([img.width, img.height]);
      page.drawImage(img, { x: 0, y: 0, width: img.width, height: img.height });
    }
    const pdfBytes = await pdfDoc.save();
    const blob = new Blob([pdfBytes], { type: 'application/pdf' });
    const url = URL.createObjectURL(blob);

    // Download
    const link = document.createElement('a');
    link.href = url;
    link.download = 'images.pdf';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="flex flex-col items-center justify-center h-full">
        <h2 className="text-4xl font-semibold mb-6">Image to PDF</h2>
        <div className="flex gap-4 mb-7">
        <input
  ref={inputRef}
  type="file"
  accept="image/*"
  multiple
  onChange={handleImgUpload}
  className="hidden"
  id="imgUpload"
/>

          <button
            type="button"
            onClick={openFilePicker}
            className="text-xl bg-indigo-600 text-white px-6 py-2 rounded shadow hover:bg-blue-500 transition cursor-pointer"
          >
            {imgPdfMsg}
          </button>
        </div>

        {imgFiles.length > 0 && (
          <>
            <div className="flex flex-wrap gap-2 mb-6">
              {imgFiles.map((imgObj, idx) => (
                <DraggableImage key={imgObj.id} imgObj={imgObj} index={idx} moveImage={moveImage} />
              ))}
            </div>
            <button
              className="text-xl bg-teal-500 text-white px-6 py-2 rounded shadow hover:bg-teal-700 transition"
              onClick={handleImagesToPdf}
            >
              Create PDF
            </button>
          </>
        )}
      </div>
    </DndProvider>
  );
}
