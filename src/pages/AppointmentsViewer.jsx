import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { IoCloseOutline } from "react-icons/io5";
import { FaEdit } from "react-icons/fa";
import Cookies from "js-cookie";

axios.defaults.withCredentials = true;

const API_BASE_URL = (
  process.env.REACT_APP_API_BASE_URL || "http://localhost:8080"
).replace(/\/+$/, "");

const AppointmentViewer = () => {
  const [bookings, setBookings] = useState([]);
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [selectedView, setSelectedView] = useState(null);

  const [isEditOpen, setIsEditOpen] = useState(false);
  const [selectedEdit, setSelectedEdit] = useState(null);
  const [draftEdit, setDraftEdit] = useState({});

  useEffect(() => {
    const getBookings = async () => {
      const token = Cookies.get("token");
      try {
        const response = await axios.get(`${API_BASE_URL}/api/bookings`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setBookings(response.data);
      } catch (err) {
        console.error("Error fetching bookings:", err);
      }
    };
    getBookings();
  }, []);

  const handleEditClick = (booking) => {
    setSelectedEdit(booking);
    setDraftEdit({ ...booking });
    setIsEditOpen(true);
  };

  const handleEditChange = (field, value) => {
    setDraftEdit((prev) => ({ ...prev, [field]: value }));
  };

  const handleSaveEdit = async () => {
    try {
      const token = Cookies.get("token");
      await axios.put(
        `${API_BASE_URL}/api/bookings/${selectedEdit._id}`,
        draftEdit,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      // Update state locally
      setBookings((prev) =>
        prev.map((b) => (b._id === selectedEdit._id ? draftEdit : b))
      );
      setIsEditOpen(false);
    } catch (err) {
      console.error("Error updating booking:", err);
    }
  };

  return (
    <div className="relative w-full min-h-screen">
      {/* View Details Popup */}
      {isViewOpen && (
        <div className="fixed top-0 left-0 flex items-center justify-center w-full h-full text-black bg-black bg-opacity-50 z-50">
          <div className="w-[500px] h-[400px] bg-white rounded-lg border relative shadow-lg py-8 px-4">
            <div
              className="w-[35px] h-[35px] rounded-full border absolute right-2 top-2 flex justify-center items-center shadow-lg hover:cursor-pointer"
              onClick={() => setIsViewOpen(false)}
            >
              <IoCloseOutline />
            </div>
            <div>
              <h1 className="text-xl">Appointment Details</h1>
              <div className="grid flex-col w-full grid-cols-2 px-4 my-4 gap-y-4">
                <div>Name</div>
                <div className="flex items-end justify-end">{selectedView.name}</div>

                <div>Date</div>
                <div className="flex items-end justify-end">
                  {new Date(selectedView.date).toISOString().split("T")[0]}
                </div>

                <div>Appointment Type</div>
                <div className="flex items-end justify-end">
                  {selectedView.appointment_type}
                </div>

                <div>Email</div>
                <div className="flex items-end justify-end">
                  {selectedView.email}
                </div>

                <div>Phone Number</div>
                <div className="flex items-end justify-end">
                  {selectedView.whatsapp_number}
                </div>

                <div>Time Slot</div>
                <div className="flex items-end justify-end">
                  {selectedView.time_slot}
                </div>
              </div>
              <button className="w-full py-4 text-white bg-black rounded-lg">
                Send Email Reminder
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Popup */}
      {isEditOpen && (
       <div className="text-black fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex items-center justify-center z-50">
  <div className="bg-white w-[500px] max-h-[80vh] overflow-y-auto rounded-lg shadow-lg p-6 relative">
    {/* Close button */}
    <div
      className="absolute top-2 right-2 cursor-pointer"
      onClick={() => setIsEditOpen(false)}
    >
      <IoCloseOutline size={24} />
    </div>

    <h2 className="text-xl mb-4">Edit Booking</h2>

    {/* Loop through filtered properties */}
    {Object.keys(draftEdit)
      .filter(
        (key) =>
          ![
            "createdAt",
            "updatedAt",
            "__v",
            "_id",
            "id",
            "booking_id" // or any others you don't want
          ].includes(key)
      )
      .map((key) => {
        const value = draftEdit[key];

        // Date fields
        if (key.toLowerCase().includes("date")) {
          return (
            <div key={key} className="mb-4">
              <label className="block mb-1 capitalize">{key.replace(/_/g, " ")}</label>
              <input
                type="date"
                className="border px-3 py-2 w-full"
                value={value ? new Date(value).toISOString().split("T")[0] : ""}
                onChange={(e) => handleEditChange(key, e.target.value)}
              />
            </div>
          );
        }

        // Boolean fields
        if (typeof value === "boolean") {
          return (
            <div key={key} className="mb-4">
              <label className="block mb-1 capitalize">{key.replace(/_/g, " ")}</label>
              <select
                className="border px-3 py-2 w-full"
                value={value ? "true" : "false"}
                onChange={(e) => handleEditChange(key, e.target.value === "true")}
              >
                <option value="true">True</option>
                <option value="false">False</option>
              </select>
            </div>
          );
        }

        // Everything else as text input
        return (
          <div key={key} className="mb-4">
            <label className="block mb-1 capitalize">{key.replace(/_/g, " ")}</label>
            <input
              type="text"
              className="border px-3 py-2 w-full"
              value={value ?? ""}
              onChange={(e) => handleEditChange(key, e.target.value)}
            />
          </div>
        );
      })}

    {/* Action buttons */}
    <div className="flex justify-end gap-2">
      <button
        onClick={() => setIsEditOpen(false)}
        className="bg-black text-white px-4 py-2 rounded"
      >
        Cancel
      </button>
      <button
        onClick={handleSaveEdit}
        className="bg-green-500 text-white px-4 py-2 rounded"
      >
        Save
      </button>
    </div>
  </div>
</div>

      )}

      {/* Table */}
      <div className="max-w-7xl py-16 mx-auto ">
        <div className="flex items-center w-full text-4xl">
          <h2>Total Appointments</h2>
          <p className="pl-8">{bookings.length}</p>
        </div>
        <h1 className="mt-8 text-lg">Your Appointments </h1>
        <div className="w-full mt-4 overflow-hidden border rounded-lg ">
          <table className="w-full min-w-[800px] rounded-lg overflow-hidden border-1 border-black">
            <thead>
              <tr className="text-black bg-white shadow-lg">
                <th className="px-4 py-2 border-r">OrderId</th>
                <th className="px-4 py-2 border-r">Name</th>
                <th className="px-4 py-2 border-r">Email</th>
                <th className="px-4 py-2 border-r">Phone</th>
                <th className="px-4 py-2 border-r">Apt. Type</th>
                <th className="px-4 py-2 border-r">TimeSlot</th>
                <th className="px-4 py-2 border-r">Date</th>
                <th className="px-4 py-2">Edit</th>
              </tr>
            </thead>
            <tbody>
             {bookings
                .filter(order => order.payment_status === true)
                .map(order => (
                    <tr key={order._id} className="border-t group">
                    <td className="px-4 py-2 border-r bg-purple-50 group-hover:bg-purple-100 text-black">
                        {order.booking_id.slice(0, 10) + "..."}
                    </td>
                    <td className="px-4 py-2 border-r bg-purple-50 group-hover:bg-purple-100 text-black">
                        {order.name}
                    </td>
                    <td className="px-4 py-2 border-r bg-purple-50 group-hover:bg-purple-100 text-black">
                        {order?.email}
                    </td>
                    <td className="px-4 py-2 border-r bg-purple-50 group-hover:bg-purple-100 text-black">
                        {order.whatsapp_number}
                    </td>
                    <td className="px-4 py-2 border-r bg-purple-50 group-hover:bg-purple-100 text-black">
                        {order.appointment_type}
                    </td>
                    <td className="px-4 py-2 border-r bg-purple-50 group-hover:bg-purple-100 text-black">
                        {order.time_slot}
                    </td>
                    <td className="px-4 py-2 border-r bg-purple-50 group-hover:bg-purple-100 text-black">
                        {order.date ? new Date(order.date).toISOString().split("T")[0] : "N/A"}
                    </td>
                    <td className="px-4 py-2 bg-purple-50 group-hover:bg-purple-100 text-center">
                        <FaEdit
                        className="text-blue-500 cursor-pointer hover:text-blue-700"
                        onClick={() => handleEditClick(order)}
                        />
                    </td>
                    </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AppointmentViewer;
