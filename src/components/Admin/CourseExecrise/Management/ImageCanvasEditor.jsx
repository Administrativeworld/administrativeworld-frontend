import React, { useEffect, useRef, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { Paintbrush, Trash2, UploadCloud } from 'lucide-react';
import axios from 'axios';

function CanvasEditor() {
  const [searchParams] = useSearchParams();
  const imageUrl = searchParams.get('url');
  const answerId = searchParams.get('answerId');
  const bgCanvasRef = useRef(null);
  const drawCanvasRef = useRef(null);
  const imageRef = useRef(new Image());

  const [isDrawing, setIsDrawing] = useState(false);
  const [color, setColor] = useState('#000000');
  const [lineWidth, setLineWidth] = useState(3);
  const [lastPos, setLastPos] = useState(null);
  const [tool, setTool] = useState('pen');
  const [zoom, setZoom] = useState(1);
  const [isShift, setIsShift] = useState(false);
  const [loading, setLoading] = useState(false);

  const zoomStep = 0.1;
  const MIN_ZOOM = 0.2;
  const MAX_ZOOM = 3;

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Shift') setIsShift(true);
    };
    const handleKeyUp = (e) => {
      if (e.key === 'Shift') setIsShift(false);
    };
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  useEffect(() => {
    const bgCanvas = bgCanvasRef.current;
    const drawCanvas = drawCanvasRef.current;
    if (!bgCanvas || !drawCanvas || !imageUrl) return;

    const ctx = bgCanvas.getContext('2d');
    const img = imageRef.current;
    img.crossOrigin = 'anonymous';
    img.src = imageUrl;

    img.onload = () => {
      const dpr = window.devicePixelRatio || 1;
      bgCanvas.width = drawCanvas.width = img.width * dpr;
      bgCanvas.height = drawCanvas.height = img.height * dpr;
      bgCanvas.style.width = drawCanvas.style.width = `${img.width}px`;
      bgCanvas.style.height = drawCanvas.style.height = `${img.height}px`;
      ctx.scale(dpr, dpr);
      ctx.drawImage(img, 0, 0);
    };
  }, [imageUrl]);

  const getMousePos = (e) => {
    const canvas = drawCanvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;
    return {
      x: (e.clientX - rect.left) * (canvas.width / rect.width) / dpr,
      y: (e.clientY - rect.top) * (canvas.height / rect.height) / dpr,
    };
  };

  const startDrawing = (e) => {
    setIsDrawing(true);
    setLastPos(getMousePos(e));
  };

  const draw = (e) => {
    if (!isDrawing || !lastPos) return;
    const ctx = drawCanvasRef.current.getContext('2d');
    let pos = getMousePos(e);
    if (isShift) pos.y = lastPos.y;

    ctx.beginPath();
    ctx.moveTo(lastPos.x, lastPos.y);
    ctx.lineTo(pos.x, pos.y);

    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    if (tool === 'eraser') {
      ctx.globalCompositeOperation = 'destination-out';
      ctx.lineWidth = lineWidth * 2;
    } else {
      ctx.globalCompositeOperation = 'source-over';
      ctx.strokeStyle = color;
      ctx.lineWidth = tool === 'highlighter' ? lineWidth * 2 : lineWidth;
      ctx.globalAlpha = tool === 'highlighter' ? 0.3 : 1;
    }

    ctx.stroke();
    setLastPos(pos);
  };

  const stopDrawing = () => {
    setIsDrawing(false);
    setLastPos(null);
    const ctx = drawCanvasRef.current.getContext('2d');
    ctx.globalAlpha = 1;
    ctx.globalCompositeOperation = 'source-over';
  };

  const clearCanvas = () => {
    const canvas = drawCanvasRef.current;
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  };

  const extractPublicId = (url) => {
    const matches = url.match(/upload\/(?:v\d+\/)?([^\.]+)/);
    return matches ? matches[1] : null;
  };

  const uploadToCloudinary = () => {
  const bgCanvas = bgCanvasRef.current;
  const drawCanvas = drawCanvasRef.current;

  const combinedCanvas = document.createElement('canvas');
  combinedCanvas.width = bgCanvas.width;
  combinedCanvas.height = bgCanvas.height;

  const ctx = combinedCanvas.getContext('2d');
  ctx.drawImage(bgCanvas, 0, 0);
  ctx.drawImage(drawCanvas, 0, 0);

  combinedCanvas.toBlob(async (blob) => {
    if (!blob) {
      alert("❌ Blob creation failed.");
      return;
    }

    const publicId = extractPublicId(imageUrl);
    const uploadPreset = "answers_attachments";
    const resourceType = "image";

    setLoading(true);
    try {
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
      formData.append("file", blob);
      formData.append("api_key", import.meta.env.VITE_CLOUDINARY_API_KEY);
      formData.append("upload_preset", uploadPreset);
      formData.append("timestamp", timestamp);
      formData.append("signature", signature);
      formData.append("public_id", publicId);
      formData.append("overwrite", "true");

      // ✅ FINAL CORRECT CALL
      const uploadRes = await axios.post(
        `https://api.cloudinary.com/v1_1/${import.meta.env.VITE_CLOUDINARY_CLOUD_NAME}/${resourceType}/upload`,
        formData
      );

      const newUrl = uploadRes.data.secure_url;

      await axios.put(
        `${import.meta.env.VITE_BASE_URL}/exercise/updateUserAnswerAttachment/${answerId}`,
        {
          attachmentUrl: newUrl,
          format: uploadRes.data.format,
          bytes: uploadRes.data.bytes,
          resource_type: uploadRes.data.resource_type,
        },
        {
          headers: { 'Content-Type': 'application/json' },
          withCredentials: true,
        }
      );

      alert("✅ Image successfully saved.");
    } catch (error) {
      console.error("❌ Upload error:", error.response?.data || error);
      alert("❌ Upload failed. Check console.");
    } finally {
      setLoading(false);
    }
  }, 'image/png');
};


  return (
    <div className="min-h-screen p-6 bg-background">
      <div className="max-w-5xl mx-auto space-y-4">
        <Card>
          <CardHeader className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <CardTitle className="text-xl flex items-center gap-2">
              <Paintbrush className="h-5 w-5 text-primary" />
              Image Editor
            </CardTitle>
            <div className="flex flex-wrap gap-2 items-center">
              <Input type="color" value={color} onChange={(e) => setColor(e.target.value)} className="w-10 p-1" />
              <Slider defaultValue={[lineWidth]} max={20} step={1} className="w-32" onValueChange={([val]) => setLineWidth(val)} />
              <Button variant={tool === 'pen' ? 'default' : 'outline'} onClick={() => setTool('pen')}>✏️ Pen</Button>
              <Button variant={tool === 'highlighter' ? 'default' : 'outline'} onClick={() => setTool('highlighter')}>🖍 Highlighter</Button>
              <Button variant={tool === 'eraser' ? 'default' : 'outline'} onClick={() => setTool('eraser')}>🧽 Eraser</Button>
              <Button onClick={() => setZoom(z => Math.max(MIN_ZOOM, z - zoomStep))}>➖ Zoom Out</Button>
              <Button onClick={() => setZoom(z => Math.min(MAX_ZOOM, z + zoomStep))}>➕ Zoom In</Button>
              <Button variant="outline" onClick={clearCanvas}><Trash2 className="w-4 h-4 mr-2" />Clear</Button>
              <Button disabled={loading} onClick={uploadToCloudinary}>
                <UploadCloud className="w-4 h-4 mr-2" />
                {loading ? "Saving..." : "Save to Cloudinary"}
              </Button>
            </div>
          </CardHeader>
          <CardContent className="overflow-auto">
            <div className="relative border rounded shadow w-fit overflow-auto">
              <div style={{ transform: `scale(${zoom})`, transformOrigin: 'top left' }} className="origin-top-left inline-block">
                <canvas ref={bgCanvasRef} className="absolute top-0 left-0 z-0 pointer-events-none" />
                <canvas
                  ref={drawCanvasRef}
                  onMouseDown={startDrawing}
                  onMouseMove={draw}
                  onMouseUp={stopDrawing}
                  onMouseLeave={stopDrawing}
                  className="relative z-10 cursor-crosshair select-none"
                />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default CanvasEditor;