import React from 'react'
import { SiViaplay } from "react-icons/si";
import { TbDeviceDesktopAnalytics } from "react-icons/tb";
import { LiaUikit } from "react-icons/lia";
import { MdAppShortcut } from "react-icons/md";
import { FaHackerrank } from "react-icons/fa";
import { TbBrandOpenai } from "react-icons/tb";
import { SiGoogledataproc } from "react-icons/si";
import { BsClipboardDataFill } from "react-icons/bs";
import { SiOpenaigym } from "react-icons/si";
import { useNavigate } from 'react-router-dom';

function ExploreCourses() {
  const navigate = useNavigate()
  const categories = [
    { icon: TbDeviceDesktopAnalytics, label: "Web Development", box: "bg-[#fbd9fb]" },
    { icon: LiaUikit, label: "UI UX Designing", box: "bg-[#d9fbe0]" },
    { icon: MdAppShortcut, label: "App Development", box: "bg-[#fcb9c8]" },
    { icon: FaHackerrank, label: "Ethical Hacking", box: "bg-[#fbd9fb]" },
    { icon: TbBrandOpenai, label: "AI/ML", box: "bg-[#d9fbe0]" },
    { icon: SiGoogledataproc, label: "Data Science", box: "bg-[#fcb9c8]" },
    { icon: BsClipboardDataFill, label: "Data Analytics", box: "bg-[#fbd9fb]" },
    { icon: SiOpenaigym, label: "AI Tools", box: "bg-[#d9fbe0]" },
  ];

  return (
    <section className='w-full px-4 sm:px-6'>
      <div className='mx-auto grid max-w-7xl gap-8 rounded-3xl bg-white p-6 sm:p-8 lg:grid-cols-[320px_1fr]'>
        <div className='flex flex-col items-start justify-center'>
          <span className='text-4xl font-semibold leading-tight sm:text-5xl'>Explore</span>
          <span className='text-4xl font-semibold leading-tight sm:text-5xl'>Our Courses</span>
          <button
            className='mt-8 inline-flex items-center gap-2 rounded-xl bg-black px-5 py-3 text-base font-medium text-white transition hover:bg-slate-800'
            onClick={() => navigate("/allcourses")}
          >
            Explore Courses <SiViaplay className='h-6 w-6 fill-white' />
          </button>
        </div>

        <div className='grid grid-cols-2 gap-x-6 gap-y-7 sm:grid-cols-3 lg:grid-cols-4'>
          {
            categories.map((item, idx) => {
              const Icon = item.icon;
              return (
                <div key={idx} className='flex min-h-[136px] flex-col items-center gap-3 text-center text-sm text-slate-700'>
                  <div className={`flex h-[94px] w-[102px] items-center justify-center rounded-xl ${item.box}`}>
                    <Icon className='h-12 w-12 text-[#6d6c6c]' />
                  </div>
                  <span className='font-medium leading-tight'>{item.label}</span>
                </div>
              );
            })
          }
        </div>
      </div>
    </section>
  )
}

export default ExploreCourses
