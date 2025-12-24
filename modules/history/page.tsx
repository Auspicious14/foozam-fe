import React, { useEffect } from 'react';
import { useHistory } from './context';
import Loader from '../food-recognition/components/Loader';
import Image from 'next/image';
import { motion } from 'framer-motion';

const HistoryPage: React.FC = () => {
  const { history, loading, error, fetchHistory } = useHistory();

  useEffect(() => {
    fetchHistory();
  }, [fetchHistory]);

  if (loading && history.length === 0) {
    return (
      <div className="flex justify-center items-center min-h-[50vh]">
        <Loader />
      </div>
    );
  }

  return (
    <div className="w-full max-w-4xl mx-auto py-8 px-4">
      <h2 className="text-3xl font-bold text-orange-700 mb-8 text-center">Recognition History</h2>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-xl mb-6 text-center">
          {error}
        </div>
      )}

      {history.length === 0 && !loading ? (
        <p className="text-center text-gray-600">No history found. Start by recognizing some food!</p>
      ) : (
        <div className="grid gap-6">
          {history.map((item, index) => (
            <motion.div
              key={item.recognitionId}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="glassmorphism p-6 rounded-2xl shadow-lg flex flex-col md:flex-row gap-6 items-center"
            >
              {item.imageUrl && (
                <div className="relative w-32 h-32 flex-shrink-0">
                  <Image
                    src={item.imageUrl}
                    alt={item.foodName}
                    fill
                    className="rounded-xl object-cover"
                  />
                </div>
              )}
              <div className="flex-grow text-center md:text-left">
                <div className="flex flex-col md:flex-row md:items-center justify-between mb-2">
                  <h3 className="text-xl font-bold text-orange-600">{item.foodName}</h3>
                  <span className={`text-sm font-semibold px-3 py-1 rounded-full ${
                    item.confidence === 'high' ? 'bg-green-100 text-green-700' :
                    item.confidence === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                    'bg-red-100 text-red-700'
                  }`}>
                    {item.confidence.toUpperCase()} Confidence
                  </span>
                </div>
                <p className="text-gray-700 line-clamp-2 mb-2">{item.description}</p>
                <p className="text-xs text-gray-500">
                  {new Date(item.createdAt).toLocaleDateString()} at {new Date(item.createdAt).toLocaleTimeString()}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

export default HistoryPage;
