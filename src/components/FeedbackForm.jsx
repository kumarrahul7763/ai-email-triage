import { useState } from 'react';

/**
 * FeedbackForm Component
 * Allows users to provide feedback on email classification results
 */
const FeedbackForm = ({ emailId, onSubmit }) => {
  const [feedback, setFeedback] = useState(null); // 'helpful' or 'not-helpful'
  const [comment, setComment] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  /**
   * Handle feedback button click
   */
  const handleFeedbackClick = (type) => {
    setFeedback(type);
  };

  /**
   * Handle form submission
   */
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!feedback) {
      return;
    }

    setIsSubmitting(true);

    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 500));

    // Store feedback (console log for now)
    const feedbackData = {
      emailId,
      feedback,
      comment: comment.trim(),
      timestamp: new Date().toISOString(),
    };

    console.log('📝 Feedback submitted:', feedbackData);

    // Call onSubmit callback if provided
    onSubmit?.(feedbackData);

    // Show success message
    setIsSubmitted(true);
    setIsSubmitting(false);
  };

  /**
   * Reset form
   */
  const handleReset = () => {
    setFeedback(null);
    setComment('');
    setIsSubmitted(false);
  };

  // Success state
  if (isSubmitted) {
    return (
      <div className="card-gradient animate-fade-in">
        <div className="text-center py-8">
          <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-emerald-100 to-green-100 rounded-full flex items-center justify-center animate-bounce-subtle">
            <svg className="w-10 h-10 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h3 className="text-2xl font-bold text-gray-800 mb-2">Thank you for your feedback!</h3>
          <p className="text-gray-500 mb-6">Your input helps us improve our classification accuracy.</p>
          <button
            onClick={handleReset}
            className="btn-secondary"
          >
            Submit Another Feedback
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="card-gradient animate-fade-in">
      <div className="flex items-center gap-4 mb-6">
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-r from-amber-500 to-orange-500 rounded-2xl blur-lg opacity-30"></div>
          <div className="relative p-3 bg-gradient-to-br from-amber-500 via-orange-500 to-red-500 rounded-2xl shadow-lg">
            <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
          </div>
        </div>
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Was this classification helpful?</h2>
          <p className="text-gray-500 mt-1">Help us improve by providing your feedback</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Feedback buttons */}
        <div className="flex gap-4">
          <button
            type="button"
            onClick={() => handleFeedbackClick('helpful')}
            className={`
              flex-1 p-6 rounded-2xl border-2 transition-all duration-300 flex flex-col items-center gap-3
              ${feedback === 'helpful'
                ? 'border-emerald-500 bg-gradient-to-br from-emerald-50 to-green-50 shadow-lg shadow-emerald-500/20 scale-[1.02]'
                : 'border-gray-200 hover:border-emerald-300 hover:bg-emerald-50/50'
              }
            `}
          >
            <span className="text-4xl">👍</span>
            <span className={`font-semibold ${feedback === 'helpful' ? 'text-emerald-700' : 'text-gray-700'}`}>
              Helpful
            </span>
            {feedback === 'helpful' && (
              <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
            )}
          </button>

          <button
            type="button"
            onClick={() => handleFeedbackClick('not-helpful')}
            className={`
              flex-1 p-6 rounded-2xl border-2 transition-all duration-300 flex flex-col items-center gap-3
              ${feedback === 'not-helpful'
                ? 'border-red-500 bg-gradient-to-br from-red-50 to-rose-50 shadow-lg shadow-red-500/20 scale-[1.02]'
                : 'border-gray-200 hover:border-red-300 hover:bg-red-50/50'
              }
            `}
          >
            <span className="text-4xl">👎</span>
            <span className={`font-semibold ${feedback === 'not-helpful' ? 'text-red-700' : 'text-gray-700'}`}>
              Not Helpful
            </span>
            {feedback === 'not-helpful' && (
              <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
            )}
          </button>
        </div>

        {/* Comment textarea */}
        <div>
          <label htmlFor="feedback-comment" className="block text-sm font-semibold text-gray-700 mb-3">
            Additional Comments (Optional)
          </label>
          <textarea
            id="feedback-comment"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Tell us more about your experience or how we can improve..."
            className="input-field min-h-[120px] resize-y"
            disabled={isSubmitting}
          />
        </div>

        {/* Submit button */}
        <button
          type="submit"
          disabled={!feedback || isSubmitting}
          className="btn-primary w-full flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
        >
          {isSubmitting ? (
            <>
              <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              Submitting...
            </>
          ) : (
            <>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
              </svg>
              Submit Feedback
            </>
          )}
        </button>
      </form>

      {/* Info box */}
      <div className="mt-6 p-4 bg-gradient-to-r from-amber-50 to-orange-50 rounded-2xl border border-amber-100">
        <h3 className="text-sm font-bold text-amber-800 mb-2 flex items-center gap-2">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          Why your feedback matters
        </h3>
        <p className="text-sm text-amber-700 leading-relaxed">
          Your feedback helps us train better AI models and improve classification accuracy. We use this data to fine-tune our algorithms and provide more relevant results.
        </p>
      </div>
    </div>
  );
};

export default FeedbackForm;
