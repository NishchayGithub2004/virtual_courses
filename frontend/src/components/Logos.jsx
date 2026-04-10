import React from 'react'
import { MdCastForEducation } from "react-icons/md";
import { SiOpenaccess } from "react-icons/si";
import { FaSackDollar } from "react-icons/fa6";
import { BiSupport } from "react-icons/bi";
import { FaUsers } from "react-icons/fa";

function Logos() {
    const highlights = [
        { icon: MdCastForEducation, label: "20k+ Online Courses", iconClass: "w-7 h-7" },
        { icon: SiOpenaccess, label: "Lifetime Access", iconClass: "w-6 h-6" },
        { icon: FaSackDollar, label: "Value For Money", iconClass: "w-6 h-6" },
        { icon: BiSupport, label: "Lifetime Support", iconClass: "w-7 h-7" },
        { icon: FaUsers, label: "Community Support", iconClass: "w-7 h-7" },
    ];

    return (
        <section className='w-full px-4 sm:px-6'>
            <div className='mx-auto flex max-w-7xl flex-wrap items-center justify-center gap-3 rounded-2xl bg-white py-4 shadow-sm sm:gap-4 sm:py-5'>
                {
                    highlights.map((item, idx) => {
                        const Icon = item.icon;
                        return (
                            <div
                                key={idx}
                                className='inline-flex min-h-12 items-center gap-2 rounded-3xl bg-slate-100 px-4 py-2 text-sm font-medium text-slate-700 sm:px-5 sm:text-lg'
                            >
                                <Icon className={`${item.iconClass} text-[#03394b]`} />
                                <span>{item.label}</span>
                            </div>
                        );
                    })
                }
            </div>
        </section>
    )
}

export default Logos
