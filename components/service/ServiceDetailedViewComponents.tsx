'use client'
import React, { useEffect, useState } from 'react'
import { FiSearch } from 'react-icons/fi'
import AvailableClinics from './AvailableClinics'
import ServiceDetailed from './ServiceDetailed'
import { getAllService } from '@/service/user/sevicePage'
import Link from 'next/link'

const ServiceDetailedViewComponents = ({ id }: { id: any }) => {
  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");
  const [serviceTag, setServiceTag] = useState<any>()
  const [isSearching, setIsSearching] = useState(false);
  const [visitType, setVisitType] = useState('')

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchInput(e.target.value);
  };

  // trigger search (when pressing Enter or clicking icon)
  const triggerSearch = () => {
    setIsSearching(true);
    setSearch(searchInput); // pass this to AvailableClinics
    setTimeout(() => setIsSearching(false), 500); // simulate loader, remove when real API returns
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      triggerSearch();
    }
  };

  const getAllServiceData = async () => {
    try {
      const res = await getAllService();
      if (res?.status === 200) {
        setServiceTag(res?.data?.data)
      }
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    getAllServiceData()
  }, [])


  return (
    <div className="flex flex-col w-full">
      {/* Search Bar */}
      <div className="max-w-7xl mx-auto w-full md:my-4 px-5">
        <div className='flex flex-col md:flex-row items-center justify-center gap-2'>
          {/* search  */}
          <div className='relative w-full'>
            <input
              type="text"
              value={searchInput}
              onChange={handleInputChange}
              onKeyDown={handleKeyDown}
              placeholder="Search clinics..."
              className="w-full py-3 px-11 border border-gray-300 rounded-lg focus:outline-none "
            />

            {/* Right-side Icon / Loader */}
            <div className="absolute inset-y-0 left-4 flex items-center">
              {isSearching ? (
                <div className="animate-spin h-5 w-5 border-2 border-primaryColor border-t-transparent rounded-full"></div>
              ) : (
                <button
                  onClick={triggerSearch}
                  className="text-gray-500 hover:text-primaryColor"
                >
                  <FiSearch size={20} />
                </button>
              )}
            </div>
          </div>

          {/* Filter part */}
          <div className='w-full md:w-[30%]'>
            <select className='py-3.5 w-full px-5 border border-gray-300 rounded-lg focus:outline-none ' value={visitType} onChange={(e: any) => setVisitType(e.target.value)}>
              <option value="">Select Options</option>
              <option value="VIDEO_CALL">Video Call</option>
              <option value="CLINIC_VISIT">Clinic Visit</option>
              <option value="HOME_VISIT">Home Visit</option>
            </select>
          </div>
        </div>

        <div className='mt-3 w-full flex gap-3 overflow-x-scroll hide-scrollbar'>
          {
            serviceTag?.map((tag: any) => (
              <Link key={tag?.uuid} href={`/service/${tag?.uuid}`}>
                <div className='bg-primaryColor text-nowrap rounded-md p-1.5 w-fit px-4 text-white border text-sm border-gray-300 hover:bg-blue-900 ease-in-out duration-300 hover:text-white cursor-pointer'>
                  {tag?.name}
                </div>
              </Link>
            ))
          }
        </div>
      </div>


      {/* Children */}
      <div className="max-w-7xl mx-auto min-w-full flex flex-col md:flex-row ">
        <AvailableClinics id={id} search={search} type={visitType} />
        <ServiceDetailed id={id} />
      </div>
    </div>
  );
};

export default ServiceDetailedViewComponents;
