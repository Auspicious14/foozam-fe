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
      className={`w-full max-w-lg h-64 rounded-[32px] border-2 border-dashed flex flex-col items-center justify-center cursor-pointer glass-card transition-all duration-300 ${
        isDragActive ? "border-brand-green bg-brand-green/5 shadow-xl scale-[1.02]" : "border-gray-200 hover:border-brand-orange/50"
      }`}
      whileHover={{ y: -4 }}
      transition={{ type: 'spring', stiffness: 300, damping: 25 }}
    >
      <input {...getInputProps()} />
      {loading ? (
        <div className="flex flex-col items-center gap-4">
           <div className="loader"></div>
           <p className="text-gray-400 font-bold text-xs uppercase tracking-widest">Whipping something up...</p>
        </div>
      ) : (
        <div className="flex flex-col items-center text-center px-8">
          <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-6 transition-colors ${isDragActive ? 'bg-brand-green/20' : 'bg-gray-50'}`}>
             <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className={isDragActive ? 'text-brand-green' : 'text-brand-orange'}>
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                <polyline points="17 8 12 3 7 8" />
                <line x1="12" y1="3" x2="12" y2="15" />
             </svg>
          </div>
          <p className="text-brand-dark font-extrabold text-xl tracking-tight mb-2">
            {isDragActive ? "Drop the magic right here" : "Snap or upload a photo"}
          </p>
          <p className="text-sm text-gray-400 font-medium max-w-[200px] leading-relaxed">
            Drag photo here or click to browse files
          </p>
        </div>
      )}
    </motion.div>
  );
};


export default PhotoDropzone;
