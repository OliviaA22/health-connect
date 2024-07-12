import React, { useState, useEffect, useRef, useCallback } from "react";
import axiosInstance from "../../axios/Axios";
import PatientTable from "../tables/PatientTable";
import AppointmentTable from "../tables/AppointmentTable";
import DoctorForm, { FormData } from "./DoctorForm";
import {
  Specialization,
  Language,
  Patient,
  Doctor,
  Appointment,
} from "../Types";
import AvailabilityManagerModal from "../availabilityModal/AvailabilityManagerModal";

interface EditDoctorModalProps {
  isOpen: boolean;
  onClose: () => void;
  doctorId: number;
  onUpdateSuccess: () => void;
}

const EditDoctorModal: React.FC<EditDoctorModalProps> = ({
  isOpen,
  onClose,
  doctorId,
  onUpdateSuccess,
}) => {
  // State variables
  const [isEditFormExpanded, setIsEditFormExpanded] = useState(true);
  const [isPatientTableExpanded, setIsPatientTableExpanded] = useState(false);
  const [isAppointmentTableExpanded, setIsAppointmentTableExpanded] =
    useState(false);
  const [languages, setLanguages] = useState<Language[]>([]);
  const [specializations, setSpecializations] = useState<Specialization[]>([]);
  const [patients, setPatients] = useState<Patient[]>([]);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isAvailabilityModalOpen, setIsAvailabilityModalOpen] = useState(false);
  const [selectedDoctorForAvailability, setSelectedDoctorForAvailability] =
    useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [doctor, setDoctor] = useState<Doctor | null>(null);

  const fetchedRef = useRef(false);

  // Fetch data function
  const fetchData = useCallback(async () => {
    if (fetchedRef.current || !doctorId) return;
    try {
      setLoading(true);
      setError(null);

      const [
        doctorResponse,
        languagesResponse,
        specializationsResponse,
        patientsResponse,
        appointmentsResponse,
      ] = await Promise.all([
        axiosInstance.get(`/api/users/doctor/${doctorId}`),
        axiosInstance.get("/api/search/languages"),
        axiosInstance.get("/api/search/specializations"),
        axiosInstance.get(`/api/appointments/doctor-patients/${doctorId}`),
        axiosInstance.get(`/api/appointments/doctor/${doctorId}`),
      ]);

      const doctorData = doctorResponse.data;
      const mappedDoctor: Doctor = {
        userId: doctorData.id,
        address: {
          street: doctorData.address.street,
          city: doctorData.address.city,
          state: doctorData.address.state,
          country: doctorData.address.country,
          postcode: doctorData.address.postal_code,
        },
        first_name: doctorData.first_name,
        last_name: doctorData.last_name,
        email: doctorData.email,
        languages: doctorData.languages.map((lang: any) => ({
          id: lang.id,
          language_name: lang.language_name,
        })),
        title: doctorData.title,
        specialization: {
          id: doctorData.specialization.id,
          area_of_specialization:
            doctorData.specialization?.area_of_specialization ||
            "Not specified",
        },
        phone_number: doctorData.phone_number,
        date_of_birth: new Date(doctorData.date_of_birth),
      };

      setDoctor(mappedDoctor);
      setLanguages(languagesResponse.data);
      setSpecializations(specializationsResponse.data);
      setPatients(patientsResponse.data);

      if (
        appointmentsResponse.data &&
        Array.isArray(appointmentsResponse.data)
      ) {
        const mappedAppointments: Appointment[] = appointmentsResponse.data
          .map((appointment: any) => {
            if (!doctor) {
              console.error(
                "Doctor data missing for appointment:",
                appointment
              );
              return null;
            }
            return {
              id: appointment.id,
              appointmentDate:
                appointment.availability?.availability_date || "",
              appointmentReason: {
                reason: appointment.appointment_reason?.reason,
                notes: appointment.appointment_reason?.notes,
              },
              bookTranslation: appointment.book_translation || false,
              completed: appointment.completed || false,
              doctor: {
                userId: doctor.userId,
                first_name: doctor.first_name,
                last_name: doctor.last_name,
                specialization: doctor.specialization,
                address: doctor.address,
                languages: doctor.languages,
                title: doctor.title || "",
                phone_number: doctor.phone_number || "",
                email: doctor.email || "",
                role: "doctor",
              },
              patient: {
                userId: appointment.user_id,
                first_name: appointment.patient?.first_name || "Unknown",
                last_name: appointment.patient?.last_name || "Patient",
                address: appointment.patient?.address || {
                  street: "",
                  city: "",
                  state: "",
                  country: "",
                  postcode: "",
                },
                languages: appointment.patient?.languages || [],
                role: "patient",
              },
              availability: {
                id: appointment.availability_id || 0,
                doctor_id: doctor.userId,
                availability_date:
                  appointment.availability?.availability_date || "",
                active: true,
              },
            } as Appointment;
          })
          .filter(
            (appointment): appointment is Appointment => appointment !== null
          );
        setAppointments(mappedAppointments);
      } else {
        setError("Unexpected response format for appointments");
      }

      fetchedRef.current = true;
    } catch (error: any) {
      console.error("Error fetching data:", error);
      setError("Failed to fetch data. Please try again.");
    } finally {
      setLoading(false);
    }
  }, [doctorId, doctor]);

  // useEffect to fetch data on modal open
  useEffect(() => {
    if (isOpen && doctorId) {
      fetchData();
    }
  }, [isOpen, doctorId, fetchData]);

  // Handle save changes
  const handleSaveChanges = async (formData: FormData) => {
    try {
      setError(null);
      const updatedDoctor = {
        title: formData.title,
        first_name: formData.first_name,
        last_name: formData.last_name,
        address: {
          street: formData.street,
          postcode: formData.postcode,
          city: formData.city,
          state: formData.state,
          country: formData.country,
        },
        email: formData.email,
        date_of_birth: formData.date_of_birth,
        specialization_id: formData.specialization?.value,
        languages: formData.languages.map((lang) => lang.value).filter(Boolean),
        phone_number: formData.phone_number,
      };

      await axiosInstance.put(`/api/users/${doctorId}`, updatedDoctor, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      onClose();
      onUpdateSuccess();
    } catch (error: any) {
      console.error("Error updating doctor:", error);
      if (error.response) {
        setError(
          `Failed to update doctor: ${
            error.response.data.message || error.message
          }`
        );
      } else if (error.request) {
        setError("Failed to update doctor: No response received from server");
      } else {
        setError(`Failed to update doctor: ${error.message}`);
      }
    }
  };

  // Open availability modal
  const openAvailabilityModal = (id: number) => {
    setSelectedDoctorForAvailability(id);
    setIsAvailabilityModalOpen(true);
  };

  // Return null if modal is not open
  if (!isOpen) return null;

  // Loading state
  if (loading) {
    return (
      <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex items-center justify-center">
        <div className="bg-white p-5 rounded-lg">
          Loading doctor information...
        </div>
      </div>
    );
  }

  // Error state
  if (error || !doctor) {
    return (
      <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex items-center justify-center">
        <div className="bg-white p-5 rounded-lg">
          <p className="text-red-500">
            {error || "Failed to load doctor information"}
          </p>
          <button
            onClick={onClose}
            className="mt-4 bg-red-500 text-white p-2 rounded"
          >
            Close
          </button>
        </div>
      </div>
    );
  }

  // Main render
  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full">
      <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
        <h2 className="text-2xl font-bold mb-4">
          Edit {doctor.title} {doctor.first_name} {doctor.last_name}
        </h2>

        <div className="flex space-x-4">
          <button
            type="button"
            className="flex-1 bg-blue-500 text-white p-2 rounded"
            onClick={() => openAvailabilityModal(doctorId)}
          >
            Manage availabilities
          </button>
          <button
            onClick={onClose}
            className="flex-1 bg-red-500 text-white p-2 rounded"
          >
            Close
          </button>
        </div>
        {isAvailabilityModalOpen && selectedDoctorForAvailability !== null && (
          <AvailabilityManagerModal
            isOpen={isAvailabilityModalOpen}
            onClose={() => setIsAvailabilityModalOpen(false)}
            doctorId={selectedDoctorForAvailability}
          />
        )}

        {/* Edit Form Section */}
        <div className="mb-4">
          <button
            className="w-full text-left font-semibold bg-gray-200 p-2 rounded"
            onClick={() => setIsEditFormExpanded(!isEditFormExpanded)}
          >
            {isEditFormExpanded ? "▼" : "►"} Edit Doctor Information
          </button>
          {isEditFormExpanded && (
            <DoctorForm
              data={doctor}
              handleSubmit={handleSaveChanges}
              onClose={onClose}
            />
          )}
        </div>

        {/* Appointment Table Section */}
        <div className="mt-8">
          <button
            className="w-full text-left font-semibold bg-gray-200 p-2 rounded"
            onClick={() =>
              setIsAppointmentTableExpanded(!isAppointmentTableExpanded)
            }
          >
            {isAppointmentTableExpanded ? "▼" : "►"} Doctor's Appointments
          </button>
          {isAppointmentTableExpanded && (
            <AppointmentTable
              appointments={appointments}
              fetchAppointments={fetchData}
              doctorId={doctor.userId}
            />
          )}
        </div>

        {/* Patient Table Section */}
        <div>
          <button
            className="w-full text-left font-semibold bg-gray-200 p-2 rounded"
            onClick={() => setIsPatientTableExpanded(!isPatientTableExpanded)}
          >
            {isPatientTableExpanded ? "▼" : "►"} Doctor's Patients
          </button>
          {isPatientTableExpanded && (
            <div className="mt-2">
              <PatientTable
                patients={patients}
                onEdit={(patient) => console.log("Edit patient", patient)}
                onDelete={(patient) => console.log("Delete patient", patient)}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default React.memo(EditDoctorModal);
