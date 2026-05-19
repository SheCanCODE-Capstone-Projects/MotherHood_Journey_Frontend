"use client";
 
import { useRef, useState } from "react";
import { DocKey } from "@/features/service-requests/types";
import { DOC_META } from "@/features/service-requests/constants";
 
interface DropZoneProps {
  docKey: DocKey;
  onFile: (docKey: DocKey, file: File) => void;
}
 
export default function DropZone({ docKey, onFile }: DropZoneProps) {
  const meta = DOC_META[docKey];
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);
 
  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    setDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) onFile(docKey, file);
  }
 
  return (
    <div
      onDragOver={(e) => {
        e.preventDefault();
        setDragging(true);
      }}
      onDragLeave={() => setDragging(false)}
      onDrop={handleDrop}
      onClick={() => inputRef.current?.click()}
      className={`cursor-pointer rounded-xl border-2 border-dashed p-6 flex flex-col items-center justify-center text-center transition-all
        ${dragging ? "border-teal-500 bg-teal-50" : "border-teal-200 bg-teal-50/40 hover:bg-teal-50 hover:border-teal-400"}`}
    >
      <div className="text-teal-600 mb-2">{meta.icon}</div>
      <div className="font-semibold text-sm text-gray-700">{meta.label}</div>
      <div className="text-xs text-gray-400 mt-0.5">{meta.sub}</div>
      <input
        ref={inputRef}
        type="file"
        className="hidden"
        accept=".pdf,.jpg,.jpeg,.png"
        onChange={(e) => {
          if (e.target.files?.[0]) onFile(docKey, e.target.files[0]);
        }}
      />
    </div>
  );
}