import React from "react";
import { Link } from "react-router-dom";

interface NavLink {
  name: string;
  link: string;
}

interface AdminHeaderProps {
  text: string;
}

const AdminHeader: React.FC<AdminHeaderProps> = ({ text }) => {
  const navLinks: NavLink[] = [
    {
      name: "Manage Patients",
      link: "patients",
    },
    {
      name: "Manage Doctors",
      link: "doctors",
    },
    {
      name: "Manage Appointments",
      link: "appointments",
    },
  ];

  return (
    <div className="relative">
      <div className="absolute inset-0 bg-gray-100 h-16 border-b-2 border-blue-200 flex items-center">
        <div className="flex px-10 items-center justify-between w-full">
          <h1 className="text-2xl font-medium uppercase">{text}</h1>
          <Link
            to={"/"}
            className="px-5 py-1 hover:bg-gray-200 hover:cursor-pointer transition duration-300 ease-in-out bg-gray-100 rounded-lg font-medium text-blue-500 text-xl"
          >
            Logout
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AdminHeader;
