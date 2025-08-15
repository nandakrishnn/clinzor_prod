"use client";

import React from "react";

interface Doctor {
  id: number;
  name: string;
  gender: string;
  specialization: string;
  experience: string;
}

interface DoctorSelectorProps {
  doctors: Doctor[];
  preferFemaleDoctor: boolean;
}

export const DoctorSelector: React.FC<DoctorSelectorProps> = ({
  doctors,
  preferFemaleDoctor,
}) => {
  return (
    <div className="mb-8">
      {/* <h2 className="text font-semibold text-gray-800 mb-4">Available Doctor</h2> */}
      <div className="flex flex-wrap gap-4">
        {doctors
          .filter(doc => !preferFemaleDoctor || doc.gender === "female")
          .map((doc) => (
            <div key={doc.id} className="bg-white rounded-lg shadow p-4 flex flex-col items-start border border-gray-200 min-w-[200px]">
              <span className="font-semibold text-gray-900">{doc.name}</span>
              <span className="text-gray-600 text-sm">{doc.specialization}</span>
              <span className="text-gray-500 text-xs">Experience: {doc.experience}</span>
            </div>
        ))}
      </div>
    </div>
  );
};