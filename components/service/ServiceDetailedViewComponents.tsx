import React from 'react'
import AvailableClinics from './AvailableClinics'
import ServiceDetailed from './ServiceDetailed'

const ServiceDetailedViewComponents = ({ id }: { id: any }) => {
  return (
    <div className='w-full flex flex-col md:flex-row'>
      <AvailableClinics id={id} />
      <ServiceDetailed id={id} />
    </div>
  )
}

export default ServiceDetailedViewComponents
