import React from "react";
import { useNavigate } from "react-router-dom";
import logo from "../assets/logo.jpg";

const Footer = () => {
  const navigate = useNavigate();

  return (
    <footer className="mt-8 w-full bg-black text-white">
      <div className="mx-auto grid w-full max-w-7xl gap-10 px-4 py-12 sm:px-6 md:grid-cols-3">
        <div>
          <div className="mb-4 inline-flex h-16 w-16 items-center justify-center overflow-hidden rounded-lg border border-white/30">
            <img src={logo} alt="LearnAI logo" className="h-full w-full object-cover" />
          </div>
          <h2 className="text-2xl font-semibold">Virtual Courses</h2>
          <p className="mt-3 max-w-sm text-sm leading-relaxed text-white/80">
            AI-powered learning platform to help you grow smarter. Learn anything, anytime, anywhere.
          </p>
        </div>

        <div>
          <h3 className="text-lg font-semibold">Quick Links</h3>
          <ul className="mt-4 space-y-2 text-sm text-white/80">
            <li className="cursor-pointer transition hover:text-white" onClick={() => navigate("/")}>Home</li>
            <li className="cursor-pointer transition hover:text-white" onClick={() => navigate("/allcourses")}>Courses</li>
            <li className="cursor-pointer transition hover:text-white" onClick={() => navigate("/login")}>Login</li>
            <li className="cursor-pointer transition hover:text-white" onClick={() => navigate("/profile")}>My Profile</li>
          </ul>
        </div>

        <div>
          <h3 className="text-lg font-semibold">Explore Categories</h3>
          <ul className="mt-4 space-y-2 text-sm text-white/80">
            <li>Web Development</li>
            <li>AI/ML</li>
            <li>Data Science</li>
            <li>UI/UX Design</li>
          </ul>
        </div>
      </div>

      <div className="border-t border-white/15">
        <div className="mx-auto w-full max-w-7xl px-4 py-4 text-sm text-white/70 sm:px-6">
          Copyright {new Date().getFullYear()} LearnAI. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
