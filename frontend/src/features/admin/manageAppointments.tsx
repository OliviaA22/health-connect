import React, { useState, useEffect } from "react";
import axiosInstance from "../../Axios";
import AppointmentTable from "../../components/tables/AppointmentTable";
import { Appointment } from "../../components/Types";
import PageLayout from "../../components/layout/PageLayout";
import DeleteConfirmationModal from "../../components/appointmentModal/DeleteConfirmationModal";
import EditAppointmentModal from "../../components/appointmentModal/EditModal";
import AddAppointmentModal from "../../components/appointmentModal/AddModal";

const ManageAppointments: React.FC = () => {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState<boolean>(false);

  useEffect(() => {
    fetchAppointments();
  }, []);

  const fetchAppointments = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get<Appointment[]>(
        "/api/appointments/"
      );
      setAppointments(response.data);
      console.log("Fetched appointments:", response.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching appointments:", error);
      setError("Failed to fetch appointments. Please try again.");
      setLoading(false);
    }
  };

  const handleAddAppointment = () => {
    console.log("Opening Add Appointment Modal");
    setIsAddModalOpen(true);
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div className="error-message">{error}</div>;

  return (
    <PageLayout text="Manage Appointments">
      <div className="flex min-h-screen pb-20 justify-center w-full">
        <div className="flex flex-col gap-10 w-[86%] py-10">
          <div className="p-6 w-full flex-flex-col gap-8 h-full bg-white shadow-custom rounded-2xl">
            <div className="flex justify-between items-center mb-4">
              <h1 className="text-2xl text-blue-600 font-semibold">
                Appointments
              </h1>
              <button
                onClick={handleAddAppointment}
                className="bg-blue-600 px-4 py-2 rounded-lg text-white hover:bg-blue-700 transition duration-300"
              >
                Add Appointment
              </button>
            </div>
            <AppointmentTable
              appointments={appointments}
              fetchAppointments={fetchAppointments}
            />
          </div>
        </div>
      </div>
    </PageLayout>
  );
};

export default ManageAppointments;
