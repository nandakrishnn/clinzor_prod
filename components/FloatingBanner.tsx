'use client'
import { Close } from '@mui/icons-material';
import Image from 'next/image';
import Link from 'next/link';
import React, { useState } from 'react';

const FloatingBanner = () => {
  const [hidden, setHidden] = useState(false)
  const handleHide = async () => {
    setHidden(true)
  }
  return (
    <>

      <div className={`${hidden && "hidden"} fixed z-50 bottom-5 right-5 w-[190px] h-[255px] md:w-[350px] md:h-[185px] shadow-xl`}>
        {/* Close button*/}
        <div onClick={handleHide} className='absolute -top-10 md:-top-9 right-0 z-50 border rounded-full border-black cursor-pointer md:hidden'>
          <Close className='text-black' />
        </div>

        {/* Floating Content */}
        <div className='flex relative w-full h-full overflow-hidden rounded-xl bg-gradient-to-r from-[#000E50] to-[#00D0FD]'>
          <div className="flex-1 p-4 flex flex-col md:justify-between">

            {/* Top Clinzor Logo */}
            <div className="text-white">
              <Image src={'/logoF.png'} alt='' width={600} height={600} className='w-[70px] object-contain' />
            </div>

            <div className="text-white mt-2">
              <p className="text-[12px] md:text-[15px] font-bold uppercase md:leading-5">Not Sure Which Service To Choose?</p>
              <p className="text-[8px] font-semibold mt-2 w-[80%] md:w-full">Get a free call with our care advisor</p>
              <p className="text-[6px] mt-0.5 w-[60%] md:w-full">We'll guide you to the right clinic & service for your needs</p>
            </div>

            <Link href={'/expert-call'}>
              <button className="bg-gradient-to-br from-[#00A7DA] to-[#001353] text-white text-[7px] md:text-[9px] font-bold py-1 px-2 md:py-1.5 md:px-4 rounded-full mt-2 w-fit">
                BOOK NOW
              </button>
            </Link>
          </div>

          {/* Right Side image*/}
          <div className="md:w-[35%]">
            <Image src={'/bg.png'} alt='' width={600} height={600} className='w-[150px] md:w-[190px] object-cover absolute -bottom-4 -right-5' />
          </div>
        </div>
      </div>
    </>
  );
};

export default FloatingBanner;