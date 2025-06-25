import React, { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { motion } from 'framer-motion';
import Loader from './Loader';

const PhotoDropzone: React.FC<{ onDrop: (file: File) => void; loading: boolean }> = ({ onDrop, loading }) => {
  const onDropCallback = useCallback(
    (acceptedFiles: File[]) => {
      if (acceptedFiles[0]) onDrop(acceptedFiles[0]);
    },
    [onDrop]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: onDropCallback,
    accept: { 'image/*': [] },
    maxFiles: 1,
  });

  return (
    <motion.div
      {...getRootProps({ onAnimationStart: undefined })}
      className={`w-80 h-40 rounded-2xl border-4 border-dashed flex flex-col items-center justify-center cursor-pointer glassmorphism mb-6 transition-all ${
        isDragActive ? "border-green-400 shadow-lg" : "border-orange-300"
      }`}
      animate={{
        scale: isDragActive ? 1.05 : [1, 1.03, 1],
        boxShadow: isDragActive
          ? "0 0 24px 4px #34d39955"
          : "0 0 12px 2px #fb923c33",
      }}
      transition={{ repeat: Infinity, duration: 2, repeatType: "reverse" }}
    >
      <input {...getInputProps()} />
      {loading ? (
        <Loader />
      ) : (
        <span className="text-orange-700 font-semibold text-lg">
          {isDragActive
            ? "Drop your food photo!"
            : "Drag & drop or click to upload"}
        </span>
      )}
      <span className="text-xs text-gray-500 mt-2">JPG, PNG, max 5MB</span>
    </motion.div>
  );
};

export default PhotoDropzone;