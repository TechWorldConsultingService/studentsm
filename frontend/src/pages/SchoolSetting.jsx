import React, { useState, useEffect } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import MainLayout from "../layout/MainLayout";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const SchoolSettings = () => {
  const { access, role } = useSelector((state) => state.user);
  const navigate = useNavigate();

  const [isAd, setIsAd] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchDateFormat = async () => {
    if (!access) {
      toast.error("User is not authenticated. Please log in.");
      return;
    }
    try {
      const { data } = await axios.get("http://localhost:8000/api/date-setting/", {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${access}`,
        },
      });
      setIsAd(data.is_ad);
    } catch (error) {
      if (error.response && error.response.status === 401) {
        navigate("/");
      } else {
        toast.error("Error fetching settings: " + (error.message || error));
      }
    }
  };

  useEffect(() => {
    fetchDateFormat();
  }, [access, navigate]);

  const handleSave = async (e) => {
    e.preventDefault();
    if (isAd === null) {
      toast.error("Please select a date format.");
      return;
    }
    setLoading(true);
    try {
      const payload = { is_ad: isAd };
      await axios.post("http://localhost:8000/api/date-setting/", payload, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${access}`,
        },
      });
      toast.success("Settings saved successfully.");
    } catch (error) {
      toast.error("Error saving settings: " + (error.message || error));
    } finally {
      setLoading(false);
    }
  };

  return (
    <MainLayout>
      <div className="bg-purple-50 p-6 min-h-screen">
        <div className="bg-white p-6 rounded-lg shadow-lg border border-purple-300 max-w-3xl mx-auto">
          <h1 className="text-3xl font-extrabold text-purple-800">Settings</h1>
          <p className="mt-4 text-gray-600">
            Configure your school management settings below.
          </p>
          <form onSubmit={handleSave} className="mt-6 space-y-6">
            {/* Date Format */}
            <div>
              <label className="block text-gray-700 font-semibold mb-2">
                Date Format
              </label>
              <div className="flex items-center space-x-4">
                <label className="inline-flex items-center">
                  <input
                    type="radio"
                    className="form-radio text-purple-700"
                    name="dateFormat"
                    value="AD"
                    checked={isAd === true}
                    onChange={() => setIsAd(true)}
                    disabled={role !== "principal"}
                  />
                  <span className="ml-2">AD</span>
                </label>
                <label className="inline-flex items-center">
                  <input
                    type="radio"
                    className="form-radio text-purple-700"
                    name="dateFormat"
                    value="BS"
                    checked={isAd === false}
                    onChange={() => setIsAd(false)}
                    disabled={role !== "principal"}
                  />
                  <span className="ml-2">BS</span>
                </label>
              </div>
            </div>

            {/* Save Button */}
            {role === "principal" && (
              <div className="mt-4 text-center">
                <button
                  type="submit"
                  disabled={loading}
                  className="bg-purple-700 text-white px-6 py-2 rounded-lg hover:bg-purple-800"
                >
                  {loading ? "Saving..." : "Save Settings"}
                </button>
              </div>
            )}
          </form>
        </div>
      </div>
    </MainLayout>
  );
};

export default SchoolSettings;
