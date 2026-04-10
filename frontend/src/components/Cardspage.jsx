import React, { useEffect, useState } from "react";
import Card from "./Card.jsx";
import { useSelector } from "react-redux";
import { SiViaplay } from "react-icons/si";
import { useNavigate } from "react-router-dom";

function Cardspage() {
  const [popularCourses, setPopularCourses] = useState([]);
  const { courseData } = useSelector((state) => state.course);
  const navigate = useNavigate();

  useEffect(() => {
    setPopularCourses(courseData.slice(0, 6));
  }, [courseData]);

  return (
    <section className="w-full px-4 sm:px-6">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 flex flex-col gap-4 sm:mb-10 sm:flex-row sm:items-end sm:justify-between">
          <div className="max-w-3xl">
            <h2 className="text-3xl font-semibold text-slate-900 sm:text-4xl">Our Popular Courses</h2>
            <p className="mt-3 text-base text-slate-600">
              Explore top-rated courses designed to boost your skills, enhance careers, and unlock opportunities in tech, AI, business, and beyond.
            </p>
          </div>
          <button
            onClick={() => navigate("/allcourses")}
            className="inline-flex w-fit items-center gap-2 rounded-xl bg-black px-5 py-3 text-base font-medium text-white transition hover:bg-slate-800"
          >
            View all Courses <SiViaplay className="h-6 w-6 fill-white" />
          </button>
        </div>

        {
          popularCourses.length > 0 ? (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
              {
                popularCourses.map((item, index) => (
                  <Card
                    key={index}
                    id={item._id}
                    thumbnail={item.thumbnail}
                    title={item.title}
                    price={item.price}
                    category={item.category}
                    reviews={item.reviews}
                  />
                ))
              }
            </div>
          ) : (
            <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-8 text-center text-slate-600">
              Popular courses will appear here once data is loaded.
            </div>
          )
        }
      </div>
    </section>
  );
}

export default Cardspage;
