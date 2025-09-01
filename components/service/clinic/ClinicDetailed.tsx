'use client'
import React, { useEffect, useState } from 'react'
import ClinicCarousal from '../clinicDetailed/ClinicCarousal'
import ClinicDetailedView from '../booking/ClinicDetailedView'
import ClinicBanner from './ClinicBanner'
import { getAService } from '@/service/user/sevicePage'

const ClinicDetailed = ({ id }: { id: string }) => {
    const [serviceData, setServiceData] = useState()
    const [loading, setLoading] = useState(true)

    const getServiceData = async () => {
        try {
           const res = await getAService(id)
           console.log(res,'get the individual service detailed view')

           if(res.status === 200){
            setServiceData(res?.data)
           }
        } catch (error) {
            console.log(error)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        getServiceData()
    }, []);

    console.log(id, 'service id from the service detailed page')

    return (
        <>
            <section className="max-w-screen-xl mx-auto pb-10">
                <ClinicBanner />
            </section>

            <section className="max-w-screen-xl mx-auto pb-5">
                <ClinicCarousal />
            </section>

            <section className="">
                <ClinicDetailedView />
            </section>

            {/* Available Clinic Section */}
            {/* <section className="max-w-screen-xl mx-auto pb-10 md:pb-20">
                <BookingPage />
            </section> */}
        </>
    )
}

export default ClinicDetailed
