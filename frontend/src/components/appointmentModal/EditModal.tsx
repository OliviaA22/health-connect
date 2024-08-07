import React, { useState, useEffect, useCallback } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { Appointment, Patient, Doctor, Availability } from "../Types";
import axiosInstance from "../../axios/Axios";

// Define the props for the EditAppointmentModal component
interface EditAppointmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (appointment: Appointment) => void;
  appointment: Appointment;
}

// Define appointment reasons
const appointmentReasons = {
  "Regular consultation": [
    "Routine Check-up",
    "Diagnostic appointment",
    "Follow Up appointment",
    "Non-urgent medical issue",
    "Other",
  ],
  "Acute Consultation": [
    "Sudden worsening of chronic condition",
    "Acute infection",
    "Acute pain",
  ],
  "Preventive Health Check-Ups": [
    "Annual Health Check-Up",
    "Cancer Screening",
    "Well-Child Visit",
    "Vaccination appointment",
    "Other",
  ],
};

// Define the EditAppointmentModal component
const EditAppointmentModal: React.FC<EditAppointmentModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  appointment,
}) => {
  // Define state variables
  const [patients, setPatients] = useState<Patient[]>([]);
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [availabilities, setAvailabilities] = useState<Availability[]>([]);
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [appointmentReasonCategory, setAppointmentReasonCategory] =
    useState<string>("");
  const [appointmentReasonSubcategory, setAppointmentReasonSubcategory] =
    useState<string>("");
  const [bookTranslation, setBookTranslation] = useState(false);
  const [, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Initialize state variables when the modal is opened
  useEffect(() => {
    if (isOpen && appointment) {
      setSelectedPatient(appointment.patient);
      setSelectedDoctor(appointment.doctor);
      const appointmentDate = new Date(appointment.appointmentDate);
      const appointmentTime = appointmentDate
        .toLocaleTimeString("en-US", {
          hour: "2-digit",
          minute: "2-digit",
          hour12: false,
        })
        .substring(0, 5);

      setSelectedDate(appointmentDate);
      setSelectedTime(appointmentTime);
      setAppointmentReasonCategory(appointment.appointmentReason?.reason || "");
      setAppointmentReasonSubcategory(
        appointment.appointmentReason?.notes || ""
      );
      setBookTranslation(appointment.bookTranslation);
    }
  }, [isOpen, appointment]);

  // Fetch patients from the API
  const fetchPatients = useCallback(async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get("/api/users/patients");
      setPatients(response.data);
    } catch (error: any) {
      console.error("Error fetching patients:", error);
      setError("Failed to fetch patients. Please try again.");
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch doctors from the API
  const fetchDoctors = useCallback(async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get("/api/users");
      setDoctors(response.data);
    } catch (error: any) {
      console.error("Error fetching doctors:", error);
      setError("Failed to fetch doctors. Please try again.");
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch patients and doctors when the modal is opened
  useEffect(() => {
    if (isOpen) {
      fetchPatients();
      fetchDoctors();
    }
  }, [isOpen, fetchPatients, fetchDoctors]);

  // Fetch availability of a selected doctor
  const fetchDoctorAvailability = useCallback(async (doctorId: number) => {
    try {
      setLoading(true);
      setError(null);
      const response = await axiosInstance.get(
        `/api/availabilities/doctor/${doctorId}`
      );
      setAvailabilities(response.data);
    } catch (error: any) {
      console.error("Error fetching availabilities:", error);
      setError(`Failed to fetch availabilities. ${error.message}`);
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch availability when a doctor is selected
  useEffect(() => {
    if (selectedDoctor) {
      fetchDoctorAvailability(selectedDoctor.userId);
    }
  }, [selectedDoctor, fetchDoctorAvailability]);

  // Get available dates for the selected doctor
  const getAvailableDates = () => {
    const dates = [
      ...new Set(availabilities.map((a) => a.availability_date.split("T")[0])),
    ];
    return dates.map((date) => new Date(date));
  };

  // Get available time slots for the selected date
  const getAvailableTimeSlots = (date: Date) => {
    const dateString = date.toISOString().split("T")[0];
    return availabilities
      .filter((a) => a.availability_date.startsWith(dateString))
      .map((a) => a.availability_date.split("T")[1].substring(0, 5));
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedPatient && selectedDoctor && selectedDate && selectedTime) {
      const newAppointment = {
        user_id: selectedPatient.userId,
        doctor_id: selectedDoctor.userId,
        availability_id: availabilities.find(
          (a) =>
            a.availability_date.startsWith(
              selectedDate.toISOString().split("T")[0]
            ) && a.availability_date.includes(selectedTime)
        )?.id,
        appointment_reason: {
          reason: appointmentReasonCategory,
          notes: appointmentReasonSubcategory,
        },
        book_translation: bookTranslation,
      };

      try {
        setLoading(true);
        setError(null);
        const response = await axiosInstance.put(
          `/api/appointments/${appointment.id}`,
          newAppointment
        );
        onSubmit(response.data);
        onClose();
      } catch (error: any) {
        console.error("Error updating appointment:", error);
        setError(
          `Failed to update appointment. ${
            error.response?.data?.error || error.message
          }`
        );
      } finally {
        setLoading(false);
      }
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex justify-center items-center z-50">
      <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-3xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Edit Appointment</h2>
          <button
            onClick={onClose}
            className="text-gray-600 hover:text-gray-800 transition-colors"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {error && <div className="text-red-500 mb-4">{error}</div>}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Patient selection */}
          <div>
            <label className="block mb-1">Patient:</label>
            <select
              value={selectedPatient?.userId || ""}
              onChange={(e) =>
                setSelectedPatient(
                  patients.find((p) => p.userId === Number(e.target.value)) ||
                    null
                )
              }
              className="w-full p-2 border rounded"
            >
              {patients.map((patient) => (
                <option key={patient.userId} value={patient.userId}>
                  {patient.first_name} {patient.last_name}
                </option>
              ))}
            </select>
          </div>

          {/* Doctor selection */}
          <div>
            <label className="block mb-1">Doctor:</label>
            <select
              value={selectedDoctor?.userId || ""}
              onChange={(e) =>
                setSelectedDoctor(
                  doctors.find((d) => d.userId === Number(e.target.value)) ||
                    null
                )
              }
              className="w-full p-2 border rounded"
            >
              {doctors.map((doctor) => (
                <option key={doctor.userId} value={doctor.userId}>
                  {doctor.first_name} {doctor.last_name}
                </option>
              ))}
            </select>
          </div>

          {/* Current Appointment Date and Time */}
          <div>
            <label className="block mb-1">Current Appointment:</label>
            <p className="font-semibold">
              {appointment &&
                new Date(appointment.appointmentDate).toLocaleString()}
            </p>
          </div>

          {/* Date selection */}
          <div>
            <label className="block mb-1">Select New Date:</label>
            <DatePicker
              selected={selectedDate}
              onChange={(date: Date) => {
                setSelectedDate(date);
                setSelectedTime(null);
              }}
              includeDates={getAvailableDates()}
              dateFormat="MMMM d, yyyy"
              placeholderText="Select an available date"
              className="w-full p-2 border rounded"
            />
          </div>

          {/* Time selection */}
          {selectedDate && (
            <div>
              <label className="block mb-1">Select New Time:</label>
              <div className="grid grid-cols-3 gap-2">
                {getAvailableTimeSlots(selectedDate).map((time) => {
                  const isCurrentTime = time === selectedTime;

                  return (
                    <button
                      key={time}
                      type="button"
                      onClick={() => setSelectedTime(time)}
                      className={`p-2 rounded ${
                        isCurrentTime
                          ? "bg-blue-500 text-white"
                          : "bg-gray-200 hover:bg-gray-300"
                      }`}
                    >
                      {time}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Appointment Reason Category */}
          <div>
            <label className="block mb-1">Appointment Reason:</label>
            <select
              value={appointmentReasonCategory}
              onChange={(e) => {
                setAppointmentReasonCategory(e.target.value);
                setAppointmentReasonSubcategory("");
              }}
              className="w-full p-2 border rounded"
            >
              <option value="">Select a reason category</option>
              {Object.keys(appointmentReasons).map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>

          {/* Appointment Reason Subcategory */}
          {appointmentReasonCategory && (
            <div>
              <label className="block mb-1">Specific Reason:</label>
              <select
                value={appointmentReasonSubcategory}
                onChange={(e) =>
                  setAppointmentReasonSubcategory(e.target.value)
                }
                className="w-full p-2 border rounded"
              >
                <option value="">Select a specific reason</option>
                {appointmentReasons[
                  appointmentReasonCategory as keyof typeof appointmentReasons
                ]?.map((subcategory) => (
                  <option key={subcategory} value={subcategory}>
                    {subcategory}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Book translation checkbox */}
          <div className="bg-blue-100 p-4 rounded-lg">
            <label className="flex items-center space-x-2 cursor-pointer">
              <input
                type="checkbox"
                checked={bookTranslation}
                onChange={(e) => setBookTranslation(e.target.checked)}
                className="form-checkbox h-5 w-5 text-blue-600"
              />
              <span className="text-lg font-medium">Book Translation</span>
            </label>
            <p className="text-sm text-gray-600 mt-1">
              Check this if translation services for this appointment are
              needed.
            </p>
          </div>

          {/* Submit and Cancel buttons */}
          <div className="flex justify-end space-x-2">
            <button
              type="submit"
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
            >
              Update Appointment
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditAppointmentModal;
