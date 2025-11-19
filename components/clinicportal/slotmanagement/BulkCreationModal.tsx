// This file mirrors components/BulkCreationModal.tsx so both import styles behave the same.

"use client";

import type React from "react";
import { useEffect, useMemo, useState } from "react";
import {
  X,
  ChevronLeft,
  ChevronRight,
  Copy,
  Check,
  Plus,
  Trash2,
  Save,
  Edit3,
  Clock,
  Eye,
  Settings,
  Calendar,
  CheckCircle
} from "lucide-react";
import {
  createClinicBlukSlot,
  getClinicDataService
} from "@/service/clinic/slotManagementService";

interface BulkCreationModalProps {
  showBulkForm: boolean;
  setShowBulkForm: (show: boolean) => void;
  currentPage: number;
  fetchSlots: (page?: number) => void;
  showNotification: (
    type: "success" | "error" | "warning",
    message: string
  ) => void;
}

interface TimeSlot {
  start_time: string;
  end_time: string;
  max_bookings: number;
  female_doctors: number;
  is_video_call: boolean;
  is_physical_visit: boolean;
}

interface DaySlots {
  date: string;
  dayName: string;
  slots: TimeSlot[];
}

/* --------------------------------- Helpers --------------------------------- */

const localDateStr = (d: Date) => {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
};

const formatLocalNaiveForApi = (isoOrLocal: string) => {
  const d = new Date(isoOrLocal);
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  const hh = String(d.getHours()).padStart(2, "0");
  const mm = String(d.getMinutes()).padStart(2, "0");
  return `${y}-${m}-${day}T${hh}:${mm}`;
};

const createLocalDate = (dateStr: string, timeStr = "00:00") => {
  const [year, month, day] = dateStr.split("-").map(Number);
  const [hours, minutes] = timeStr.split(":").map(Number);
  return new Date(year, month - 1, day, hours, minutes);
};

const to12Hour = (time: string) => {
  const [hh, mm] = time.split(":");
  const h = Number.parseInt(hh, 10);
  const p = h >= 12 ? "PM" : "AM";
  const h12 = h % 12 || 12;
  return `${h12}:${mm} ${p}`;
};

const formatTimeForDisplay = (iso: string) => {
  const d = new Date(iso);
  return to12Hour(d.toTimeString().substring(0, 5));
};

/* ------------------------------ TimePicker UI ------------------------------ */

const TimePicker: React.FC<{
  value: string;
  onChange: (time: string) => void;
  className?: string;
}> = ({ value, onChange, className = "" }) => {
  const [hour, setHour] = useState("09");
  const [minute, setMinute] = useState("00");
  const [period, setPeriod] = useState<"AM" | "PM">("AM");

  useEffect(() => {
    if (!value) return;
    const [h, m] = value.split(":");
    const hourNum = Number.parseInt(h, 10);
    const p = hourNum >= 12 ? "PM" : "AM";
    const h12 = hourNum % 12 || 12;
    setHour(h12.toString().padStart(2, "0"));
    setMinute(m);
    setPeriod(p);
  }, [value]);

  const handleTimeChange = (
    newHour: string,
    newMinute: string,
    newPeriod: "AM" | "PM"
  ) => {
    let hour24 = Number.parseInt(newHour, 10);
    if (newPeriod === "PM" && hour24 !== 12) hour24 += 12;
    if (newPeriod === "AM" && hour24 === 12) hour24 = 0;
    onChange(`${hour24.toString().padStart(2, "0")}:${newMinute}`);
  };

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <div className="flex items-center bg-white border border-gray-300 rounded-lg overflow-hidden">
        <select
          value={hour}
          onChange={(e) => {
            setHour(e.target.value);
            handleTimeChange(e.target.value, minute, period);
          }}
          className="px-3 py-2 bg-transparent"
        >
          {Array.from({ length: 12 }, (_, i) => {
            const h = (i + 1).toString().padStart(2, "0");
            return (
              <option key={h} value={h}>
                {h}
              </option>
            );
          })}
        </select>
        <span className="text-gray-500">:</span>
        <select
          value={minute}
          onChange={(e) => {
            setMinute(e.target.value);
            handleTimeChange(hour, e.target.value, period);
          }}
          className="px-3 py-2 bg-transparent"
        >
          {["00", "15", "30", "45"].map((m) => (
            <option key={m} value={m}>
              {m}
            </option>
          ))}
        </select>
        <select
          value={period}
          onChange={(e) => {
            const p = e.target.value as "AM" | "PM";
            setPeriod(p);
            handleTimeChange(hour, minute, p);
          }}
          className="px-3 py-2 bg-transparent text-sm"
        >
          <option value="AM">AM</option>
          <option value="PM">PM</option>
        </select>
      </div>
    </div>
  );
};

/* ---------------------------- Preview/Edit Modal --------------------------- */

interface TimePreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  slot: TimeSlot;
  dayName: string;
  date: string;
  onSave: (updatedSlot: TimeSlot) => void;
  isEditing?: boolean;
  onEdit?: () => void;
  onCancelEdit?: () => void;
}

