'use client'
import React, { useEffect, useState } from 'react'
import ClinicCarousal from '../clinicDetailed/ClinicCarousal'
import ClinicDetailedView from '../booking/ClinicDetailedView'
import ClinicBanner from './ClinicBanner'
import { useSearchParams } from 'next/navigation'
import { getAClinicDetailed, getAllClinicDoctorsService, getAllClinicRelatedService, getAService, getClincDataByName, getIdByServiceName } from '@/service/user/sevicePage'
import LocationMap from './LocationMap'
import useLocalStorage from '@/hooks/useLocalStorage.ts'

const ClinicDetailed = ({ id }: { id: string }) => {
  const [clinicData, setClinicData] = useState<any>(null)
  const [selectedService, setService] = useState<any>()
  const [clinicService, setClinicService] = useState()
  const [doctorsService, setDoctorsService] = useState()
  const [activeServiceTab, setActiveServiceTab] = useState("PHYSICAL_VISIT")
  const [loading, setLoading] = useState(true)
  
  const params = useSearchParams();
  const { getItem } = useLocalStorage()
  
  const [service, setServiceId] = useState(getItem(id[1]))
  const [cliniId, setClinicId] = useState(getItem(id[0]))

  const getClinicData = async () => {
    try {
      if (!cliniId) {
        const res = await getClincDataByName(id[0])
        const clinicUuid = res.uuid
        setClinicId(clinicUuid)
        
        const resp = await getAClinicDetailed(clinicUuid)
        if (resp.status === 200) {
          setClinicData(resp?.data)
        }
      } else {
        const res = await getAClinicDetailed(cliniId)
        if (res.status === 200) {
          setClinicData(res?.data)
        }
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
      const res = await getAllClinicRelatedService(cliniId)
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
      const res = await getAllClinicDoctorsService(cliniId)
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
    const fetchServiceData = async () => {
      if (!service) {
        const serviceData = await getIdByServiceName(id[1]);
        const serviceUuid = serviceData.uuid
        setServiceId(serviceUuid)
        getServiceData(serviceUuid)
      } else {
        getServiceData(service.trim())
      }
    };

    getClinicData()
    fetchServiceData()
  }, []);

  useEffect(() => {
    if (cliniId) {
      getAllServiceClinic()
      getAllDoctorsClinic()
    }
  }, [cliniId]);

    return (
        <>
            <section className="max-w-screen-xl mx-auto pb-10 px-3">
                <ClinicBanner images={clinicData?.clinic?.images ?? ""} serviceImage={selectedService?.image ?? ""} />
            </section>

            <section className="max-w-screen-xl mx-auto pb-5 ">
                <ClinicCarousal loading={loading} id={cliniId + ""} clinicService={clinicService} serviceDetailed={selectedService} setActiveServiceTab={setActiveServiceTab} activeServiceTab={activeServiceTab} />
            </section>

            <section className="pb-5 ">
                <ClinicDetailedView loading={loading} serviceId={service} data={clinicData} services={clinicService} activeServiceTab={activeServiceTab} doctors={doctorsService} />
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

