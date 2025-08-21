import React, { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import axios from "axios";
import { RxCheck, RxCross2 } from "react-icons/rx";
import { toast } from "react-toastify";
import { GoArrowRight } from "react-icons/go";
import Cookies from "js-cookie";

const API_BASE_URL = (
  process.env.REACT_APP_API_BASE_URL || "http://localhost:8080"
).replace(/\/+$/, "");

const PaymentSuccess = () => {
  const [searchParams] = useSearchParams();
  const orderId = searchParams.get("order_id");
  const [loading, setLoading] = useState(true);
  const [bookingDetails, setBookingDetails] = useState(null);
  const [paymentFound, setPaymentFound] = useState(false); // New state to track if payment was found
  const navigate = useNavigate();
  const [token, setToken] = useState(null);
  useEffect(() => {
     const savedToken = Cookies.get("token");
        if (savedToken) {
          setToken(savedToken);
          console.log("Token found:", savedToken);
        }
    const blockSlot = async (formData) => {
      try {
        console.log("Blocking slot with data:", formData);
        await axios.post(
          `${API_BASE_URL}/api/unavailable-slots`,
          {
            date: formData.date,
            timeSlot: formData.time_slot,
            isAvailable: false,
          },
          {
            headers: {
              Authorization: `Bearer ${savedToken}`,
            },
          }
        );
        console.log("Slot blocked successfully.");
      } catch (error) {
        console.error("Failed to block slot:", error);
      }
    };

    const verifyPayment = async () => {
      if (!orderId) {
        toast.error("Invalid payment link. No Order ID found.");
        setLoading(false);
        return;
      }

      try {
        const response = await axios.get(
          `${API_BASE_URL}/api/bookings/verify-payment/${orderId}`
        );
        // If the request is successful and data is returned
        setBookingDetails(response.data);
        console.log("Booking details:", response.data);
        setPaymentFound(true); // Payment was found and is successful
        await blockSlot(response.data);
        toast.success("Payment successful! Your booking is confirmed.");
      } catch (error) {
        console.error("Payment verification failed:", error);
        // Check if the error is a 404 Not Found from the server
        if (error.response && error.response.status === 404) {
          setPaymentFound(false); // Payment was not found in the database
          toast.error("Booking not found. Please check your order details.");
        } else {
          // Other types of errors (e.g., server error, network error)
          toast.error(
            "Failed to verify payment status. Please contact support."
          );
        }
      } finally {
        setLoading(false);
      }
    };

    verifyPayment();
  }, [orderId]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="text-center">
          
          <h2 className="text-2xl font-semibold text-gray-800">
            Verifying your payment...
          </h2>
          <p className="mt-2 text-gray-600">Please do not close this window.</p>
        </div>
      </div>
    );
  }

  // Conditional rendering based on paymentFound and bookingDetails state
  if (!paymentFound) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[70vh] p-4 bg-purple-800">
        <div className="w-full max-w-md flex flex-col justify-center items-center p-8 text-center bg-white rounded-lg shadow-lg">
          <div className="mb-4 text-red-500">
            <RxCross2 className="w-12 h-12 mx-auto" />
          </div>
          <h1 className="text-3xl font-bold text-gray-800">
            Payment is not successful!
          </h1>
          <p className="mt-4 text-gray-600 mb-4">
            We could not verify your payment. Please try again or contact support.
          </p>
          <button className="bg-yellow-400 text-blue-900 px-6 py-2 rounded-xl font-semibold shadow hover:bg-yellow-300 flex gap-2 items-center justify-center" onClick={()=> navigate("/booking")}>
            Go Back to Booking <GoArrowRight className="text-xl"/>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] p-4  bg-purple-800">
      <div className="w-full flex flex-col justify-center items-center max-w-md p-8 text-center bg-white rounded-lg shadow-lg">
        <div className="mb-4 text-green-500">
          <RxCheck className="w-12 h-12 mx-auto" />
        </div>
        <h1 className="text-3xl font-bold text-gray-800">
          We have received your appointment
        </h1>
        <p className="mt-4 text-gray-600">
          We will reach out to you soon...
        </p>
        <div className="pt-4 mt-6 text-left border-t">
          <h3 className="text-lg font-semibold text-gray-800">
            Booking Details:
          </h3>
          <p className="mt-2 text-gray-700">
            <strong>Booking ID:</strong> {bookingDetails?.booking_id}
          </p>
          <p className="mt-1 text-gray-700">
            <strong>Name:</strong> {bookingDetails?.name}
          </p>
          <p className="mt-1 text-gray-700">
            <strong>Appointment Date:</strong> {bookingDetails?.date}
          </p>
          <p className="mt-1 text-gray-700">
            <strong>Time Slot:</strong> {bookingDetails?.time_slot}
          </p>
          <button className="bg-yellow-400 text-blue-900 px-6 py-2 rounded-xl font-semibold shadow hover:bg-yellow-300 flex gap-2 items-center justify-center mx-auto mt-4" onClick={()=> navigate("/your-orders")}>
            Go to your Orders <GoArrowRight className="text-xl"/>
          </button>
        </div>
      </div>
    </div>
  );
};

export default PaymentSuccess;
