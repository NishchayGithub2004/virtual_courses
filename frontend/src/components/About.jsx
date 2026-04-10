import React from "react";
import about from "../assets/about.jpg";
import { BiSolidBadgeCheck } from "react-icons/bi";

function About() {
  const perks = ["Simplified Learning", "Expert Trainers", "Big Experience", "Lifetime Access"];

  return (
    <section className="w-full px-4 sm:px-6">
      <div className="mx-auto grid max-w-7xl gap-8 rounded-3xl bg-white p-6 sm:p-8 lg:grid-cols-2 lg:items-start">
        <div className="mx-auto w-full max-w-[560px] space-y-4">
          <img
            src={about}
            className="h-[100px] w-full rounded-2xl object-cover sm:h-[460px] lg:h-[540px]"
            alt="About LearnAI"
          />
        </div>

        <div className="space-y-4 lg:pt-2">
          <h2 className="text-4xl font-semibold leading-tight text-slate-900 sm:text-5xl pt-30">
            We Maximize Your Learning Growth
          </h2>
          <p className="text-base leading-relaxed text-slate-600">
            We provide a modern Learning Management System to simplify online education, track progress, and enhance student-instructor collaboration efficiently.
          </p>

          <div className="grid grid-cols-1 gap-4 pt-3 sm:grid-cols-2">
            {
              perks.map((item) => (
                <div key={item} className="inline-flex items-center gap-2 text-base font-medium text-slate-800">
                  <BiSolidBadgeCheck className="h-5 w-5 text-black" />
                  {item}
                </div>
              ))
            }
          </div>
        </div>
      </div>
    </section>
  );
}

export default About;
