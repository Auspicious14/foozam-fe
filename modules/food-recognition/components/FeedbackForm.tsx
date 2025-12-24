import React, { useState } from 'react';
import { motion } from 'framer-motion';

interface Props {
  onSubmit: (correctName: string, correctOrigin: string) => Promise<void>;
  initialFoodName: string;
}

const FeedbackForm: React.FC<Props> = ({ onSubmit, initialFoodName }) => {
  const [correctName, setCorrectName] = useState(initialFoodName);
  const [correctOrigin, setCorrectOrigin] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await onSubmit(correctName, correctOrigin);
      setIsSubmitted(true);
    } catch (error) {
      console.error('Feedback submission failed:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSubmitted) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="bg-green-100 text-green-700 p-4 rounded-xl text-center font-semibold mt-6"
      >
        Thank you for your feedback! It helps us improve.
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glassmorphism p-6 rounded-2xl shadow-lg mt-8 w-full max-w-2xl"
    >
      <h3 className="text-xl font-bold text-orange-700 mb-4 text-center">Is this correct?</h3>
      <p className="text-gray-600 mb-6 text-center text-sm">
        If we got it wrong, please let us know the correct details.
      </p>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">Correct Food Name</label>
          <input
            type="text"
            value={correctName}
            onChange={(e) => setCorrectName(e.target.value)}
            className="w-full p-3 rounded-lg border border-orange-200 focus:outline-none focus:ring-2 focus:ring-orange-500"
            placeholder="e.g. Jollof Rice"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">Origin/Region (optional)</label>
          <input
            type="text"
            value={correctOrigin}
            onChange={(e) => setCorrectOrigin(e.target.value)}
            className="w-full p-3 rounded-lg border border-orange-200 focus:outline-none focus:ring-2 focus:ring-orange-500"
            placeholder="e.g. West Africa"
          />
        </div>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          type="submit"
          disabled={isSubmitting}
          className="w-full py-3 bg-orange-600 text-white rounded-lg font-bold shadow-md hover:bg-orange-700 transition-colors disabled:opacity-50"
        >
          {isSubmitting ? 'Submitting...' : 'Submit Feedback'}
        </motion.button>
      </form>
    </motion.div>
  );
};

export default FeedbackForm;
