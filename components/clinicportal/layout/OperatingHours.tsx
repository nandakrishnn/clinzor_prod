import React, { useEffect } from "react";
import { Clock, Save, AlertCircle, CheckCircle2 } from "lucide-react";
import { OperatingHours as OperatingHoursType } from "@/types/clinic";
import { dayNames } from "@/utils/clinicUtils";
import { SaveStatus } from "@/types/clinic";
import {
  convertTo12HourFormatN,
  generate12HourTimeOptions
} from "@/utils/formatters";

interface OperatingHoursProps {
  operatingHours: OperatingHoursType;
  isEditMode: boolean;
  onHoursChange: any;
  onToggleDayClosed: (day: keyof OperatingHoursType) => void;
  saveStatus?: SaveStatus;
  onSaveOperatingHours?: () => Promise<boolean>;
  hasChanges?: boolean;
  hasExistingData?: boolean;
}

const OperatingHours: React.FC<OperatingHoursProps> = ({
  operatingHours,
  isEditMode,
  onHoursChange,
  onToggleDayClosed,
  saveStatus = "idle",
  onSaveOperatingHours,
  hasChanges = false,
  hasExistingData = false
}) => {
  const timeOptions = generate12HourTimeOptions();

  const handleSave = async () => {
    if (onSaveOperatingHours) {
      try {
        await onSaveOperatingHours();
      } catch (error) {
        console.error("Failed to save operating hours:", error);
      }
    }
  };

  console.log(operatingHours, "operating hours");
  console.log(typeof operatingHours); // should be 'object'
  console.log(Object.values(operatingHours));

  useEffect(() => {
    console.log("Rendered operatingHours:",hasExistingData, operatingHours);
  }, [operatingHours]);

  if (!operatingHours || Object.keys(operatingHours).length === 0) {
    return <p>Loading operating hours...</p>;
  }

  return (
    <section className="bg-white rounded-3xl shadow-lg border border-gray-100 overflow-hidden">
      <div className="p-8">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl flex items-center justify-center shadow-lg">
              <Clock className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">
                Operating Hours
              </h2>
              <p className="text-gray-500">
                {hasExistingData
                  ? "Manage your clinic hours"
                  : "Set your clinic operating hours"}
              </p>
            </div>
          </div>

          {/* Save Button */}
          {isEditMode && hasChanges && (
            <button
              onClick={handleSave}
              disabled={saveStatus === "saving"}
              className={`flex items-center px-4 py-2 rounded-xl font-semibold transition-all duration-200 ${
                saveStatus === "saving"
                  ? "bg-blue-400 text-white"
                  : saveStatus === "saved"
                  ? "bg-green-500 text-white"
                  : saveStatus === "error"
                  ? "bg-red-500 text-white"
                  : "bg-blue-600 text-white hover:bg-blue-700"
              }`}
            >
              {saveStatus === "saving" ? (
                <>
                  <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin mr-2" />
                  Saving...
                </>
              ) : saveStatus === "saved" ? (
                <>
                  <CheckCircle2 className="w-4 h-4 mr-2" />
                  Saved
                </>
              ) : saveStatus === "error" ? (
                <>
                  <AlertCircle className="w-4 h-4 mr-2" />
                  Error
                </>
              ) : (
                <>
                  <Save className="w-4 h-4 mr-2" />
                  {hasExistingData ? "Update Hours" : "Create Hours"}
                </>
              )}
            </button>
          )}
        </div>

        {/* Save Status Message */}
        {saveStatus === "error" && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-2xl">
            <div className="flex items-center text-red-800">
              <AlertCircle className="w-5 h-5 mr-2" />
              <span className="font-medium">
                Failed to save operating hours. Please try again.
              </span>
            </div>
          </div>
        )}

        {saveStatus === "saved" && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-2xl">
            <div className="flex items-center text-green-800">
              <CheckCircle2 className="w-5 h-5 mr-2" />
              <span className="font-medium">
                {hasExistingData
                  ? "Operating hours updated successfully!"
                  : "Operating hours created successfully!"}
              </span>
            </div>
          </div>
        )}

        <div className="space-y-4">
          {Object.entries(operatingHours).map(([day, hours]) => (
            <div
              key={day}
              className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 p-6 bg-gray-50 rounded-2xl hover:bg-gray-100 transition-colors"
            >
              <div className="flex items-center space-x-4 min-w-[140px]">
                <div className="w-20">
                  <span className="text-lg font-semibold text-gray-900 capitalize">
                    {dayNames[day as keyof OperatingHoursType]}
                  </span>
                </div>
                {isEditMode && (
                  <button
                    onClick={() =>
                      onToggleDayClosed(day as keyof OperatingHoursType)
                    }
                    disabled={!isEditMode}
                    className={`relative inline-flex h-8 w-14 items-center rounded-full transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 ${
                      hours.closed ? "bg-gray-300" : "bg-blue-500"
                    }`}
                  >
                    <span
                      className={`inline-block h-6 w-6 transform rounded-full bg-white shadow-lg transition-transform ${
                        hours.closed ? "translate-x-1" : "translate-x-7"
                      }`}
                    />
                  </button>
                )}
              </div>
              <div className="flex-1 flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 w-full">
                {hours.closed ? (
                  <span className="text-gray-400 font-medium">Closed</span>
                ) : (
                  <>
                    {/* Display current times in 12-hour format when not editing */}
                    {!isEditMode ? (
                      <div className="flex items-center space-x-2 text-gray-900 font-medium">
                        <span>{convertTo12HourFormatN(hours.open)}</span>
                        <span className="text-gray-400">—</span>
                        <span>{convertTo12HourFormatN(hours.close)}</span>
                      </div>
                    ) : (
                      /* Show dropdowns when editing */
                      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 w-full">
                        <select
                          value={hours.open}
                          onChange={(e) =>
                            onHoursChange(
                              day as keyof OperatingHoursType,
                              "open",
                              e.target.value
                            )
                          }
                          disabled={!isEditMode || hours.closed}
                          className="w-full sm:w-auto px-3 py-2 bg-white border border-gray-200 rounded-lg text-base focus:ring-2 focus:ring-blue-500 focus:border-blue-400 disabled:bg-gray-100 disabled:text-gray-500"
                        >
                          {timeOptions.map((time) => (
                            <option key={time.value} value={time.value}>
                              {time.label}
                            </option>
                          ))}
                        </select>
                        <span className="text-gray-400 font-medium text-center">
                          —
                        </span>
                        <select
                          value={hours.close}
                          onChange={(e) =>
                            onHoursChange(
                              day as keyof OperatingHoursType,
                              "close",
                              e.target.value
                            )
                          }
                          disabled={!isEditMode || hours.closed}
                          className="w-full sm:w-auto px-3 py-2 bg-white border border-gray-200 rounded-lg text-base focus:ring-2 focus:ring-blue-500 focus:border-blue-400 disabled:bg-gray-100 disabled:text-gray-500"
                        >
                          {timeOptions.map((time) => (
                            <option key={time.value} value={time.value}>
                              {time.label}
                            </option>
                          ))}
                        </select>
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Changes Indicator */}
        {isEditMode && hasChanges && (
          <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-2xl">
            <div className="flex items-center text-blue-800">
              <Clock className="w-5 h-5 mr-2" />
              <span className="font-medium">
                {hasExistingData
                  ? "You have unsaved changes in operating hours"
                  : "Ready to create operating hours for your clinic"}
              </span>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default OperatingHours;
