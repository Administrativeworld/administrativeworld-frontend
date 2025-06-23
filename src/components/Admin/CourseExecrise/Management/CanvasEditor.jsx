// CanvasEditor.jsx (Router Logic)
import React from 'react';
import { useSearchParams } from 'react-router-dom';
import ImageCanvasEditor from './ImageCanvasEditor';
import PdfCanvasEditor from './PdfCanvasEditor';

function CanvasEditor() {
  const [searchParams] = useSearchParams();
  const imageUrl = searchParams.get('url');
  const isPdf = imageUrl?.endsWith('.pdf');

  return isPdf ? <PdfCanvasEditor /> : <ImageCanvasEditor />;
}

export default CanvasEditor;
