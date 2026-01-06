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
      <div className="flex flex-col justify-center items-center min-h-[50vh] gap-4">
        <div className="loader"></div>
        <p className="text-gray-400 font-bold text-xs uppercase tracking-widest">Loading history...</p>
      </div>
    );
  }

  return (
    <div className="w-full max-w-5xl mx-auto py-16 px-6">
      <div className="flex flex-col items-center text-center mb-16">
         <h2 className="text-4xl sm:text-5xl font-black text-brand-dark mb-4 tracking-tighter">Your Discoveries</h2>
         <p className="text-gray-500 font-medium">A timeline of your culinary exploration.</p>
      </div>
      
      {error && (
        <div className="bg-red-50 border border-red-100 text-red-900 p-6 rounded-3xl shadow-sm animate-fade-in mb-12 flex items-center gap-4">
          <span className="text-xl">⚠️</span>
          <p className="font-bold">{error}</p>
        </div>
      )}

      {history.length === 0 && !loading ? (
        <div className="bg-gray-50 rounded-[40px] p-20 text-center border border-gray-100">
           <div className="text-5xl mb-6">🍽️</div>
           <p className="text-brand-dark font-black text-xl mb-2 tracking-tight">Your table is empty</p>
           <p className="text-gray-400 font-medium mb-8">Start by recognizing some delicious dishes!</p>
           <button onClick={() => window.location.href='/'} className="bg-brand-orange text-white px-8 py-3 rounded-2xl font-bold shadow-xl shadow-brand-orange/20 hover:-translate-y-1 transition-all">Go to Analyzer</button>
        </div>
      ) : (
        <div className="grid gap-8">
          {history.map((item, index) => (
            <motion.div
              key={item.recognitionId}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.05 }}
              whileHover={{ y: -4 }}
              className="glass-card p-6 md:p-8 rounded-[32px] flex flex-col md:flex-row gap-8 items-center group transition-all"
            >
              {item.imageUrl && (
                <div className="relative w-full md:w-48 aspect-square flex-shrink-0">
                  <div className="absolute -inset-2 bg-brand-orange/5 blur-xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  <Image
                    src={item.imageUrl}
                    alt={item.foodName}
                    fill
                    className="rounded-3xl object-cover shadow-lg border-4 border-white relative z-10"
                  />
                </div>
              )}
              <div className="flex-grow text-center md:text-left">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
                   <div>
                      <h3 className="text-2xl font-black text-brand-dark tracking-tighter group-hover:text-brand-orange transition-colors">{item.foodName}</h3>
                      <p className="text-xs font-black text-gray-400 uppercase tracking-widest mt-1">
                        {new Date(item.createdAt).toLocaleDateString([], { month: 'long', day: 'numeric', year: 'numeric' })} • {new Date(item.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </p>
                   </div>
                  <span className={`text-[10px] font-black uppercase tracking-widest px-4 py-2 rounded-xl ${
                    item.confidence === 'high' ? 'bg-green-50 text-brand-green border border-green-100' :
                    item.confidence === 'medium' ? 'bg-orange-50 text-brand-orange border border-orange-100' :
                    'bg-red-50 text-red-600 border border-red-100'
                  }`}>
                    {item.confidence} Match
                  </span>
                </div>
                <p className="text-gray-500 font-medium line-clamp-2 mb-6 leading-relaxed">"{item.description}"</p>
                <div className="flex justify-center md:justify-start">
                   <button className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-brand-dark group-hover:gap-3 transition-all">
                      View Details <span>→</span>
                   </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};


export default HistoryPage;
