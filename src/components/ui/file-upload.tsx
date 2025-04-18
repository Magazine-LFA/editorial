"use client";

import React, { useRef, useState } from "react";
import { useDropzone } from "react-dropzone";

export const FileUpload = ({
  onChange,
}: {
  onChange?: (files: File[]) => void;
}) => {
  const [files, setFiles] = useState<File[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (newFiles: File[]) => {
    setFiles(newFiles);
    onChange && onChange(newFiles);
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const { getRootProps, isDragActive } = useDropzone({
    multiple: false,
    noClick: true,
    onDrop: handleFileChange,
    accept: {
      'application/pdf': ['.pdf']
    }
  });

  return (
    <div
      {...getRootProps()}
      onClick={handleClick}
      className="w-full p-4 border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-lg cursor-pointer hover:border-gray-400 dark:hover:border-gray-600 transition-colors min-h-[100px] flex flex-col items-center justify-center"
    >
      <input
        ref={fileInputRef}
        type="file"
        accept=".pdf"
        onChange={(e) => handleFileChange(Array.from(e.target.files || []))}
        className="hidden"
      />
      
      <p className="text-gray-600 dark:text-gray-400">
        {isDragActive ? "Drop the PDF here" : "Click or drag PDF to upload"}
      </p>
      
      {files.length > 0 && (
        <p className="mt-2 text-sm text-gray-700 dark:text-gray-300">
          {files[0].name}
        </p>
      )}
    </div>
  );
}; 