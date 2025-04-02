import React, { useState, useEffect } from 'react';
import { FaStar, FaReply, FaQuestionCircle } from 'react-icons/fa';
import { useAuth } from '../../context/AuthContext';
import { reviewApi } from '../../services/api';
import { Review, Business } from '../../types/auth';

const ReviewManagement: React.FC = () => {
  const { business } = useAuth();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [replyText, setReplyText] = useState<{[key: string]: string | undefined}>({});
  const [replying, setReplying] = useState<{[key: string]: boolean}>({});
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    loadReviews();
  }, [business?.id]);

  const loadReviews = async () => {
    if (!business?.id) return;
    
    try {
      setLoading(true);
      const data = await reviewApi.getForBusiness(business.id);
      // Sort by date (newest first)
      const sortedData = [...data].sort(
        (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
      );
      setReviews(sortedData);
    } catch (err) {
      console.error('Error loading reviews:', err);
      setError('Failed to load reviews. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const handleReplyChange = (reviewId: string, text: string) => {
    setReplyText({
      ...replyText,
      [reviewId]: text
    });
  };

  const submitReply = async (reviewId: string) => {
    if (!business || !replyText[reviewId]?.trim()) return;
    
    try {
      setReplying({
        ...replying,
        [reviewId]: true
      });
      
      await reviewApi.addReply(reviewId, {
        businessId: business.id,
        businessOwnerEmail: business.ownerEmail,
        reply: replyText[reviewId]
      });
      
      setSuccessMessage('Your reply has been posted successfully!');
      
      // Clear the reply form
      setReplyText({
        ...replyText,
        [reviewId]: undefined
      });
      
      // Reload reviews to show the new reply
      loadReviews();
      
      // Clear success message after 3 seconds
      setTimeout(() => {
        setSuccessMessage('');
      }, 3000);
    } catch (err) {
      console.error('Error submitting reply:', err);
      setError('Failed to submit your reply. Please try again.');
      
      // Clear error after 3 seconds
      setTimeout(() => {
        setError('');
      }, 3000);
    } finally {
      setReplying({
        ...replying,
        [reviewId]: false
      });
    }
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-4 bg-gray-200 rounded w-1/4"></div>
          <div className="h-10 bg-gray-200 rounded"></div>
          <div className="h-20 bg-gray-200 rounded"></div>
          <div className="h-20 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
        <button 
          onClick={loadReviews}
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold mb-6">Reviews & Inquiries Management</h2>
      
      {successMessage && (
        <div className="mb-4 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded">
          {successMessage}
        </div>
      )}
      
      {reviews.length === 0 ? (
        <div className="text-center py-8 bg-gray-50 rounded-lg">
          <p className="text-gray-500">You don't have any reviews or inquiries yet.</p>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="p-4 bg-blue-50 rounded-lg mb-4 text-blue-700">
            <p className="text-sm">
              <strong>Note:</strong> You can only reply to each review/inquiry once. Your response will be publicly visible to all users.
            </p>
          </div>
          
          <div className="bg-white rounded-lg shadow divide-y">
            {reviews.map((review) => (
              <div key={review.id} className="p-4 hover:bg-gray-50 transition-colors">
                <div className="flex justify-between mb-2">
                  <span className="font-medium">{review.userName}</span>
                  <span className="text-sm text-gray-500">{new Date(review.date).toLocaleDateString()}</span>
                </div>
                
                <div className="flex mb-2">
                  {review.rating !== undefined ? (
                    <>
                      {[...Array(5)].map((_, i) => (
                        <FaStar 
                          key={i} 
                          className={i < review.rating! ? "text-yellow-400" : "text-gray-200"} 
                        />
                      ))}
                    </>
                  ) : (
                    <div className="flex items-center text-gray-500">
                      <FaQuestionCircle className="mr-1" />
                      <span className="text-xs">Inquiry</span>
                    </div>
                  )}
                </div>
                
                <p className="text-gray-700 mb-3">{review.comment}</p>
                
                {review.ownerReply ? (
                  <div className="mt-3 ml-6 p-3 bg-gray-50 rounded-lg border-l-2 border-blue-500">
                    <div className="flex justify-between mb-1">
                      <span className="font-medium text-sm">Your Response</span>
                      <span className="text-xs text-gray-500">
                        {new Date(review.ownerReplyDate || '').toLocaleDateString()}
                      </span>
                    </div>
                    <p className="text-gray-700 text-sm">{review.ownerReply}</p>
                  </div>
                ) : (
                  <div className="mt-4">
                    <button
                      onClick={() => {
                        if (replyText[review.id] === undefined) {
                          handleReplyChange(review.id, '');
                        }
                      }}
                      className="text-blue-600 hover:text-blue-800 flex items-center text-sm font-medium"
                    >
                      <FaReply className="mr-1" />
                      Reply to this {review.rating !== undefined ? 'review' : 'inquiry'}
                    </button>
                    
                    {replyText[review.id] !== undefined && (
                      <div className="mt-3">
                        <textarea
                          value={replyText[review.id] || ''}
                          onChange={(e) => handleReplyChange(review.id, e.target.value)}
                          className="w-full border rounded-lg p-2 text-sm"
                          rows={3}
                          placeholder="Write your response here..."
                        />
                        <div className="flex justify-end mt-2">
                          <button
                            onClick={() => {
                              const newReplyText = {...replyText};
                              delete newReplyText[review.id];
                              setReplyText(newReplyText);
                            }}
                            className="px-3 py-1 text-sm mr-2 text-gray-600 hover:text-gray-800"
                          >
                            Cancel
                          </button>
                          <button
                            onClick={() => submitReply(review.id)}
                            disabled={!replyText[review.id]?.trim() || replying[review.id]}
                            className={`px-3 py-1 text-sm text-white rounded ${
                              !replyText[review.id]?.trim() || replying[review.id]
                                ? 'bg-gray-400 cursor-not-allowed'
                                : 'bg-blue-600 hover:bg-blue-700'
                            }`}
                          >
                            {replying[review.id] ? 'Submitting...' : 'Submit Reply'}
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ReviewManagement; 