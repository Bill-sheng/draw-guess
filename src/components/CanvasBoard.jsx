import { useRef, useEffect, useState } from 'react';

export default function CanvasBoard({ color = '#000', lineWidth = 5, tool = 'brush' }) {
    const canvasRef = useRef(null);
    const [isDrawing, setIsDrawing] = useState(false);
    const contextRef = useRef(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        // Handle high DPI displays
        const dpr = window.devicePixelRatio || 1;
        const rect = canvas.getBoundingClientRect();

        // Initial setup
        canvas.width = rect.width * dpr;
        canvas.height = rect.height * dpr;

        const ctx = canvas.getContext('2d');

        // Default styles
        ctx.scale(dpr, dpr);
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        contextRef.current = ctx;

        const handleResize = () => {
            // Simple resize handling
            const newRect = canvas.getBoundingClientRect();
            canvas.width = newRect.width * dpr;
            canvas.height = newRect.height * dpr;
            ctx.scale(dpr, dpr);
            ctx.lineCap = 'round';
            ctx.lineJoin = 'round';
            // Re-apply current tool settings
            if (tool === 'eraser') {
                ctx.globalCompositeOperation = 'destination-out';
            } else {
                ctx.globalCompositeOperation = 'source-over';
                ctx.strokeStyle = color;
            }
            ctx.lineWidth = lineWidth;
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    // Update Tool/Color/Size whenever they change
    useEffect(() => {
        const ctx = contextRef.current;
        if (!ctx) return;

        if (tool === 'eraser') {
            ctx.globalCompositeOperation = 'destination-out'; // True erasering (transparency)
        } else {
            ctx.globalCompositeOperation = 'source-over';
            ctx.strokeStyle = color;
        }
        ctx.lineWidth = lineWidth;
    }, [color, tool, lineWidth]);

    const startDrawing = ({ nativeEvent }) => {
        const { offsetX, offsetY } = nativeEvent;
        contextRef.current.beginPath();
        contextRef.current.moveTo(offsetX, offsetY);
        setIsDrawing(true);
    };

    const finishDrawing = () => {
        contextRef.current.closePath();
        setIsDrawing(false);
    };

    const draw = ({ nativeEvent }) => {
        if (!isDrawing) return;
        const { offsetX, offsetY } = nativeEvent;
        contextRef.current.lineTo(offsetX, offsetY);
        contextRef.current.stroke();
    };

    return (
        <canvas
            ref={canvasRef}
            onMouseDown={startDrawing}
            onMouseUp={finishDrawing}
            onMouseLeave={finishDrawing}
            onMouseMove={draw}
            className="w-full h-full touch-none cursor-crosshair"
            style={{ display: 'block' }}
        />
    );
}
