import React, { useState, useEffect } from 'react';
import { Building2, Edit3 } from 'lucide-react';

interface BannerCarouselProps {
  images?: string[];
  clinicName: string;
  status?: string;
  isEditMode: boolean;
  children: React.ReactNode;
}

const BannerCarousel: React.FC<BannerCarouselProps> = ({
  images,
  clinicName,
  status,
  isEditMode,
  children
}) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  const nextImage = () => {
    if (images && images.length > 0) {
      setCurrentImageIndex((prevIndex) =>
        prevIndex === images.length - 1 ? 0 : prevIndex + 1
      );
    }
  };

  const goToImage = (index: number) => {
    setCurrentImageIndex(index);
  };

  useEffect(() => {
    if (!isAutoPlaying || !images || images.length <= 1) return;

    const interval = setInterval(() => {
      nextImage();
    }, 5000);

    return () => clearInterval(interval);
  }, [currentImageIndex, isAutoPlaying, images]);

  return (
    <div className="relative h-80 sm:h-96 rounded-xl overflow-hidden">
      {images && images.length > 0 ? (
        <div
          className="relative w-full h-full"
          onMouseEnter={() => setIsAutoPlaying(false)}
          onMouseLeave={() => setIsAutoPlaying(true)}
        >
          <div
            className="w-full h-full bg-cover bg-center transition-all duration-500 ease-in-out"
            style={{ backgroundImage: `url(${images[currentImageIndex]})` }}
          >
            <div className="absolute inset-0 bg-black/40"></div>
          </div>

          {images.length > 1 && (
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
              {images.map((_, index) => (
                <button
                  key={index}
                  onClick={() => goToImage(index)}
                  className={`w-3 h-3 rounded-full transition-all duration-200 ${
                    index === currentImageIndex
                      ? 'bg-white'
                      : 'bg-white/50 hover:bg-white/70'
                  }`}
                />
              ))}
            </div>
          )}
        </div>
      ) : (
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-700"></div>
      )}

      {children}

      {isEditMode && (
        <div className="absolute top-6 left-6 z-20">
          <div className="flex items-center px-4 py-2 bg-yellow-500/90 backdrop-blur-sm text-white rounded-xl border border-yellow-300">
            <Edit3 className="w-4 h-4 mr-2" />
            <span className="text-sm font-medium">Edit Mode</span>
          </div>
        </div>
      )}

      <div className="absolute inset-0 flex items-center justify-center">
        <div className="text-center text-white px-6 max-w-4xl mx-auto">
          <div className="inline-flex items-center justify-center w-24 h-24 bg-white/20 backdrop-blur-sm rounded-3xl mb-6 border border-white/30 shadow-2xl">
            <Building2 className="w-12 h-12 text-white" />
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold mb-4 drop-shadow-lg">
            {clinicName || 'Clinic Profile'}
          </h1>
          <p className="text-xl sm:text-2xl text-white/90 mb-6 drop-shadow">
            {isEditMode ? 'Edit your clinic information' : 'Manage your clinic information and settings'}
          </p>
          {status && (
            <div className="inline-flex items-center px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full border border-white/30">
              <div className={`w-2 h-2 rounded-full mr-2 ${
                status === 'APPROVED' ? 'bg-green-400' :
                status === 'PENDING' ? 'bg-yellow-400' : 'bg-red-400'
              }`}></div>
              <span className="text-sm font-semibold capitalize">
                {status.toLowerCase()}
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BannerCarousel;