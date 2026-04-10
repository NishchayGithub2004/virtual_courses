import React from "react";
import { FaStar } from "react-icons/fa6";
import { FaRegStar } from "react-icons/fa";

const ReviewCard = ({ text, name, image, rating = 0, role }) => {
  return (
    <article className="flex h-full flex-col justify-between rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="space-y-4">
        <div className="flex items-center gap-1 text-amber-500">
          {
            Array(5).fill(0).map((_, i) => (
              <span key={i}>
                {i < rating ? <FaStar className="h-4 w-4" /> : <FaRegStar className="h-4 w-4" />}
              </span>
            ))
          }
        </div>

        <p className="text-base leading-relaxed text-slate-700">{text}</p>
      </div>

      <div className="mt-5 flex items-center gap-3">
        <img
          src={image}
          alt={name}
          className="h-12 w-12 rounded-full border border-slate-200 object-cover"
        />
        <div>
          <h4 className="font-semibold text-slate-900">{name}</h4>
          <p className="text-sm capitalize text-slate-500">{role}</p>
        </div>
      </div>
    </article>
  );
};

export default ReviewCard;
