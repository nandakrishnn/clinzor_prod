'use client'
import React, { useEffect, useState } from 'react'

import ClinicCarousal from '../clinicDetailed/ClinicCarousal'
import ClinicDetailedView from '../booking/ClinicDetailedView'
import ClinicBanner from './ClinicBanner'
import { useSearchParams } from 'next/navigation'
import { getAClinicDetailed, getAllClinicDoctorsService, getAllClinicRelatedService, getAService } from '@/service/user/sevicePage'
import LocationMap from './LocationMap'

const ClinicDetailed = ({ id }: { id: string }) => {
    const [clinicData, setClinicData] = useState<any>(null)
    const [selectedService, setService] = useState<any>()
    const [clinicService, setClinicService] = useState<any>()
    const [doctorsService, setDoctorsService] = useState<any>()
    const [activeServiceTab, setActiveServiceTab] = useState("PHYSICAL_VISIT")
    const [loading, setLoading] = useState(true)
    const params = useSearchParams();
    const service = params.get("serviceId")

    const getClinicData = async () => {
        try {
            const res = await getAClinicDetailed(id)
            if (res.status === 200) {
                setClinicData(res?.data)
            }
        } catch (error) {
            console.log(error)
        } finally {
            setLoading(false)
        }
    }

    const getServiceData = async (id: string) => {
        try {
            const res = await getAService(id)
            if (res.status === 200) {
                setService(res?.data)
            }
        } catch (error) {
            console.log(error)
        } finally {
            setLoading(false)
        }
    }

    const getAllServiceClinic = async () => {
        try {
            const res = await getAllClinicRelatedService(id)
            if (res.status === 200) {
                setClinicService(res?.data?.data)
            }
        } catch (error) {
            console.log(error)
        } finally {
            setLoading(false)
        }
    }

    const getAllDoctorsClinic = async () => {
        try {
            const res = await getAllClinicDoctorsService(id)
            if (res.status === 200) {
                setDoctorsService(res?.data?.data)
            }
        } catch (error) {
            console.log(error)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        getClinicData()
        getAllServiceClinic()
        getAllDoctorsClinic()
        if (service) {
            getServiceData(service)
        }
    }, []);

    console.log(clinicData, 'clinic data')
    console.log(selectedService, 'selected service data')
    console.log(clinicService, 'clinic services data')
    console.log(doctorsService, 'Doctor data')

    return (
        <>
            <section className="max-w-screen-xl mx-auto pb-10 px-3">
                <ClinicBanner images={clinicData?.clinic?.images} />
            </section>

            <section className="max-w-screen-xl mx-auto pb-5">
                <ClinicCarousal id={id} clinicService={clinicService} serviceDetailed={selectedService} setActiveServiceTab={setActiveServiceTab} activeServiceTab={activeServiceTab} />
            </section>

            <section className="pb-5">
                <ClinicDetailedView serviceId={service} data={clinicData} services={clinicService} activeServiceTab={activeServiceTab} doctors={doctorsService} />
            </section>

            <section className="max-w-screen-xl mx-auto pb-5">
                <LocationMap iframeString={clinicData?.clinic?.map_link} />
            </section>

            {/* Available Clinic Section */}
            {/* <section className="max-w-screen-xl mx-auto pb-10 md:pb-20">
                <BookingPage />
            </section> */}
        </>
    )
}

export default ClinicDetailed
