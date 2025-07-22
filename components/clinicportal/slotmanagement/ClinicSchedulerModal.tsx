"use client";
import React from "react";
import ClinicScheduler from "./slotschelduer";

type Props = {
  isOpen: boolean;
  onClose: () => void;
};

export default function ClinicSchedulerModal({ isOpen, onClose }: Props) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-40 flex justify-center items-center p-4">
      <div className="bg-white w-full max-w-6xl max-h-[90vh] overflow-y-auto rounded-xl shadow-lg relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-600 hover:text-black text-xl"
        >
          ✕
        </button>
        <ClinicScheduler />
      </div>
    </div>
  );
}
