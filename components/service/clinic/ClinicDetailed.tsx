'use client'
import React, { useEffect, useState } from 'react'
import { getAClinic } from '@/service/admin/clinicManagentService'

import ClinicCarousal from '../clinicDetailed/ClinicCarousal'
import ClinicDetailedView from '../booking/ClinicDetailedView'
import ClinicBanner from './ClinicBanner'
import { useParams, useSearchParams } from 'next/navigation'
import { getAClinicDetailed, getAService } from '@/service/user/sevicePage'

const ClinicDetailed = ({ id }: { id: string }) => {
    const [clinicData, setClinicData] = useState<any>(null)
    const [selectedService, setService] = useState()
    const [activeServiceTab, setActiveServiceTab] = useState("clinic-visit")
    const [loading, setLoading] = useState(true)
    const params = useSearchParams();
    const service = params.get("serviceId")

    const getClinicData = async () => {
        try {
            const res = await getAClinicDetailed(id)
            console.log(res, 'get the individual clinic detailed view')

            if (res.status === 200) {
                setClinicData(res?.data?.clinic)
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

            console.log(res, 'from the service call')
            if (res.status === 200) {
                setService(res?.data)
            }
        } catch (error) {
            console.log(error)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        getClinicData()
        if (service) {
            getServiceData(service)
        }
    }, []);

    console.log(id, clinicData, selectedService, 'clinic id from the service detailed page')

    return (
        <>
            <section className="max-w-screen-xl mx-auto pb-10">
                <ClinicBanner images={clinicData?.images} />
            </section>

            <section className="max-w-screen-xl mx-auto pb-5">
                <ClinicCarousal id={id} serviceDetailed={selectedService} setActiveServiceTab={setActiveServiceTab} activeServiceTab={activeServiceTab} />
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
