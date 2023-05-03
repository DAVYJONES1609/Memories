import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaStar ,FaStarHalfAlt} from 'react-icons/fa';

function Rating({ videoId }) {
  
  const [totalRatings, setTotalRatings] = useState(0);
  const [averageRating, setAverageRating] = useState(0);
  const loggedInUser = localStorage.getItem("loginUser");
  const user=JSON.parse(loggedInUser);
  useEffect(() => {
    const fetchRatings = async () => {
      try {
        const response = await axios.get(`http://localhost:9002/api/video/ratings/${videoId}`);
        const { ratings} = response.data;
       
        setTotalRatings(ratings.length);
        const total = ratings.reduce((acc, curr) => acc + curr.value, 0);//traverse over the
        //array with acc=0 initially then add acc+=curr.value.
        setAverageRating(total / ratings.length);
      } catch (error) {
        console.error(error);
      }
    };

    fetchRatings();
  }, [videoId]);

  
  return (
    <div>
      {[...Array(5)].map((star, i) => {
        const ratingValue = i + 1;
        let starIcon;
    
        if (averageRating >= ratingValue) {
            starIcon = <FaStar className="star" color="#ffc107" />;
        } else if (averageRating + 0.5 >= ratingValue) {
            starIcon = <FaStarHalfAlt className="star" color="#ffc107" />;
        } else {
            starIcon = <FaStar className="star" color="#e4e5e9" />;
        }
    
        return (
            <label key={i}>
                {starIcon}
            </label>
        );
      })}
      <div>({totalRatings} ratings)</div>
      <div>Average rating: {averageRating.toFixed(1)}</div>
    </div>
  );
}

export default Rating;
