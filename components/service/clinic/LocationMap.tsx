import React from "react";

type LocationMapProps = {
    iframeString: string; 
};

const LocationMap: React.FC<LocationMapProps> = ({ iframeString }) => {

    console.log(iframeString)
    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 pb-20">
            <div className="mb-8">
                <h2 className="text-xl font-bold text-gray-900 mb-6">Our Location</h2>
                <div className="w-full h-[400px] rounded-lg overflow-hidden shadow">
                    <iframe
                        src={iframeString}
                        width="100%"
                        height="100%"
                        allowFullScreen
                        loading="lazy"
                        referrerPolicy="no-referrer-when-downgrade"
                    ></iframe>
                </div>
            </div>
        </div>
    );
};

export default LocationMap;
