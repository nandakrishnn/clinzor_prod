"use client";

import Image from "next/image";

export default function ScheduleConsultation() {
  return (
    <section className="w-full md:w-1/2 flex items-center justify-center p-4 md:p-8 relative">
      {/* Decorative background blobs */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-gradient-to-tr from-blue-100/50 via-purple-100/30 to-teal-100/50 rounded-full blur-3xl -z-10" />

      <div className="relative w-full aspect-square md:aspect-[2/2] rounded-3xl overflow-hidden  border-[6px] border-white ring-1 ring-slate-100 transform hover:scale-[1.02] transition-all duration-500 ease-out">
        <Image
          src="/clinzor_expert.png"
          alt="Clinzor Expert Consultation"
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, 50vw"
          priority
        />

        {/* Glassmorphism Badge */}
        <div className="absolute bottom-6 left-6 right-6">
          <div className="bg-white/80 backdrop-blur-md p-4 rounded-xl shadow-lg border border-white/50 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
              </span>
              <div>
                <p className="font-bold text-slate-800 text-sm leading-tight">
                  Clinzor Expert
                </p>
                <p className="text-xs text-slate-500 font-medium">
                  Available Now
                </p>
              </div>
            </div>
            <div className="flex -space-x-2">
              {[1, 2, 3].map((i) => (
                <div key={i} className="w-8 h-8 rounded-full bg-slate-200 border-2 border-white flex items-center justify-center text-[10px] font-bold text-slate-400">
                  Doc
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
