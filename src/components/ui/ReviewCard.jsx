import StarRating from './StarRating';

const ReviewCard = ({ review, showWorkerResponse = true, onRespond }) => {
  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="panel-card p-6">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          {/* Avatar */}
          <div className="w-10 h-10 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center text-white font-bold">
            {review.customer?.name?.charAt(0).toUpperCase() || 'C'}
          </div>
          <div>
            <h4 className="text-white font-medium">{review.customer?.name || 'Customer'}</h4>
            <p className="text-gray-500 text-sm">{formatDate(review.createdAt)}</p>
          </div>
        </div>
        <StarRating rating={review.rating} readonly size="sm" />
      </div>

      {/* Job Info */}
      {review.job && (
        <div className="mb-3 px-3 py-2 bg-gray-800/50 rounded-lg">
          <p className="text-sm text-gray-400">
            Job: <span className="text-gray-300">{review.job.title}</span>
          </p>
          <p className="text-xs text-gray-500 capitalize">
            Category: {review.job.category}
          </p>
        </div>
      )}

      {/* Review Comment */}
      <p className="text-gray-300 mb-4">{review.comment}</p>

      {/* Detailed Ratings (if available) */}
      {(review.qualityRating || review.punctualityRating || review.professionalismRating) && (
        <div className="flex flex-wrap gap-4 mb-4 text-sm">
          {review.qualityRating && (
            <div className="flex items-center space-x-2">
              <span className="text-gray-500">Quality:</span>
              <StarRating rating={review.qualityRating} readonly size="sm" />
            </div>
          )}
          {review.punctualityRating && (
            <div className="flex items-center space-x-2">
              <span className="text-gray-500">Punctuality:</span>
              <StarRating rating={review.punctualityRating} readonly size="sm" />
            </div>
          )}
          {review.professionalismRating && (
            <div className="flex items-center space-x-2">
              <span className="text-gray-500">Professionalism:</span>
              <StarRating rating={review.professionalismRating} readonly size="sm" />
            </div>
          )}
        </div>
      )}

      {/* Worker Response */}
      {showWorkerResponse && review.workerResponse?.comment && (
        <div className="mt-4 pl-4 border-l-2 border-purple-500/50">
          <div className="flex items-center space-x-2 mb-2">
            <span className="text-purple-400 text-sm font-medium">Worker Response</span>
            <span className="text-gray-600 text-xs">
              {formatDate(review.workerResponse.respondedAt)}
            </span>
          </div>
          <p className="text-gray-400 text-sm">{review.workerResponse.comment}</p>
        </div>
      )}

      {/* Respond Button (for workers) */}
      {onRespond && !review.workerResponse?.comment && (
        <button
          onClick={() => onRespond(review)}
          className="mt-4 text-sm text-purple-400 hover:text-purple-300 transition"
        >
          Reply to this review →
        </button>
      )}
    </div>
  );
};

export default ReviewCard;