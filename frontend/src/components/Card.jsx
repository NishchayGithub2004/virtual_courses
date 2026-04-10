import React from "react";
import { FaStar } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const CourseCard = ({ thumbnail, title, category, price, id, reviews = [] }) => {
  const navigate = useNavigate();

  const calculateAverageRating = (reviewsList) => {
    if (!reviewsList || reviewsList.length === 0) return 0;
    const total = reviewsList.reduce((sum, review) => sum + review.rating, 0);
    return (total / reviewsList.length).toFixed(1);
  };

  const avgRating = calculateAverageRating(reviews);

  return (
    <div
      className="group w-full max-w-[330px] cursor-pointer overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
      onClick={() => navigate(`/viewcourse/${id}`)}
    >
      <img src={thumbnail} alt={title} className="h-48 w-full object-cover" />

      <div className="space-y-3 p-5">
        <h2 className="line-clamp-2 text-lg font-semibold text-slate-900">{title}</h2>

        <span className="inline-flex rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-700">
          {category}
        </span>

        <div className="flex items-center justify-between text-sm">
          <span className="text-xl font-semibold text-slate-900">Rs. {price}</span>
          <span className="inline-flex items-center gap-1 rounded-lg bg-amber-50 px-2 py-1 font-medium text-amber-600">
            <FaStar className="h-4 w-4" /> {avgRating}
          </span>
        </div>
      </div>
    </div>
  );
};

export default CourseCard;
