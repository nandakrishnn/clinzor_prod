import Image from 'next/image'
import React from 'react'

const ClinicBanner = () => {
    return (
        <div className='h-[50vh]'>
            <Image
                src={"/admin.jpg"}
                alt=""
                width={500}
                height={500}
                className="w-full h-full object-cover rounded-xl "
            />
        </div>
    )
}

export default ClinicBanner
