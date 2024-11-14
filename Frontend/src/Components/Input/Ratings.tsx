import React, { useState } from 'react';
import { AiOutlineStar } from "react-icons/ai";

const StarRating = ({ maxRating = 5 }) => {
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);

  return (
    <div className="flex space-x-3">
      {Array.from({ length: maxRating }, (_, index) => {
        const starValue = index + 1;

        return (
          <button
            key={index}
            onClick={() => setRating(starValue)}
            onMouseEnter={() => setHoverRating(starValue)}
            onMouseLeave={() => setHoverRating(0)}
            className="focus:outline-none"
          >
            {starValue <= (hoverRating || rating) ? (
              <AiOutlineStar className="w-10 h-10 text-yellow-400" />
            ) : (
              <AiOutlineStar className="w-10 h-10 ext-gray-400" />
            )}
          </button>
        );
      })}
    </div>
  );
};

export default StarRating;
