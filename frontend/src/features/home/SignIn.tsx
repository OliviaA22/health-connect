import React from "react";
import { useNavigate } from "react-router-dom";
import AdminHeader from "../../components/layout/adminHeader";
import axiosInstance from "../../axios/Axios";
import PatientForm, {
  FormData,
} from "../../components/patientModal/PatientForm";

const SignUp: React.FC = () => {
  const navigate = useNavigate();

  const handleSubmit = async (formData: FormData) => {
    try {
      const postData = {
        title: formData.title,
        first_name: formData.first_name,
        last_name: formData.last_name,
        email: formData.email,
        password: formData.password, // Make sure this is included in your FormData
        date_of_birth: formData.date_of_birth
          ? formData.date_of_birth.toISOString().split("T")[0]
          : null,
        phone_number: formData.phone_number,
        gender: formData.gender, // Make sure this is included in your FormData
        insurance_type: formData.insurance_type || "public",
        address: {
          street: formData.address.street,
          postcode: formData.address.postcode,
          city: formData.address.city,
          state: formData.address.state,
          country: formData.address.country,
        },
        accessibility_needs: formData.accessibility_needs || "none",
        emergency_contact_details: formData.emergency_contact_details || null,
        language: formData.languages.values,
      };

      const token = localStorage.getItem("token");

      const response = await axiosInstance.post(
        "/api/auth/register",
        postData,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
        }
      );

      navigate("/signin");
    } catch (error: any) {
      console.error("Registration error:", error);
      if (error.response) {
        console.error("Response data:", error.response.data);
        console.error("Response status:", error.response.status);
        console.error("Response headers:", error.response.headers);
        alert(
          `Registration failed: ${
            error.response.data.error ||
            error.response.data.message ||
            error.message
          }`
        );
      } else if (error.request) {
        console.error("No response received:", error.request);
        alert("Registration failed: No response received from server");
      } else {
        console.error("Error message:", error.message);
        alert(`Registration failed: ${error.message}`);
      }
    }
  };

  const handleClose = () => {
    // Navigate back or to home page
    navigate("/");
  };

  return (
    <div className="min-h-screen w-full bg-blue-50">
      <AdminHeader text={""} />
      <div className="container mx-auto px-4 py-10 flex justify-center items-center">
        <div className="w-full max-w-3xl bg-white rounded-2xl px-8 py-10 shadow-custom">
          <h1 className="text-center text-blue-600 font-semibold text-3xl mb-8">
            Register
          </h1>
          <PatientForm handleSubmit={handleSubmit} onClose={handleClose} />
        </div>
      </div>
    </div>
  );
};

export default SignUp;
