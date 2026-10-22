import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { QRCodeCanvas } from "qrcode.react";

const AdminDashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDashboardData = async () => {
      const token = localStorage.getItem("adminToken");
      if (!token) {
        navigate("/admin/login");
        return;
      }

      try {
        const res = await fetch(
          `http://localhost:5000/api/admin/dashboard`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );
        const result = await res.json();

        if (result.success) {
          setData(result);
        } else {
          setError(result.message);
          // Agar admin ne abhi tak business add nahi kiya hai
          if (result.message.includes("No business linked")) {
            navigate("/admin/register");
          }
        }
      } catch (err) {
        setError("Server connection error. Failed to load dashboard.");
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    navigate("/admin/login");
  };

  const downloadQR = () => {
    const canvas = document.getElementById("business-qr-code");
    if (canvas) {
      const pngUrl = canvas
        .toDataURL("image/png")
        .replace("image/png", "image/octet-stream");
      const downloadLink = document.createElement("a");
      downloadLink.href = pngUrl;
      downloadLink.download = `${data?.business?.name || "Business"}-QR.png`;
      document.body.appendChild(downloadLink);
      downloadLink.click();
      document.body.removeChild(downloadLink);
    }
  };
  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center font-bold text-gray-600">
        Loading Dashboard...
      </div>
    );
  if (error)
    return (
      <div className="min-h-screen flex items-center justify-center font-bold text-red-500">
        {error}
      </div>
    );

  return (
    <div className="min-h-screen bg-gray-100 p-4 md:p-8">
      {/* Top Navbar */}
      <div className="max-w-6xl mx-auto flex justify-between items-center bg-white p-4 rounded-xl shadow-sm mb-6 border">
        <h1 className="text-xl md:text-2xl font-bold text-gray-800">
          {data?.business?.name || "My Business"} Dashboard
        </h1>
        <button
          onClick={handleLogout}
          className="bg-red-50 hover:bg-red-100 text-red-600 px-4 py-2 rounded-lg font-medium transition"
        >
          Logout
        </button>
      </div>

      {/* Analytics Cards */}
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-xl shadow-sm border-t-4 border-blue-500">
          <p className="text-gray-500 text-sm font-medium uppercase tracking-wide">
            Total Feedbacks
          </p>
          <h3 className="text-3xl font-bold text-gray-800 mt-2">
            {data?.stats?.totalFeedbacks || 0}
          </h3>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border-t-4 border-yellow-500">
          <p className="text-gray-500 text-sm font-medium uppercase tracking-wide">
            Average Rating
          </p>
          <h3 className="text-3xl font-bold text-gray-800 mt-2">
            {data?.stats?.avgRating || 0} ⭐
          </h3>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border-t-4 border-red-500">
          <p className="text-gray-500 text-sm font-medium uppercase tracking-wide">
            Negative Protected
          </p>
          <h3 className="text-3xl font-bold text-red-600 mt-2">
            {data?.stats?.negativePrevented || 0}
          </h3>
        </div>
      </div>

      {/* QR Code Manager Section */}
      <div className="max-w-6xl mx-auto bg-white rounded-xl shadow-sm border p-6 mb-8 flex flex-col md:flex-row items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-gray-800 mb-2">
            Aapka Payment & Review QR
          </h2>
          <p className="text-gray-500 text-sm mb-4">
            Ise print karke apne counter par lagayein. Customer isko scan karke
            UPI payment aur review de sakte hain.
          </p>
          <div className="bg-blue-50 text-blue-700 p-3 rounded-lg text-sm font-mono inline-block">
            {window.location.origin}/b/{data?.business?.slug}
          </div>
        </div>

        <div className="mt-6 md:mt-0 flex flex-col items-center border p-4 rounded-xl bg-gray-50">
          <QRCodeCanvas
            id="business-qr-code"
            value={`${window.location.origin}/b/${data?.business?.slug}`}
            size={150}
            level={"H"}
            includeMargin={true}
          />
          <button
            onClick={downloadQR}
            className="mt-4 bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium transition w-full"
          >
            Download QR
          </button>
        </div>
      </div>

      {/* Feedback Table */}
      <div className="max-w-6xl mx-auto bg-white rounded-xl shadow-sm border overflow-hidden">
        <div className="p-6 border-b bg-gray-50">
          <h2 className="text-lg font-bold text-gray-800">
            Recent Customer Feedbacks
          </h2>
        </div>

        <div className="overflow-x-auto">
          {data?.feedbacks?.length === 0 ? (
            <p className="p-6 text-gray-500 text-center">
              Abhi tak koi feedback nahi aaya hai.
            </p>
          ) : (
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-white border-b text-gray-500 text-sm">
                  <th className="p-4 font-medium">Date</th>
                  <th className="p-4 font-medium">Rating</th>
                  <th className="p-4 font-medium">Customer Message</th>
                </tr>
              </thead>
              <tbody>
                {data.feedbacks.map((feedback) => (
                  <tr
                    key={feedback._id}
                    className="border-b hover:bg-gray-50 transition"
                  >
                    <td className="p-4 text-sm text-gray-600 whitespace-nowrap">
                      {new Date(feedback.createdAt).toLocaleDateString()}
                    </td>
                    <td className="p-4">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-bold ${
                          feedback.rating >= 4
                            ? "bg-green-100 text-green-700"
                            : "bg-red-100 text-red-700"
                        }`}
                      >
                        {feedback.rating} Star
                      </span>
                    </td>
                    <td className="p-4 text-sm text-gray-800 min-w-[300px]">
                      {feedback.message || (
                        <span className="text-gray-400 italic">
                          No message provided
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
