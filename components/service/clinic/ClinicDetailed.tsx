import React from 'react'
import ClinicCarousal from '../clinicDetailed/ClinicCarousal'
import ClinicDetailedView from '../booking/ClinicDetailedView'
import BookingPage from '../booking/BookingPage'
import ClinicBanner from './ClinicBanner'

const ClinicDetailed = () => {
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
