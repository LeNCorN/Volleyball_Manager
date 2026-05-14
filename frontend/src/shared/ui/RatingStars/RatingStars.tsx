import React from 'react';
import clsx from 'clsx';
import styles from './RatingStars.module.css';

interface RatingStarsProps {
    rating: number;
    maxRating?: number;
    size?: 'sm' | 'md' | 'lg';
    interactive?: boolean;
    onRatingChange?: (rating: number) => void;
}

export const RatingStars: React.FC<RatingStarsProps> = ({
                                                            rating,
                                                            maxRating = 5,
                                                            size = 'md',
                                                            interactive = false,
                                                            onRatingChange,
                                                        }) => {
    const [hoverRating, setHoverRating] = React.useState(0);

    const handleClick = (value: number) => {
        if (interactive && onRatingChange) {
            onRatingChange(value);
        }
    };

    const getStarClass = (value: number) => {
        const currentRating = hoverRating || rating;
        if (value <= currentRating) {
            return styles.filled;
        }
        return styles.empty;
    };

    return (
        <div className={clsx(styles.ratingStars, styles[size])}>
            {Array.from({ length: maxRating }, (_, i) => {
                const starValue = i + 1;
                return (
                    <span
                        key={starValue}
                        className={clsx(
                            styles.star,
                            getStarClass(starValue),
                            interactive && styles.interactive
                        )}
                        onClick={() => handleClick(starValue)}
                        onMouseEnter={() => interactive && setHoverRating(starValue)}
                        onMouseLeave={() => interactive && setHoverRating(0)}
                    >
            ★
          </span>
                );
            })}
        </div>
    );
};