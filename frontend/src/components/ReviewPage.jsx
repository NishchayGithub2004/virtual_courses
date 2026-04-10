import React, { useEffect, useState } from "react";
import ReviewCard from "./ReviewCard";
import { useSelector } from "react-redux";

function ReviewPage() {
  const [latestReview, setLatestReview] = useState([]);
  const { allReview } = useSelector((state) => state.review);

  useEffect(() => {
    setLatestReview(allReview.slice(0, 6));
  }, [allReview]);

  return (
    <section className="w-full px-4 sm:px-6">
      <div className="mx-auto max-w-7xl">
        <div className="max-w-3xl">
          <h2 className="text-3xl font-semibold text-slate-900 sm:text-4xl">Real Reviews from Real Learners</h2>
          <p className="mt-3 text-base text-slate-600">
            Discover how our virtual courses are transforming learning experiences through real feedback from students and professionals worldwide.
          </p>
        </div>

        <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
          {
            latestReview.length > 0 ? (
              latestReview.map((item, index) => (
                <ReviewCard
                  key={index}
                  rating={item.rating}
                  image={item.user?.photoUrl}
                  text={item.comment}
                  name={item.user?.name}
                  role={item.user?.role}
                />
              ))
            ) : (
              <div className="col-span-full rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-8 text-center text-slate-600">
                Reviews will appear here once users submit feedback.
              </div>
            )
          }
        </div>
      </div>
    </section>
  );
}

export default ReviewPage;
