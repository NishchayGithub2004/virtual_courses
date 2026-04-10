import React from 'react';
import home from "../assets/home1.jpg";
import Nav from '../components/Nav';
import { SiViaplay } from "react-icons/si";
import Logos from '../components/Logos';
import Cardspage from '../components/Cardspage';
import ExploreCourses from '../components/ExploreCourses';
import About from '../components/About';
import ai from '../assets/ai.png';
import ai1 from '../assets/SearchAi.png';
import ReviewPage from '../components/ReviewPage';
import Footer from '../components/Footer';
import { useNavigate } from 'react-router-dom';

function Home() {
  const navigate = useNavigate();

  return (
    <div className='w-full overflow-x-clip bg-white'>
      <div className='relative w-full min-h-screen min-h-[100dvh] bg-black'>
        <Nav />

        <img
          src={home}
          alt="Students learning online"
          className='h-screen h-[100dvh] w-full object-cover'
        />

        <div className='absolute inset-0 bg-black/55' />

        <div className='absolute inset-0 flex w-full items-start justify-start px-4 pt-16 sm:px-6 sm:pt-20 lg:px-10 lg:pt-24'>
          <div className='max-w-xl text-white sm:max-w-2xl lg:ml-6'>
            <h1 className='text-3xl font-semibold leading-tight sm:text-5xl lg:text-[5rem] lg:leading-[1.05]'>
              Grow Your Skills to Advance Your Career Path
            </h1>

            <div className='mt-8 flex flex-col items-start gap-3 sm:gap-4'>
              <button
                className='inline-flex items-center gap-2 rounded-xl bg-white px-5 py-3 text-sm font-medium text-black transition hover:bg-gray-200 sm:text-base'
                onClick={() => navigate("/allcourses")}
              >
                View all Courses <SiViaplay className='h-5 w-5' />
              </button>

              <button
                className='inline-flex items-center gap-2 rounded-xl border border-white/70 bg-black/30 px-5 py-3 text-sm font-medium text-white backdrop-blur-sm transition hover:bg-white hover:text-black sm:text-base'
                onClick={() => navigate("/searchwithai")}
              >
                Search with AI
                <img src={ai} alt="AI icon" className='h-5 w-5 object-contain' />
                <img src={ai1} alt="Search AI icon" className='h-5 w-5 object-contain' />
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className='relative z-20 mt-8 sm:mt-12'>
        <Logos />
      </div>

      <div className='space-y-12 pb-10 pt-8 sm:space-y-14'>
        <ExploreCourses />
        <Cardspage />
        <About />
        <ReviewPage />
      </div>

      <Footer />
    </div>
  );
}

export default Home;
