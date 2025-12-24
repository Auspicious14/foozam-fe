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
      className={`w-full max-w-lg h-48 rounded-2xl border-4 border-dashed flex flex-col items-center justify-center cursor-pointer glassmorphism mb-8 transition-all ${
        isDragActive ? "border-green-400 shadow-lg" : "border-orange-300"
      }`}
      whileHover={{ scale: 1.02 }}
      animate={{
        scale: isDragActive ? 1.05 : 1,
        boxShadow: isDragActive
          ? "0 0 32px 8px #34d39966"
          : "0 0 16px 4px #fb923c22",
      }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
    >
      <input {...getInputProps()} />
      {loading ? (
        <Loader />
      ) : (
        <>
          <span className="text-orange-700 font-semibold text-xl">
            {isDragActive
              ? "Drop your food photo here!"
              : "Drag & drop or click to upload"}
          </span>
          <span className="text-sm text-gray-500 mt-2">
            Upload a clear image of a Nigerian dish
          </span>
        </>
      )}
    </motion.div>
  );
};

export default PhotoDropzone;
