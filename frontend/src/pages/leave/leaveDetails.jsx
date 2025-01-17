import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import MainLayout from "../../layout/MainLayout";
import { ImCross } from "react-icons/im";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

const LeaveDetail = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [leaveDetail, setLeaveDetail] = useState(null);
  const [leaveError, setLeaveError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const { access } = useSelector((state) => state.user);

  useEffect(() => {
    async function getLeaveDetail() {
      try {
        setIsLoading(true);
        if (!access) {
          setLeaveError("User is not authenticated. Please log in.");
          return;
        }

        const { data } = await axios.get(
          `http://localhost:8000/api/leave-applications/${id}/`,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${access}`,
            },
          }
        );

        setLeaveDetail(data);
      } catch (error) {
        setLeaveError("Error fetching leave data");
        console.log(error);
      } finally {
        setIsLoading(false);
      }
    }

    getLeaveDetail();
  }, [id]);

  return (
    <MainLayout>
      <div className="bg-purple-50 p-6">
        <div className="bg-white p-6 rounded-lg shadow-lg border border-purple-300">
          <div className="flex justify-between items-center">
            <h1 className="text-3xl font-extrabold text-purple-800">
              Leave Application Detail
            </h1>
            <ImCross
              className="text-purple-700 cursor-pointer"
              onClick={() => navigate(-1)}
            />
          </div>

          {leaveError ? (
            <p className="mt-4 text-red-500">{leaveError}</p>
          ) : isLoading ? (
            <p className="mt-4 text-gray-500">Loading...</p>
          ) : leaveDetail ? (
            <div className="mt-6">
              <div className="flex flex-col gap-4">
                <p>
                  <strong className="text-purple-700">Applicant Name:</strong> {leaveDetail.applicant_name}
                </p>
                <p>
                  <strong className="text-purple-700">Role:</strong> {leaveDetail.applicant_type}
                </p>
                <p>
                  <strong className="text-purple-700">Applied On:</strong> {leaveDetail.applied_on}
                </p>
                <p>
                  <strong className="text-purple-700">Leave Date:</strong> {leaveDetail.leave_date}
                </p>
                <p>
                  <strong className="text-purple-700">Message:</strong> {leaveDetail.message}
                </p>
                <p>
                  <strong className="text-purple-700">Status:</strong> {leaveDetail.status}
                </p>
              </div>
            </div>
          ) : (
            <p className="mt-4 text-gray-600">No leave details found.</p>
          )}
        </div>
      </div>
    </MainLayout>
  );
};

export default LeaveDetail;