const TimePreviewModal: React.FC<TimePreviewModalProps> = ({
  isOpen,
  onClose,
  slot,
  dayName,
  date,
  onSave,
  isEditing = false,
  onEdit,
  onCancelEdit
}) => {
  const [edited, setEdited] = useState<TimeSlot>(slot);
  useEffect(() => setEdited(slot), [slot]);
  if (!isOpen) return null;

  const dt = (s: string) => {
    const d = new Date(s);
    return {
      time: d.toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "2-digit",
        hour12: true
      }),
      date: d.toLocaleDateString("en-US", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric"
      })
    };
  };
  const s = dt(edited.start_time);
  const e = dt(edited.end_time);

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-[60] p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md">
        <div className="bg-gray-900 text-white p-6 rounded-t-2xl">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <Clock className="w-6 h-6" />
              <h3 className="text-xl font-bold">
                {isEditing ? "Edit Time Slot" : "Time Slot Preview"}
              </h3>
            </div>
            <button
              onClick={onClose}
              className="w-8 h-8 flex items-center justify-center text-gray-300 hover:text-white hover:bg-white/20 rounded-lg transition-all"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="p-6 space-y-4">
          <div className="text-center">
            <h4 className="text-lg font-semibold text-gray-800">{dayName}</h4>
            <p className="text-sm text-gray-600">{s.date}</p>
          </div>

          <div className="bg-gray-50 rounded-xl p-4 space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-gray-600">Time</span>
              <span className="text-lg font-bold text-gray-900">
                {s.time} - {e.time}
              </span>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-gray-600">
                Max Bookings
              </span>
              {isEditing ? (
                <input
                  type="number"
                  min={1}
                  value={edited.max_bookings}
                  onChange={(ev) =>
                    setEdited({
                      ...edited,
                      max_bookings: Number.parseInt(ev.target.value, 10) || 1
                    })
                  }
                  className="w-20 px-2 py-1 border border-gray-300 rounded-lg text-sm"
                />
              ) : (
                <span className="text-sm font-semibold text-gray-900">
                  {edited.max_bookings}
                </span>
              )}
            </div>

            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-gray-600">
                Female Doctors
              </span>
              {isEditing ? (
                <input
                  type="number"
                  min={0}
                  value={edited.female_doctors}
                  onChange={(ev) =>
                    setEdited({
                      ...edited,
                      female_doctors: Number.parseInt(ev.target.value, 10) || 0
                    })
                  }
                  className="w-20 px-2 py-1 border border-gray-300 rounded-lg text-sm"
                />
              ) : (
                <span className="text-sm font-semibold text-gray-900">
                  {edited.female_doctors}
                </span>
              )}
            </div>

            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-gray-600">
                Service Types
              </span>
              {isEditing ? (
                <div className="flex gap-4">
                  <label className="flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={edited.is_video_call}
                      onChange={(e) =>
                        setEdited({
                          ...edited,
                          is_video_call: e.target.checked
                        })
                      }
                      className="rounded text-gray-600 focus:ring-gray-500"
                    />
                    <span className="ml-2 text-xs text-gray-700">Video</span>
                  </label>
                  <label className="flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={edited.is_physical_visit}
                      onChange={(e) =>
                        setEdited({
                          ...edited,
                          is_physical_visit: e.target.checked
                        })
                      }
                      className="rounded text-gray-600 focus:ring-gray-500"
                    />
                    <span className="ml-2 text-xs text-gray-700">Physical</span>
                  </label>
                </div>
              ) : (
                <div className="flex gap-1">
                  {edited.is_video_call && (
                    <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full">
                      Video
                    </span>
                  )}
                  {edited.is_physical_visit && (
                    <span className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full">
                      Physical
                    </span>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="flex justify-between p-6 border-t border-gray-200">
          {isEditing ? (
            <>
              <button
                onClick={onCancelEdit}
                className="px-4 py-2 text-gray-700 bg-white hover:bg-gray-100 rounded-lg border border-gray-300"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  onSave(edited);
                  onClose();
                }}
                className="px-4 py-2 bg-gray-800 hover:bg-gray-900 text-white rounded-lg"
              >
                Save Changes
              </button>
            </>
          ) : (
            <>
              <button
                onClick={onClose}
                className="px-4 py-2 text-gray-700 bg-white hover:bg-gray-100 rounded-lg border border-gray-300"
              >
                Close
              </button>
              <button
                onClick={onEdit}
                className="px-4 py-2 bg-gray-800 hover:bg-gray-900 text-white rounded-lg flex items-center gap-2"
              >
                <Edit3 size={16} />
                Edit Slot
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

/* ------------------------------ Main Component ----------------------------- */

const BulkCreationModal: React.FC<BulkCreationModalProps> = ({
  showBulkForm,
  setShowBulkForm,
  currentPage,
  fetchSlots,
  showNotification
}) => {
  const [clinicInfo, setClinicInfo] = useState<any>(null);

  // Steps
  const [activeStep, setActiveStep] = useState(0);
  const [slotType, setSlotType] = useState<"PHYSICAL_OR_VIDEO" | "HOME_VISIT" | "">("");
  const [showBasicConfig, setShowBasicConfig] = useState(false);

  // Config
  const [femaleDoctors, setFemaleDoctors] = useState(2);
  const [maxBookings, setMaxBookings] = useState(6);
  const [isVideo, setIsVideo] = useState(true);
  const [isPhysical, setIsPhysical] = useState(true);
  const [startTime, setStartTime] = useState("09:00");
  const [endTime, setEndTime] = useState("17:00");
  const [timeGap, setTimeGap] = useState(1); // hours

  // Days & slots
  const [days, setDays] = useState<DaySlots[]>([]);
  const [selectedDayIndex, setSelectedDayIndex] = useState(0);

  const [selectedByDate, setSelectedByDate] = useState<
    Record<string, Set<number>>
  >({});

  // Copy
  const [copyDays, setCopyDays] = useState<
    { date: string; dayName: string; selected: boolean }[]
  >([]);
  const [copyForDays, setCopyForDays] = useState(0);

  // Review
  const [reviewDayIndex, setReviewDayIndex] = useState(0);
  const [previewSlot, setPreviewSlot] = useState<{
    slot: TimeSlot;
    dayName: string;
    date: string;
  } | null>(null);
  const [isEditingSlot, setIsEditingSlot] = useState(false);
  const [editingReviewSlot, setEditingReviewSlot] = useState<{
    dayDate: string;
    filteredSlotIndex: number;
  } | null>(null);

  const [templateDate, setTemplateDate] = useState<string | null>(null);

  /* ---------------------------- Initialization ---------------------------- */

  const resetAll = () => {
    setActiveStep(0);
    setSlotType("");
    setShowBasicConfig(false);
    setFemaleDoctors(2);
    setMaxBookings(6);
    setIsVideo(true);
    setIsPhysical(true);
    setStartTime("09:00");
    setEndTime("17:00");
    setTimeGap(1);

    setDays([]);
    setSelectedDayIndex(0);
    setSelectedByDate({});
    setCopyDays([]);
    setCopyForDays(0);

    setReviewDayIndex(0);
    setPreviewSlot(null);
    setIsEditingSlot(false);
    setEditingReviewSlot(null);
    setTemplateDate(null);
  };

  const getUserClinic = async () => {
    try {
      const res = await getClinicDataService();
      if (res.status === 200) setClinicInfo(res.data);
    } catch (err) {
      console.error("Clinic fetch error", err);
    }
  };

  useEffect(() => {
    getUserClinic();
  }, []);

  // Fresh init when modal opens; clean out when closed
  useEffect(() => {
    if (showBulkForm) {
      const base = new Date();
      base.setDate(base.getDate() + 1); // tomorrow
      const nextDays: DaySlots[] = [];
      for (let i = 0; i < 7; i++) {
        const d = new Date(base);
        d.setDate(base.getDate() + i);
        const dayName = d.toLocaleDateString("en-US", { weekday: "long" });
        const dateStr = localDateStr(d); // local date string avoids UTC shift
        nextDays.push({
          date: dateStr,
          dayName,
          slots: generateTimeSlots(dateStr, startTime, endTime, timeGap, {
            maxBookings,
            femaleDoctors,
            isVideo,
            isPhysical
          })
        });
      }
      setDays(nextDays);
      setSelectedDayIndex(0);
      setSelectedByDate({});
      setActiveStep(0);
      setShowBasicConfig(false);
      setPreviewSlot(null);
      setIsEditingSlot(false);
      setEditingReviewSlot(null);
      setCopyDays([]);
      setCopyForDays(0);
      setReviewDayIndex(0);
      setTemplateDate(nextDays[0]?.date ?? null); // default template is first day (tomorrow)
    } else {
      resetAll();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [showBulkForm]);

  // Regenerate day slots when config changes while on Configure step
  useEffect(() => {
    if (!showBulkForm) return;
    if (activeStep !== 1 || !slotType) return;

    const updated = days.map((day) => ({
      ...day,
      slots: generateTimeSlots(day.date, startTime, endTime, timeGap, {
        maxBookings,
        femaleDoctors,
        isVideo,
        isPhysical
      })
    }));
    setDays(updated);
    // Clear selections for regenerated slots
    setSelectedByDate({});
    setTemplateDate(updated[selectedDayIndex]?.date ?? null); // remember template date
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    activeStep,
    slotType,
    startTime,
    endTime,
    timeGap,
    maxBookings,
    femaleDoctors,
    isVideo,
    isPhysical
  ]);

  useEffect(() => {
    if (activeStep === 2) {
      setCopyDays(
        days.map((d) => ({ date: d.date, dayName: d.dayName, selected: false }))
      );
      setReviewDayIndex(0);
    }
  }, [activeStep, days, selectedDayIndex, templateDate]);

  /* --------------------------- Slot Generation ---------------------------- */

  const generateTimeSlots = (
    date: string,
    start: string,
    end: string,
    gapHours: number,
    cfg: {
      maxBookings: number;
      femaleDoctors: number;
      isVideo: boolean;
      isPhysical: boolean;
    }
  ): TimeSlot[] => {
    const slots: TimeSlot[] = [];
    const [sh, sm] = start.split(":").map(Number);
    const [eh, em] = end.split(":").map(Number);
    const startM = sh * 60 + sm;
    const endM = eh * 60 + em;
    const slotDuration = 60;
    const gapDuration = gapHours * 60;

    let t = startM;
    while (t + slotDuration <= endM) {
      const sHour = Math.floor(t / 60);
      const sMin = t % 60;
      const eHour = Math.floor((t + slotDuration) / 60);
      const eMin = (t + slotDuration) % 60;

      const startStr = `${sHour.toString().padStart(2, "0")}:${sMin
        .toString()
        .padStart(2, "0")}`;
      const endStr = `${eHour.toString().padStart(2, "0")}:${eMin
        .toString()
        .padStart(2, "0")}`;

      const startDate = createLocalDate(date, startStr);
      const endDate = createLocalDate(date, endStr);

      slots.push({
        start_time: startDate.toISOString(),
        end_time: endDate.toISOString(),
        max_bookings: cfg.maxBookings,
        female_doctors: cfg.femaleDoctors,
        is_video_call: cfg.isVideo,
        is_physical_visit: cfg.isPhysical
      });

      t = t + slotDuration + gapDuration;
    }
    return slots;
  };

  /* ------------------------------ Selections ------------------------------ */

  const currentDay = days[selectedDayIndex];

  const isSelected = (dayIndex: number, slotIndex: number) => {
    const date = days[dayIndex]?.date;
    if (!date) return false;
    return selectedByDate[date]?.has(slotIndex) ?? false;
  };

  const toggleSelection = (dayIndex: number, slotIndex: number) => {
    const date = days[dayIndex]?.date;
    if (!date) return;
    setSelectedByDate((prev) => {
      const clone: Record<string, Set<number>> = { ...prev };
      const set = new Set<number>(prev[date] ?? []);
      if (set.has(slotIndex)) set.delete(slotIndex);
      else set.add(slotIndex);
      clone[date] = set;
      return clone;
    });
  };

  const countSelectedForDay = (dayIndex: number) => {
    const date = days[dayIndex]?.date;
    if (!date) return 0;
    return selectedByDate[date]?.size ?? 0;
  };

  /* --------------------------- Copy/Apply Helpers -------------------------- */

  const handleCopyDaySelect = (index: number) => {
    if (copyDays[index].selected) {
      setCopyDays((prev) => {
        const next = [...prev];
        next[index].selected = false;
        return next;
      });
    } else {
      setCopyDays((prev) => {
        const next = [...prev];
        next[index].selected = true;
        return next;
      });
    }
  };

  const applyForNDays = () => {
    if (copyForDays <= 0) return;
    if (!days[selectedDayIndex]) return;

    const templateDay = days[selectedDayIndex];
    const selectedSet = selectedByDate[templateDay.date];
    const templateSlots =
      selectedSet && selectedSet.size > 0
        ? templateDay.slots.filter((_, i) => selectedSet.has(i))
        : templateDay.slots;

    const base = new Date();
    base.setDate(base.getDate() + 1); // tomorrow

    const updated = [...days];
    const newSelections = { ...selectedByDate };
    const newCopyDays = [...copyDays];

    for (let i = 0; i < copyForDays; i++) {
      const d = new Date(base);
      d.setDate(base.getDate() + i);
      const dateStr = localDateStr(d); // local date string
      const dayName = d.toLocaleDateString("en-US", { weekday: "long" });

      let idx = updated.findIndex((x) => x.date === dateStr);
      if (idx === -1) {
        updated.push({ date: dateStr, dayName, slots: [] });
        idx = updated.length - 1;
      }

      updated[idx].slots = templateSlots.map((slot) => ({
        ...slot,
        start_time: slot.start_time.replace(
          /^\d{4}-\d{2}-\d{2}T/,
          `${dateStr}T`
        ),
        end_time: slot.end_time.replace(/^\d{4}-\d{2}-\d{2}T/, `${dateStr}T`)
      }));

      // Auto-populate selections for copied days based on template
      if (selectedSet && selectedSet.size > 0) {
        newSelections[dateStr] = new Set(selectedSet);
      } else {
        // If template has no explicit selections, clear any existing selections for this day
        delete newSelections[dateStr];
      }

      // Mark this day as selected in copyDays
      const copyDayIndex = newCopyDays.findIndex((cd) => cd.date === dateStr);
      if (copyDayIndex !== -1) {
        newCopyDays[copyDayIndex].selected = true;
      }
    }

    setDays(updated);
    setSelectedByDate(newSelections);
    setCopyDays(newCopyDays); // Update copyDays to mark the applied days as selected
  };

  /* ---------------------------- Edit & Time Logic -------------------------- */

  const handleDaySelect = (index: number) => {
    setSelectedDayIndex(index);
    // update template date when day selection changes
    setTemplateDate(days[index]?.date ?? null);
  };

  const handleEditSlot = (index: number) => {
    // editing via modal handled in Review; inline editing placeholder
    // no-op
  };

  const removeSlot = (index: number) => {
    const updated = [...days];
    const day = updated[selectedDayIndex];
    day.slots.splice(index, 1);
    setDays(updated);

    const date = day.date;
    setSelectedByDate((prev) => {
      const set = prev[date] ? new Set(prev[date]) : undefined;
      if (!set) return prev;
      const nextSet = new Set<number>();
      for (const s of set) {
        if (s === index) continue;
        nextSet.add(s > index ? s - 1 : s);
      }
      return { ...prev, [date]: nextSet };
    });
  };

  /* ---------------------------- Review Lists ----------------------------- */

  const reviewDayList = useMemo(() => {
    const selectedDates = copyDays.filter((d) => d.selected).map((d) => d.date);
    // exclude template day and only include selected copy days
    return days.filter((d) => selectedDates.includes(d.date));
  }, [copyDays, days]);

  // FIXED: Properly handle slot filtering for review
  const getFilteredSlotsForDay = (day: DaySlots) => {
    if (!day) return [];
    
    // 1. First check if this specific day has slot selections
    const sel = selectedByDate[day.date];
    if (sel && sel.size > 0) return day.slots.filter((_, i) => sel.has(i));

    // 2. If no specific selections for this day, check template day selections
    const tmpl = templateDate ?? days[selectedDayIndex]?.date;
    const tmplSel = tmpl ? selectedByDate[tmpl] : undefined;
    if (tmplSel && tmplSel.size > 0) {
      return day.slots.filter((_, i) => tmplSel.has(i));
    }

    // 3. If neither has explicit selections, return ALL slots for this day
    // This is the key fix - don't return empty array
    return day.slots;
  };

  // Map filtered index back to original index for edit/delete mappings
  const mapFilteredToOriginalIndex = (day: DaySlots, filteredIndex: number) => {
    const sel = selectedByDate[day.date];
    if (!sel || sel.size === 0) {
      const tmpl = templateDate ?? days[selectedDayIndex]?.date;
      const tmplSel = tmpl ? selectedByDate[tmpl] : undefined;
      if (!tmplSel || tmplSel.size === 0) return filteredIndex;
      const indices = day.slots.map((_, i) => i).filter((i) => tmplSel.has(i));
      return indices[filteredIndex] ?? filteredIndex;
    }
    const indices = day.slots.map((_, i) => i).filter((i) => sel.has(i));
    return indices[filteredIndex] ?? filteredIndex;
  };

  const deleteSlotInReview = (
    dayIdxInReview: number,
    filteredSlotIndex: number
  ) => {
    const day = reviewDayList[dayIdxInReview];
    if (!day) return;

    const originalDayIdx = days.findIndex((d) => d.date === day.date);
    if (originalDayIdx === -1) return;

    const originalIndex = mapFilteredToOriginalIndex(
      days[originalDayIdx],
      filteredSlotIndex
    );

    // Remove from underlying days
    const updated = [...days];
    updated[originalDayIdx].slots.splice(originalIndex, 1);
    setDays(updated);

    // Update selection map indices
    const date = day.date;
    setSelectedByDate((prev) => {
      const set = prev[date] ? new Set(prev[date]) : undefined;
      if (!set) return prev;
      const nextSet = new Set<number>();
      for (const s of set) {
        if (s === originalIndex) continue;
        nextSet.add(s > originalIndex ? s - 1 : s);
      }
      return { ...prev, [date]: nextSet };
    });
  };

  const navigateReviewDay = (dir: "prev" | "next") => {
    if (dir === "prev" && reviewDayIndex > 0) setReviewDayIndex((p) => p - 1);
    if (dir === "next" && reviewDayIndex < reviewDayList.length - 1)
      setReviewDayIndex((p) => p + 1);
  };

  const handleTimePreview = (
    slot: TimeSlot,
    dayName: string,
    date: string,
    dayIdxInReview: number,
    filteredSlotIndex: number
  ) => {
    setPreviewSlot({ slot, dayName, date });
    setEditingReviewSlot({ dayDate: date, filteredSlotIndex });
  };

  const handleSaveEditedSlot = (updatedSlot: TimeSlot) => {
    if (!editingReviewSlot) return;
    const dayDate = editingReviewSlot.dayDate;
    const dayIdx = days.findIndex((d) => d.date === dayDate);
    if (dayIdx === -1) return;

    const filteredIndex = editingReviewSlot.filteredSlotIndex;
    const originalIndex = mapFilteredToOriginalIndex(
      days[dayIdx],
      filteredIndex
    );

    const updated = [...days];
    updated[dayIdx].slots[originalIndex] = updatedSlot;
    setDays(updated);
  };

  /* ------------------------------ Submit -------------------------------- */

  const submitBulkSlots = async () => {
    try {
      const selectedDates = copyDays
        .filter((d) => d.selected)
        .map((d) => d.date);
      const daysToSubmit = days.filter((d) => selectedDates.includes(d.date));

      const tmpl = templateDate ?? days[selectedDayIndex]?.date;
      const tmplSel = tmpl ? selectedByDate[tmpl] : undefined;

      if (
        (!tmplSel || tmplSel.size === 0) &&
        Object.values(selectedByDate).every((s) => !s || s.size === 0)
      ) {
        showNotification(
          "warning",
          "Please select at least one slot on the template day."
        );
        return;
      }
      if (daysToSubmit.length === 0) {
        showNotification(
          "warning",
          "Please select at least one day to copy to."
        );
        return;
      }

      const allSlots: any[] = [];
      daysToSubmit.forEach((day) => {
        const daySel = selectedByDate[day.date];
        const indices =
          daySel && daySel.size > 0
            ? day.slots
              .map((_, i) => (daySel.has(i) ? i : -1))
              .filter((i) => i >= 0)
            : tmplSel
              ? day.slots
                .map((_, i) => (tmplSel.has(i) ? i : -1))
                .filter((i) => i >= 0)
              : [];

        // FIXED: If no explicit selections, use all slots for the day
        const finalIndices = indices.length > 0 ? indices : day.slots.map((_, i) => i);

        finalIndices.forEach((i) => {
          const slot = day.slots[i];
          const slotData: any = {
            start_time: formatLocalNaiveForApi(slot.start_time),
            end_time: formatLocalNaiveForApi(slot.end_time),
            max_bookings: slot.max_bookings,
            female_doctor_count: slot.female_doctors
          };
          if (slotType === "HOME_VISIT") {
            slotData.is_home_visit = "true";
            slotData.is_video_call = "false";
            slotData.is_physical_visit = "false";
          } else {
            slotData.is_home_visit = "false";
            slotData.is_video_call = slot.is_video_call ? "true" : "false";
            slotData.is_physical_visit = slot.is_physical_visit
              ? "true"
              : "false";
          }
          allSlots.push(slotData);
        });
      });

      if (allSlots.length === 0) {
        showNotification("warning", "No slots selected to submit.");
        return;
      }

      if (!clinicInfo?.uuid) {
        showNotification("error", "Clinic information is missing.");
        return;
      }

      const payload = {
        clinic: clinicInfo.uuid,
        slot_type: slotType,
        slot_list: allSlots
      };

      console.log(payload, 'submission data')

      await createClinicBlukSlot(payload);
      showNotification("success", "Slots created successfully");

      resetAll();
      setShowBulkForm(false);
      fetchSlots(currentPage);
    } catch (error: any) {
      console.error("Error creating bulk slots:", error);
      let errorMessage = "Failed to create slots";
      if (error?.response?.data) {
        const data = error.response.data;
        if (Array.isArray(data.slot_list)) {
          const messages: string[] = [];
          data.slot_list.forEach((item: any) => {
            if (
              item?.non_field_errors &&
              Array.isArray(item.non_field_errors)
            ) {
              messages.push(...item.non_field_errors);
            }
          });
          if (messages.length > 0) errorMessage = messages.join(", ");
        } else if (data.detail) errorMessage = data.detail;
        else if (data.message) errorMessage = data.message;
        else if (Array.isArray(data)) errorMessage = data.join(", ");
        else if (typeof data === "object") {
          const firstKey = Object.keys(data)[0];
          if (firstKey) {
            const firstError = data[firstKey];
            if (Array.isArray(firstError)) errorMessage = firstError[0];
            else if (typeof firstError === "string") errorMessage = firstError;
          }
        }
      } else if (error?.message) {
        errorMessage = error.message;
      }
      showNotification("error", errorMessage);
    }
  };

  /* --------------------------------- UI ----------------------------------- */

  if (!showBulkForm) return null;

  const steps = [
    {
      id: 0,
      title: "Setup",
      subtitle: "Choose slot type",
      icon: <Settings className="w-6 h-6" />
    },
    {
      id: 1,
      title: "Configure",
      subtitle: "Set up time slots",
      icon: <Calendar className="w-6 h-6" />
    },
    {
      id: 2,
      title: "Copy",
      subtitle: "Apply to multiple days",
      icon: <Copy className="w-6 h-6" />
    },
    {
      id: 3,
      title: "Review",
      subtitle: "Create slots",
      icon: <CheckCircle className="w-6 h-6" />
    }
  ];

  const canGoNext =
    (activeStep === 0 && showBasicConfig) ||
    (activeStep === 1 && slotType) ||
    activeStep === 2 ||
    activeStep === 3;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-2 sm:p-4">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-5xl max-h-[95vh] overflow-y-auto flex flex-col">
        {/* Header */}
        <div className="bg-primaryColor text-white p-6 rounded-t-3xl">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-bold">Bulk Create Slots</h2>
              <p className="text-gray-300 mt-1">
                Create multiple appointment slots efficiently
              </p>
            </div>
            <button
              onClick={() => {
                resetAll();
                setShowBulkForm(false);
              }}
              className="w-10 h-10 flex items-center justify-center text-gray-300 hover:text-white hover:bg-white/20 rounded-xl"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Stepper */}
        <div className="px-8 py-4 pt-6 bg-gray-50 border-b border-gray-200">
          <div className="flex justify-between items-center relative">
            <div className="absolute top-6 left-0 right-0 h-0.5 bg-gray-200">
              <div
                className="h-full bg-gray-800 transition-all"
                style={{ width: `${(activeStep / (steps.length - 1)) * 100}%` }}
              />
            </div>
            {steps.map((step, i) => (
              <div
                key={step.id}
                className="flex flex-col items-center relative z-10"
              >
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center text-lg font-bold transition-all ${activeStep === i
                    ? "bg-primaryColor text-white shadow-lg scale-110"
                    : i < activeStep
                      ? "bg-primaryColor text-white shadow-md"
                      : "bg-white border-2 border-gray-300 text-gray-400"
                    }`}
                >
                  {i < activeStep ? <Check size={20} /> : step.icon}
                </div>
                <div className="mt-2 text-center">
                  <div
                    className={`font-semibold text-sm ${activeStep === i
                      ? "text-gray-800"
                      : i < activeStep
                        ? "text-gray-600"
                        : "text-gray-500"
                      }`}
                  >
                    {step.title}
                  </div>
                  <div className="text-xs text-gray-500 mt-1 max-w-[200px]">
                    {step.subtitle}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="p-8 space-y-8 flex-1 overflow-y-auto">
          {/* Step 0 */}
          {activeStep === 0 && (
            <div className="space-y-8">
              {!showBasicConfig ? (
                <div className="space-y-4">
                  <div className="text-center mb-6">
                    <h3 className="text-2xl font-bold text-gray-800 mb-2">
                      Choose Your Slot Type
                    </h3>
                    <p className="text-gray-600">
                      Select the type of appointment slots you want to create
                    </p>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div
                      onClick={() => {
                        setSlotType("PHYSICAL_OR_VIDEO");
                        setShowBasicConfig(true);
                      }}
                      className="p-8 rounded-2xl border-2 border-gray-200 hover:border-gray-400 cursor-pointer transition-all hover:shadow-lg group"
                    >
                      <div className="text-center">
                        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-gray-200">
                          <span className="text-2xl">🏥</span>
                        </div>
                        <h4 className="text-xl font-bold text-gray-800 mb-2">
                          Physical or Video
                        </h4>
                        <p className="text-gray-600 text-sm">
                          At clinic or via video call
                        </p>
                      </div>
                    </div>
                    <div
                      onClick={() => {
                        setSlotType("HOME_VISIT");
                        setShowBasicConfig(true);
                      }}
                      className="p-8 rounded-2xl border-2 border-gray-200 hover:border-gray-400 cursor-pointer transition-all hover:shadow-lg group"
                    >
                      <div className="text-center">
                        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-gray-200">
                          <span className="text-2xl">🏠</span>
                        </div>
                        <h4 className="text-xl font-bold text-gray-800 mb-2">
                          Home Visit
                        </h4>
                        <p className="text-gray-600 text-sm">
                          Doctor visits patient at home
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="space-y-6">
                  <div className="text-center mb-6">
                    <h3 className="text-2xl font-bold text-gray-800 mb-2">
                      Basic Configuration
                    </h3>
                    <p className="text-gray-600">
                      Set up your slot preferences and operating hours
                    </p>
                  </div>

                  <div className="bg-gray-50 p-6 rounded-2xl space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="block text-sm font-semibold text-gray-700">
                          Female Doctors Available
                        </label>
                        <input
                          type="number"
                          min={0}
                          max={10}
                          value={femaleDoctors}
                          onChange={(e) =>
                            setFemaleDoctors(
                              Number.parseInt(e.target.value, 10) || 0
                            )
                          }
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="block text-sm font-semibold text-gray-700">
                          Max Bookings per Slot
                        </label>
                        <input
                          type="number"
                          min={1}
                          max={20}
                          value={maxBookings}
                          onChange={(e) =>
                            setMaxBookings(
                              Number.parseInt(e.target.value, 10) || 1
                            )
                          }
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl"
                        />
                      </div>
                    </div>

                    {slotType === "PHYSICAL_OR_VIDEO" && (
                      <div className="mt-6">
                        <label className="block text-sm font-semibold text-gray-700 mb-3">
                          Service Types Available
                        </label>
                        <div className="flex gap-6">
                          <label className="flex items-center cursor-pointer group">
                            <input
                              type="checkbox"
                              checked={isVideo}
                              onChange={(e) => setIsVideo(e.target.checked)}
                              className="w-5 h-5 rounded text-gray-600 focus:ring-gray-500"
                            />
                            <span className="ml-3 text-gray-700">
                              Video Consultation
                            </span>
                          </label>
                          <label className="flex items-center cursor-pointer group">
                            <input
                              type="checkbox"
                              checked={isPhysical}
                              onChange={(e) => setIsPhysical(e.target.checked)}
                              className="w-5 h-5 rounded text-gray-600 focus:ring-gray-500"
                            />
                            <span className="ml-3 text-gray-700">
                              Physical Visit
                            </span>
                          </label>
                        </div>
                      </div>
                    )}

                    <div className="mt-6">
                      <h5 className="text-sm font-semibold text-gray-700 mb-4">
                        Operating Hours
                      </h5>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <label className="block text-sm font-medium text-gray-600">
                            Start Time
                          </label>
                          <TimePicker
                            value={startTime}
                            onChange={setStartTime}
                            className="w-full"
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="block text-sm font-medium text-gray-600">
                            End Time
                          </label>
                          <TimePicker
                            value={endTime}
                            onChange={setEndTime}
                            className="w-full"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="mt-6">
                      <h5 className="text-sm font-semibold text-gray-700 mb-4">
                        Slot Duration
                      </h5>
                      <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-600">
                          Time Gap (Hours)
                        </label>
                        <select
                          value={timeGap}
                          onChange={(e) =>
                            setTimeGap(Number.parseInt(e.target.value, 10))
                          }
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl"
                        >
                          {[0, 1, 2, 3, 4, 5].map((h) => (
                            <option key={h} value={h}>
                              {h} hour{h > 1 ? "s" : ""}
                            </option>
                          ))}
                        </select>
                        <p className="text-xs text-gray-500">
                          Duration between slots
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Step 1 */}
          {activeStep === 1 && (
            <div className="space-y-6">
              <div className="text-center mb-6">
                <h3 className="text-2xl font-bold text-gray-800 mb-2">
                  Configure  Slots
                </h3>
                <p className="text-gray-600">
                  Set up your appointment slots for each day
                </p>
              </div>

              <div className="bg-gray-50 p-6 rounded-2xl">
                {/* Days */}
                <div className="flex gap-4 overflow-x-auto pb-4 mb-6">
                  {days.slice(0, 1).map((day, index) => (
                    <div
                      key={day.date}
                      onClick={() => handleDaySelect(index)}
                      className={`min-w-[110px] p-4 rounded-xl border-2 flex flex-col items-center cursor-pointer transition-all ${selectedDayIndex === index
                        ? "border-gray-800 bg-gray-100 shadow-md"
                        : "border-gray-200 hover:border-gray-400"
                        }`}
                    >
                      <span className="font-bold text-gray-800">
                        {day.dayName.substring(0, 3)}
                      </span>
                      <span className="text-sm text-gray-600 mt-1">
                        {day.date.split("-")[2]}
                      </span>
                      <span className="text-xs text-gray-500 mt-1">
                        {day.slots.length} slots
                      </span>
                    </div>
                  ))}
                </div>

                <div className="flex justify-between items-center mb-6">
                  <div className="text-sm text-gray-600">
                    {countSelectedForDay(selectedDayIndex)} slots selected
                  </div>
                  {/* <div className="flex items-center gap-2">
                    <button
                      onClick={addNewSlot}
                      className="px-3 py-2 bg-gray-800 hover:bg-gray-900 text-white rounded-lg text-sm flex items-center gap-2"
                    >
                      <Plus size={16} />
                      Add Slot
                    </button>
                  </div> */}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {currentDay?.slots.map((slot, index) => {
                    const start = new Date(slot.start_time);
                    const end = new Date(slot.end_time);
                    const startTime12 = to12Hour(
                      start.toTimeString().substring(0, 5)
                    );
                    const endTime12 = to12Hour(
                      end.toTimeString().substring(0, 5)
                    );
                    const selected = isSelected(selectedDayIndex, index);

                    return (
                      <div
                        key={`${currentDay.date}-${index}`}
                        className={`p-4 border-2 rounded-xl relative cursor-pointer transition-all ${selected
                          ? "border-gray-800 bg-gray-100 shadow-md"
                          : "border-gray-200 hover:border-gray-400 bg-white"
                          }`}
                        onClick={() => toggleSelection(selectedDayIndex, index)}
                      >
                        {selected && (
                          <div className="absolute top-2 right-2 w-6 h-6 bg-gray-800 text-white rounded-full flex items-center justify-center">
                            <Check size={14} />
                          </div>
                        )}

                        <div className="font-bold text-lg text-gray-800">
                          {startTime12} - {endTime12}
                        </div>

                        <div className="text-sm text-gray-600 mt-2 space-y-1">
                          <div>
                            Max Bookings:{" "}
                            <span className="font-medium">
                              {slot.max_bookings}
                            </span>
                          </div>
                          <div>
                            Female Doctors:{" "}
                            <span className="font-medium">
                              {slot.female_doctors}
                            </span>
                          </div>
                          {slotType === "PHYSICAL_OR_VIDEO" && (
                            <div className="flex gap-2 mt-2">
                              {slot.is_video_call && (
                                <span className="px-2 py-1 bg-gray-200 text-gray-700 text-xs rounded-full">
                                  Video
                                </span>
                              )}
                              {slot.is_physical_visit && (
                                <span className="px-2 py-1 bg-gray-300 text-gray-800 text-xs rounded-full">
                                  Physical
                                </span>
                              )}
                            </div>
                          )}
                        </div>

                        <div className="absolute bottom-3 right-3 flex gap-2">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              removeSlot(index);
                            }}
                            title="Delete"
                            className="text-red-600 hover:text-red-800 p-1 rounded-lg hover:bg-red-50"
                          >
                            <Trash2 size={16} />
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleEditSlot(index);
                            }}
                            title="Edit"
                            className="text-gray-400 hover:text-gray-600 p-1 rounded-lg hover:bg-gray-100"
                          >
                            <Edit3 size={16} />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* Step 2 */}
          {activeStep === 2 && (
            <div className="space-y-6">
              <div className="text-center mb-6">
                <h3 className="text-2xl font-bold text-gray-800 mb-2">
                  Copy to Other Days
                </h3>
                <p className="text-gray-600">
                  Apply your slot configuration to multiple days
                </p>
              </div>

              <div className="bg-gray-50 p-6 rounded-2xl mb-6">
                <div className="flex items-center gap-3 mb-2">
                  <Copy className="w-5 h-5 text-gray-600" />
                  <h4 className="font-semibold text-gray-800">
                    Template Source
                  </h4>
                </div>
                <p className="text-gray-700">
                  Copy the slot configuration from{" "}
                  <strong>{days[selectedDayIndex]?.dayName}</strong> to other
                  days
                </p>
              </div>

              <div className="space-y-6">
                <div>
                  <h4 className="font-semibold text-gray-800 mb-4">
                    Select Days to Copy To
                  </h4>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                    {copyDays.map((day, index) => (
                      <div
                        key={day.date}
                        onClick={() => handleCopyDaySelect(index)}
                        className={`p-4 rounded-xl border-2 flex flex-col items-center cursor-pointer transition-all ${day.selected
                          ? "border-gray-800 bg-gray-100 shadow-md"
                          : "border-gray-200 hover:border-gray-300 hover:shadow-md"
                          }`}
                      >
                        <span className="text-sm font-bold text-gray-800">
                          {day.dayName}
                        </span>
                        <span className="text-xs text-gray-500 mt-1">
                          {day.date}
                        </span>
                        {day.selected && (
                          <div className="mt-2 w-6 h-6 bg-gray-800 rounded-full flex items-center justify-center">
                            <Check size={14} className="text-white" />
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="border-t pt-6">
                  <h4 className="font-semibold text-gray-800 mb-4">
                    Or Apply for Multiple Days
                  </h4>
                  <div className="flex items-center gap-4">
                    <input
                      type="number"
                      min={1}
                      max={30}
                      value={copyForDays}
                      onChange={(e) =>
                        setCopyForDays(Number.parseInt(e.target.value, 10) || 0)
                      }
                      placeholder="Number of days"
                      className="flex-1 px-4 py-3 border border-gray-300 rounded-xl"
                    />
                    <button
                      onClick={applyForNDays}
                      className="px-6 py-3 bg-primaryColor text-white rounded-xl"
                    >
                      Apply
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Step 3 */}
          {activeStep === 3 && (
            <div className="space-y-6">
              <div className="text-center mb-6">
                <h3 className="text-2xl font-bold text-gray-800 mb-2">
                  Review & Confirm
                </h3>
                <p className="text-gray-600">
                  Review all slots before creating them
                </p>
              </div>

              <div className="space-y-6">
                <div className="bg-gray-50 p-6 rounded-2xl">
                  <h4 className="font-semibold text-gray-800 mb-4">Summary</h4>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div>
                      <span className="text-gray-600">Total Days:</span>
                      <span className="font-semibold text-gray-800 ml-2">
                        {reviewDayList.length}
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-600">Total Slots:</span>
                      <span className="font-semibold text-gray-800 ml-2">
                        {reviewDayList.reduce(
                          (sum, d) => sum + getFilteredSlotsForDay(d).length,
                          0
                        )}
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-600">Slot Type:</span>
                      <span className="font-semibold text-gray-800 ml-2">
                        {slotType === "PHYSICAL_OR_VIDEO"
                          ? "Physical/Video"
                          : "Home Visit"}
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-600">Max Bookings:</span>
                      <span className="font-semibold text-gray-800 ml-2">
                        {maxBookings}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="bg-white border border-gray-200 rounded-2xl p-6">
                  <div className="flex items-center justify-between mb-6">
                    <button
                      onClick={() => navigateReviewDay("prev")}
                      disabled={reviewDayIndex === 0}
                      className="p-2 rounded-lg border border-gray-300 hover:bg-gray-100 disabled:opacity-50"
                    >
                      <ChevronLeft size={20} className="text-gray-600" />
                    </button>

                    <div className="text-center">
                      <h4 className="font-semibold text-gray-800 flex items-center gap-2 justify-center">
                        <span>{reviewDayList[reviewDayIndex]?.dayName}</span>
                        <span className="text-sm text-gray-500">
                          ({reviewDayList[reviewDayIndex]?.date})
                        </span>
                      </h4>
                      <p className="text-xs text-gray-500 mt-1">
                        Day {reviewDayIndex + 1} of {reviewDayList.length} •{" "}
                        {
                          getFilteredSlotsForDay(reviewDayList[reviewDayIndex]!)
                            .length
                        }{" "}
                        slots
                      </p>
                    </div>

                    <button
                      onClick={() => navigateReviewDay("next")}
                      disabled={reviewDayIndex === reviewDayList.length - 1}
                      className="p-2 rounded-lg border border-gray-300 hover:bg-gray-100 disabled:opacity-50"
                    >
                      <ChevronRight size={20} className="text-gray-600" />
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                    {getFilteredSlotsForDay(
                      reviewDayList[reviewDayIndex] || {
                        date: "",
                        dayName: "",
                        slots: []
                      }
                    ).map((slot, filteredIdx) => (
                      <div
                        key={`${reviewDayList[reviewDayIndex]?.date}-${filteredIdx}`}
                        className="p-4 bg-gray-50 rounded-xl border border-gray-200 hover:border-gray-300 group relative"
                      >
                        <div className="flex items-center justify-between">
                          <div
                            className="flex-1 cursor-pointer"
                            onClick={() =>
                              handleTimePreview(
                                slot,
                                reviewDayList[reviewDayIndex]!.dayName,
                                reviewDayList[reviewDayIndex]!.date,
                                reviewDayIndex,
                                filteredIdx
                              )
                            }
                          >
                            <div className="flex items-center gap-2">
                              <Clock size={16} className="text-gray-500" />
                              <span className="font-semibold text-gray-800">
                                {formatTimeForDisplay(slot.start_time)} -{" "}
                                {formatTimeForDisplay(slot.end_time)}
                              </span>
                            </div>
                            <div className="text-xs text-gray-600 mt-1">
                              Max: {slot.max_bookings} | Female:{" "}
                              {slot.female_doctors}
                            </div>
                            {slotType === "PHYSICAL_OR_VIDEO" && (
                              <div className="flex gap-1 mt-2">
                                {slot.is_video_call && (
                                  <span className="px-2 py-1 bg-gray-200 text-gray-700 text-xs rounded-full">
                                    Video
                                  </span>
                                )}
                                {slot.is_physical_visit && (
                                  <span className="px-2 py-1 bg-gray-300 text-gray-800 text-xs rounded-full">
                                    Physical
                                  </span>
                                )}
                              </div>
                            )}
                          </div>

                          <Eye
                            size={16}
                            className="text-gray-400 group-hover:text-gray-600 cursor-pointer"
                            onClick={() =>
                              handleTimePreview(
                                slot,
                                reviewDayList[reviewDayIndex]!.dayName,
                                reviewDayList[reviewDayIndex]!.date,
                                reviewDayIndex,
                                filteredIdx
                              )
                            }
                          />
                        </div>

                        <button
                          onClick={() =>
                            deleteSlotInReview(reviewDayIndex, filteredIdx)
                          }
                          className="absolute top-2 right-2 text-red-500 hover:text-red-700 p-1 rounded-lg hover:bg-red-50"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex justify-between p-6 border-t border-gray-200 bg-gray-50 rounded-b-3xl">
          <button
            onClick={() => {
              if (activeStep === 0 && showBasicConfig)
                setShowBasicConfig(false);
              else setActiveStep((p) => Math.max(0, p - 1));
            }}
            disabled={activeStep === 0 && !showBasicConfig}
            className="px-8 py-3 text-gray-700 bg-white hover:bg-gray-100 rounded-xl font-semibold disabled:opacity-50 flex items-center gap-2 border border-gray-200"
          >
            <ChevronLeft size={18} />
            Previous
          </button>

          {activeStep < 3 ? (
            <button
              onClick={() => setActiveStep((p) => Math.min(3, p + 1))}
              disabled={!canGoNext || (activeStep === 0 && !showBasicConfig)}
              className="px-8 py-3 bg-primaryColor text-white rounded-xl font-semibold disabled:opacity-50 flex items-center gap-2"
            >
              Next
              <ChevronRight size={18} />
            </button>
          ) : (
            <button
              onClick={submitBulkSlots}
              className="px-8 py-3 bg-primaryColor text-white rounded-xl font-semibold flex items-center gap-2"
            >
              <Save size={18} />
              Create All Slots
            </button>
          )}
        </div>
      </div>

      {previewSlot && editingReviewSlot && (
        <TimePreviewModal
          isOpen={!!previewSlot}
          onClose={() => {
            setPreviewSlot(null);
            setIsEditingSlot(false);
          }}
          slot={previewSlot.slot}
          dayName={previewSlot.dayName}
          date={previewSlot.date}
          onSave={handleSaveEditedSlot}
          isEditing={isEditingSlot}
          onEdit={() => setIsEditingSlot(true)}
          onCancelEdit={() => setIsEditingSlot(false)}
        />
      )}
    </div>
  );
};

export default BulkCreationModal;