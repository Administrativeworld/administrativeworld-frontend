import React, { useEffect, useRef, useState } from 'react';

// Note: In a real React app, you would import these:
// In your real app, use these imports:
import { jsPDF } from 'jspdf';
import * as pdfjsLib from 'pdfjs-dist';
import axios from 'axios';
import { useLocation } from 'react-router-dom';

// Set up PDF.js worker with correct version
pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js`;
let renderTask = null;
const PdfCanvasEditor = () => {
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const encodedUrl = params.get('url');
  const answerId = params.get('answerId');
  const pdfUrl = encodedUrl ? decodeURIComponent(encodedUrl) : null;
  console.log('answer id.........', answerId);
  const [pdfDoc, setPdfDoc] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [scale] = useState(1.5);
  const [tool, setTool] = useState('pen');
  const [color, setColor] = useState('#000000');
  const [loading, setLoading] = useState(false);
  const [isDrawing, setIsDrawing] = useState(false);
  const [error, setError] = useState(null);

  // Store drawings for each page
  const [pageDrawings, setPageDrawings] = useState({});

  const canvasRef = useRef(null);
  const overlayRef = useRef(null);
  const currentPath = useRef([]);

  useEffect(() => {
    const loadPdf = async () => {
      if (!pdfUrl) {
        setError('No PDF URL provided');
        return;
      }

      try {
        setError(null);
        setLoading(true);
        console.log('Loading PDF from:', pdfUrl);

        // Add loading task with proper error handling
        const loadingTask = pdfjsLib.getDocument({
          url: pdfUrl,
          // Add these options to help with CORS and loading issues
          cMapUrl:
            'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/cmaps/',
          cMapPacked: true,
          enableXfa: true,
        });

        // Handle loading progress
        loadingTask.onProgress = (progress) => {
          console.log('Loading progress:', progress);
        };

        const pdf = await loadingTask.promise;
        console.log('PDF loaded successfully, pages:', pdf.numPages);

        setPdfDoc(pdf);
        await renderPage(pdf, currentPage);
      } catch (error) {
        console.error('Error loading PDF:', error);
        let errorMessage = 'Error loading PDF';

        if (error.name === 'InvalidPDFException') {
          errorMessage = 'Invalid PDF file';
        } else if (error.name === 'MissingPDFException') {
          errorMessage = 'PDF file not found';
        } else if (error.name === 'UnexpectedResponseException') {
          errorMessage = 'Network error - check PDF URL and CORS settings';
        } else {
          errorMessage = `Error loading PDF: ${error.message}`;
        }

        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    loadPdf();
  }, [pdfUrl]);

  const renderPage = async (pdf, pageNumber) => {
    if (!pdf) return;

    try {
      console.log('Rendering page:', pageNumber);

      const page = await pdf.getPage(pageNumber);
      const viewport = page.getViewport({ scale });

      const canvas = canvasRef.current;
      const overlay = overlayRef.current;

      if (!canvas || !overlay) return;

      const context = canvas.getContext('2d');

      // Set canvas dimensions
      canvas.width = viewport.width;
      canvas.height = viewport.height;
      canvas.style.width = `${viewport.width}px`;
      canvas.style.height = `${viewport.height}px`;

      // Cancel previous render task if running
      if (renderTask?.cancel) {
        console.log('Cancelling previous render task...');
        renderTask.cancel();
      }

      // Start new render task
      const renderContext = { canvasContext: context, viewport };
      renderTask = page.render(renderContext);

      await renderTask.promise;
      console.log('PDF page rendered successfully');

      // Setup overlay canvas
      overlay.width = canvas.width;
      overlay.height = canvas.height;
      overlay.style.width = canvas.style.width;
      overlay.style.height = canvas.style.height;

      const overlayCtx = overlay.getContext('2d');
      overlayCtx.clearRect(0, 0, overlay.width, overlay.height);

      if (pageDrawings[pageNumber]) {
        redrawPageDrawings(pageNumber);
      }
    } catch (error) {
      if (error?.name === 'RenderingCancelledException') {
        console.log('Rendering cancelled, skipping error.');
        return;
      }
      console.error('Error rendering page:', error);
      setError(`Error rendering page: ${error.message}`);
    }
  };

  const redrawPageDrawings = (pageNumber) => {
    const overlay = overlayRef.current;
    if (!overlay) return;

    const ctx = overlay.getContext('2d');
    const drawings = pageDrawings[pageNumber];

    if (!drawings || drawings.length === 0) return;

    drawings.forEach((drawing) => {
      ctx.strokeStyle = drawing.color;
      ctx.lineWidth = drawing.lineWidth;
      ctx.lineCap = 'round';
      ctx.globalAlpha = drawing.alpha;

      if (drawing.tool === 'eraser') {
        ctx.globalCompositeOperation = 'destination-out';
      } else {
        ctx.globalCompositeOperation = 'source-over';
      }

      ctx.beginPath();
      drawing.points.forEach((point, index) => {
        if (index === 0) {
          ctx.moveTo(point.x, point.y);
        } else {
          ctx.lineTo(point.x, point.y);
        }
      });
      ctx.stroke();
    });

    // Reset composite operation
    ctx.globalCompositeOperation = 'source-over';
    ctx.globalAlpha = 1;
  };

  const saveCurrentDrawing = () => {
    if (currentPath.current.length === 0) return;

    const drawingData = {
      tool,
      color,
      lineWidth: tool === 'pen' ? 2 : tool === 'highlighter' ? 8 : 20,
      alpha: tool === 'highlighter' ? 0.4 : 1,
      points: [...currentPath.current],
    };

    setPageDrawings((prev) => ({
      ...prev,
      [currentPage]: [...(prev[currentPage] || []), drawingData],
    }));

    currentPath.current = [];
  };

  const getMousePos = (e) => {
    const overlay = overlayRef.current;
    if (!overlay) return { x: 0, y: 0 };

    const rect = overlay.getBoundingClientRect();

    // Calculate position accounting for canvas scaling
    const scaleX = overlay.width / rect.width;
    const scaleY = overlay.height / rect.height;

    return {
      x: (e.clientX - rect.left) * scaleX,
      y: (e.clientY - rect.top) * scaleY,
    };
  };

  const handleMouseDown = (e) => {
    e.preventDefault();
    setIsDrawing(true);
    const pos = getMousePos(e);
    currentPath.current = [pos];

    const overlay = overlayRef.current;
    if (!overlay) return;

    const ctx = overlay.getContext('2d');
    ctx.strokeStyle = color;
    ctx.lineWidth = tool === 'pen' ? 2 : tool === 'highlighter' ? 8 : 20;
    ctx.lineCap = 'round';
    ctx.globalAlpha = tool === 'highlighter' ? 0.4 : 1;

    if (tool === 'eraser') {
      ctx.globalCompositeOperation = 'destination-out';
    } else {
      ctx.globalCompositeOperation = 'source-over';
    }

    ctx.beginPath();
    ctx.moveTo(pos.x, pos.y);
  };

  const handleMouseMove = (e) => {
    if (!isDrawing) return;

    e.preventDefault();
    const pos = getMousePos(e);
    currentPath.current.push(pos);

    const overlay = overlayRef.current;
    if (!overlay) return;

    const ctx = overlay.getContext('2d');
    ctx.lineTo(pos.x, pos.y);
    ctx.stroke();
  };

  const handleMouseUp = (e) => {
    if (!isDrawing) return;

    e.preventDefault();
    setIsDrawing(false);
    saveCurrentDrawing();

    const overlay = overlayRef.current;
    if (!overlay) return;

    const ctx = overlay.getContext('2d');
    ctx.globalCompositeOperation = 'source-over';
    ctx.globalAlpha = 1;
  };

  const clearCurrentPage = () => {
    const overlay = overlayRef.current;
    if (!overlay) return;

    // Clear the overlay canvas
    const ctx = overlay.getContext('2d');
    ctx.clearRect(0, 0, overlay.width, overlay.height);

    // Remove drawings for current page
    setPageDrawings((prev) => ({
      ...prev,
      [currentPage]: [],
    }));
  };

  const goToPage = (delta) => {
    if (!pdfDoc) return;

    const nextPage = currentPage + delta;
    if (nextPage >= 1 && nextPage <= pdfDoc.numPages) {
      setCurrentPage(nextPage);
      renderPage(pdfDoc, nextPage);
    }
  };

  const uploadToCloudinary = async () => {
    if (!pdfDoc) {
      alert('No PDF loaded');
      return;
    }

    // Check if required dependencies are available
    if (typeof jsPDF === 'undefined' || typeof axios === 'undefined') {
      alert(
        'Required libraries (jsPDF, axios) are not loaded. This is a demo environment.'
      );
      return;
    }

    setLoading(true);
    try {
      // Create new PDF with drawings
      const pdf = new jsPDF();

      for (let i = 1; i <= pdfDoc.numPages; i++) {
        const page = await pdfDoc.getPage(i);
        const viewport = page.getViewport({ scale });

        // Create background canvas for PDF page
        const bgCanvas = document.createElement('canvas');
        bgCanvas.width = viewport.width;
        bgCanvas.height = viewport.height;
        const bgCtx = bgCanvas.getContext('2d');

        await page.render({
          canvasContext: bgCtx,
          viewport,
        }).promise;

        // Create combined canvas
        const combinedCanvas = document.createElement('canvas');
        combinedCanvas.width = bgCanvas.width;
        combinedCanvas.height = bgCanvas.height;
        const combinedCtx = combinedCanvas.getContext('2d');

        // Draw PDF page
        combinedCtx.drawImage(bgCanvas, 0, 0);

        // Draw annotations for this page
        // Draw annotations for this page (with reduced drawing quality)
        // Draw annotations for this page (with reduced drawing quality)
        if (pageDrawings[i] && pageDrawings[i].length > 0) {
          pageDrawings[i].forEach((drawing) => {
            combinedCtx.strokeStyle = drawing.color;

            // 🔥 Aggressively reduce line width (half)
            combinedCtx.lineWidth = drawing.lineWidth * 0.5;

            combinedCtx.lineCap = 'round';

            // 🔥 Reduce opacity to compress drawing visual weight
            combinedCtx.globalAlpha = drawing.alpha * 0.7;

            if (drawing.tool === 'eraser') {
              combinedCtx.globalCompositeOperation = 'destination-out';
            } else {
              combinedCtx.globalCompositeOperation = 'source-over';
            }

            combinedCtx.beginPath();

            // 🔥 Skip every 3rd point to simplify the path
            drawing.points.forEach((point, index) => {
              // Skip every 3rd point to reduce complexity
              if (
                index % 3 !== 0 &&
                index !== 0 &&
                index !== drawing.points.length - 1
              )
                return;

              if (index === 0) {
                combinedCtx.moveTo(point.x, point.y);
              } else {
                combinedCtx.lineTo(point.x, point.y);
              }
            });

            combinedCtx.stroke();
          });
        }

        // Add to PDF
        const imgData = combinedCanvas.toDataURL('image/png');
        const pageWidth = pdf.internal.pageSize.getWidth();
        const pageHeight = (viewport.height / viewport.width) * pageWidth;

        if (i > 1) pdf.addPage();
        pdf.addImage(imgData, 'PNG', 0, 0, pageWidth, pageHeight);
      }

      // Convert PDF to blob with compression
      const pdfBlob = new Blob([pdf.output('arraybuffer')], {
        type: 'application/pdf',
      });
      const extractPublicId = (url) => {
        const matches = url.match(/upload\/(?:v\d+\/)?([^\.]+)/);
        return matches ? matches[1] : null;
      };
      const publicId = extractPublicId(encodedUrl);
      // Check file size and compress if needed
      const maxSize = 10 * 1024 * 1024; // 10MB limit for Cloudinary free plan
      let finalBlob = pdfBlob;

      if (pdfBlob.size > maxSize) {
        console.log(
          `Original PDF size: ${(pdfBlob.size / (1024 * 1024)).toFixed(2)}MB`
        );

        const compressedPdf = new jsPDF();

        // 🔥 Minimal scaling, focus on image quality
        const compressionScale = Math.sqrt(maxSize / pdfBlob.size) * 0.98; // Almost full scale
        const imageQuality = 0.85; // High image quality

        for (let i = 1; i <= pdfDoc.numPages; i++) {
          const page = await pdfDoc.getPage(i);
          const viewport = page.getViewport({
            scale: scale * compressionScale,
          });

          // Create background canvas for PDF page
          const bgCanvas = document.createElement('canvas');
          bgCanvas.width = viewport.width;
          bgCanvas.height = viewport.height;
          const bgCtx = bgCanvas.getContext('2d');

          await page.render({
            canvasContext: bgCtx,
            viewport,
          }).promise;

          // Create combined canvas
          const combinedCanvas = document.createElement('canvas');
          combinedCanvas.width = bgCanvas.width;
          combinedCanvas.height = bgCanvas.height;
          const combinedCtx = combinedCanvas.getContext('2d');

          // Draw PDF page
          combinedCtx.drawImage(bgCanvas, 0, 0);

          // Draw annotations for this page (scaled)
          if (pageDrawings[i] && pageDrawings[i].length > 0) {
            pageDrawings[i].forEach((drawing) => {
              combinedCtx.strokeStyle = drawing.color;
              combinedCtx.lineWidth = drawing.lineWidth * compressionScale;
              combinedCtx.lineCap = 'round';
              combinedCtx.globalAlpha = drawing.alpha;

              if (drawing.tool === 'eraser') {
                combinedCtx.globalCompositeOperation = 'destination-out';
              } else {
                combinedCtx.globalCompositeOperation = 'source-over';
              }

              combinedCtx.beginPath();
              drawing.points.forEach((point, index) => {
                const scaledX = point.x * compressionScale;
                const scaledY = point.y * compressionScale;
                if (index === 0) {
                  combinedCtx.moveTo(scaledX, scaledY);
                } else {
                  combinedCtx.lineTo(scaledX, scaledY);
                }
              });
              combinedCtx.stroke();
            });
          }

          // Add to compressed PDF with high quality JPEG
          const imgData = combinedCanvas.toDataURL('image/jpeg', imageQuality);
          const pageWidth = compressedPdf.internal.pageSize.getWidth();
          const pageHeight = (viewport.height / viewport.width) * pageWidth;

          if (i > 1) compressedPdf.addPage();
          compressedPdf.addImage(imgData, 'JPEG', 0, 0, pageWidth, pageHeight);
        }

        finalBlob = new Blob([compressedPdf.output('arraybuffer')], {
          type: 'application/pdf',
        });

        console.log(
          `Compressed PDF size: ${(finalBlob.size / (1024 * 1024)).toFixed(2)}MB`
        );

        // If still too large, show error
        if (finalBlob.size > maxSize) {
          throw new Error(
            `PDF still too large after compression: ${(finalBlob.size / (1024 * 1024)).toFixed(2)}MB. Please reduce the number of pages or annotations.`
          );
        }

        alert(
          `PDF compressed from ${(pdfBlob.size / (1024 * 1024)).toFixed(2)}MB to ${(finalBlob.size / (1024 * 1024)).toFixed(2)}MB`
        );
      }

      // Upload to Cloudinary
      const uploadPreset = 'answers_attachments';
      const resourceType = 'raw'; // For PDFs

      // Get signature from backend

      // Create a File object with proper filename and extension
      const pdfFile = new File([finalBlob], `annotated_pdf_${Date.now()}.pdf`, {
        type: 'application/pdf',
      });

      const sigRes = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/generate/generateSignatureOverwrite`,
        {
          uploadPreset,
          publicId,
          overwrite: true,
          resourceType,
        },
        { headers: { 'Content-Type': 'application/json' } }
      );

      const { signature, timestamp } = sigRes.data;

      const formData = new FormData();
      formData.append('file', pdfFile);
      formData.append('api_key', import.meta.env.VITE_CLOUDINARY_API_KEY);
      formData.append('upload_preset', uploadPreset);
      formData.append('timestamp', timestamp);
      formData.append('signature', signature);
      formData.append('public_id', publicId);
      formData.append('overwrite', 'true');
      // Removed public_id to match your working handleFileUpload function
      // Removed the incorrect formData.append line

      // Upload to Cloudinary - Fixed URL construction
      const cloudinaryUrl = `https://api.cloudinary.com/v1_1/${import.meta.env.VITE_CLOUDINARY_CLOUD_NAME}/${resourceType}/upload`;

      const uploadRes = await fetch(cloudinaryUrl, {
        method: 'POST',
        body: formData,
      });

      console.log('cloudinary res data.......', uploadRes);

      if (!uploadRes.ok) {
        const errorText = await uploadRes.text();
        console.error('Upload error response:', errorText);
        throw new Error(
          `Upload failed: ${uploadRes.statusText} - ${errorText}`
        );
      }

      const uploadData = await uploadRes.json();
      const newUrl = uploadData.secure_url;

      await axios.put(
        `${import.meta.env.VITE_BASE_URL}/exercise/updateUserAnswerAttachment/${answerId}`,
        {
          attachmentUrl: newUrl,
          format: 'pdf',
          bytes: uploadRes.bytes,
          resource_type: uploadRes.resource_type,
        },
        {
          headers: { 'Content-Type': 'application/json' },
          withCredentials: true,
        }
      );

      alert('✅ PDF uploaded successfully!\n' + newUrl);

      // Copy URL to clipboard
      if (navigator.clipboard) {
        await navigator.clipboard.writeText(newUrl);
        alert('URL copied to clipboard!');
      }
    } catch (error) {
      setLoading(false);
      console.error('❌ Upload error:', error);
      alert('❌ Upload failed: ' + (error.message || 'Unknown error'));
    } finally {
      setLoading(false);
    }
  };

  // Loading state
  if (loading && !pdfDoc) {
    return (
      <div className="p-4 min-h-screen bg-gray-900 text-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
          <p>Loading PDF...</p>
          {pdfUrl && (
            <p className="text-sm text-gray-400 mt-2">From: {pdfUrl}</p>
          )}
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="p-4 min-h-screen bg-gray-900 text-white flex items-center justify-center">
        <div className="text-center text-red-400">
          <p className="text-xl mb-4">❌ Error</p>
          <p className="mb-4">{error}</p>
          {pdfUrl && (
            <p className="text-sm text-gray-400 mb-4">URL: {pdfUrl}</p>
          )}
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  // No PDF URL
  if (!pdfUrl) {
    return (
      <div className="p-4 min-h-screen bg-gray-900 text-white flex items-center justify-center">
        <div className="text-center">
          <p className="text-xl mb-4">No PDF URL provided</p>
          <p className="text-gray-400">
            Please provide a PDF URL in the query parameters.
          </p>
          <p className="text-sm text-gray-500 mt-2">
            Example: ?url=https%3A%2F%2Fexample.com%2Fsample.pdf
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 min-h-screen bg-gray-900 text-white">
      <div className="mb-4 flex flex-wrap items-center gap-2 bg-gray-800 p-3 rounded-lg">
        <button
          onClick={() => setTool('pen')}
          className={`px-3 py-2 rounded transition-colors ${
            tool === 'pen'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-600 hover:bg-gray-500'
          }`}
        >
          🖋 Pen
        </button>
        <button
          onClick={() => setTool('highlighter')}
          className={`px-3 py-2 rounded transition-colors ${
            tool === 'highlighter'
              ? 'bg-yellow-600 text-white'
              : 'bg-gray-600 hover:bg-gray-500'
          }`}
        >
          🖍 Highlighter
        </button>
        <button
          onClick={() => setTool('eraser')}
          className={`px-3 py-2 rounded transition-colors ${
            tool === 'eraser'
              ? 'bg-red-600 text-white'
              : 'bg-gray-600 hover:bg-gray-500'
          }`}
        >
          🧽 Eraser
        </button>

        <div className="flex items-center gap-2">
          <label className="text-sm">Color:</label>
          <input
            type="color"
            value={color}
            onChange={(e) => setColor(e.target.value)}
            className="w-8 h-8 rounded border-0 cursor-pointer"
          />
        </div>

        <button
          onClick={clearCurrentPage}
          className="px-3 py-2 bg-blue-600 hover:bg-blue-700 rounded transition-colors"
        >
          Clear Page
        </button>

        <button
          onClick={uploadToCloudinary}
          disabled={loading}
          className="px-4 py-2 bg-green-600 hover:bg-green-700 disabled:bg-gray-600 rounded transition-colors flex items-center gap-2"
        >
          {loading ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              Uploading...
            </>
          ) : (
            '📤 Upload PDF'
          )}
        </button>

        <div className="flex items-center gap-2 ml-4">
          <button
            onClick={() => goToPage(-1)}
            disabled={currentPage <= 1}
            className="px-3 py-2 bg-gray-600 hover:bg-gray-500 disabled:bg-gray-700 rounded transition-colors"
          >
            ⬅ Prev
          </button>
          <span className="px-3 py-2 bg-gray-700 rounded text-sm">
            Page {currentPage} / {pdfDoc?.numPages || 0}
          </span>
          <button
            onClick={() => goToPage(1)}
            disabled={currentPage >= (pdfDoc?.numPages || 0)}
            className="px-3 py-2 bg-gray-600 hover:bg-gray-500 disabled:bg-gray-700 rounded transition-colors"
          >
            Next ➡
          </button>
        </div>
      </div>

      <div className="flex justify-center">
        <div className="relative inline-block border-2 border-gray-600 rounded-lg overflow-hidden bg-white">
          <canvas
            ref={canvasRef}
            className="block"
            style={{ display: 'block' }}
          />
          <canvas
            ref={overlayRef}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
            className="absolute top-0 left-0"
            style={{
              cursor: tool === 'eraser' ? 'grab' : 'crosshair',
              touchAction: 'none',
            }}
          />
        </div>
      </div>

      {Object.keys(pageDrawings).length > 0 && (
        <div className="mt-4 p-3 bg-gray-800 rounded-lg">
          <h3 className="text-sm font-medium mb-2">Pages with annotations:</h3>
          <div className="flex flex-wrap gap-2">
            {Object.keys(pageDrawings).map(
              (page) =>
                pageDrawings[page].length > 0 && (
                  <span
                    key={page}
                    className="px-2 py-1 bg-blue-600 text-white text-xs rounded"
                  >
                    Page {page}
                  </span>
                )
            )}
          </div>
        </div>
      )}

      <div className="mt-4 p-3 bg-gray-800 rounded-lg text-sm">
        <p className="text-blue-400 mb-2">📋 Debug Info:</p>
        <p>PDF URL: {pdfUrl}</p>
        <p>
          Current Page: {currentPage} / {pdfDoc?.numPages || 0}
        </p>
        <p>
          Canvas Elements: {canvasRef.current ? '✅' : '❌'} PDF,{' '}
          {overlayRef.current ? '✅' : '❌'} Overlay
        </p>
      </div>
    </div>
  );
};

export default PdfCanvasEditor;
