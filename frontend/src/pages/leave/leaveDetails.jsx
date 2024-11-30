import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import MainLayout from "../../layout/MainLayout";
import { ImCross } from "react-icons/im";
import { useNavigate} from "react-router-dom";



const LeaveDetail = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [leaveDetail, setLeaveDetail] = useState(null);
  const [leaveError, setLeaveError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const {access} = useSelector((state) => state.user);


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
      <div className="flex  items-center justify-self-center bg-purple-300 w-[45%]   m-10 rounded-md shadow-2xl">
      <div className='flex flex-col items-center justify-center w-full rounded-md  ' >
        <div className="flex  bg-purple-800  w-full p-4 text-white font-semibold text-center text-lg ">
        <h4 className="text-center w-full">Leave Application Detail</h4>
        <ImCross onClick={() => navigate(-1)}/>
        </div>
        {leaveError ? (
          <p>{leaveError}</p>
        ) : isLoading ? (
          <p>Loading...</p>
        ) : leaveDetail ? (
          <div className="w-full p-2 pl-10 pb-7 ">
            <p><strong>Applicant Name:</strong> {leaveDetail.applicant_name}</p>
            <p><strong>Role:</strong> {leaveDetail.applicant_type}</p>
            <p><strong>Applied On:</strong> {leaveDetail.applied_on}</p>
            <p><strong>Leave Date:</strong> {leaveDetail.leave_date}</p>
            <p><strong>Message:</strong> {leaveDetail.message}</p>
            <p><strong>Status:</strong> {leaveDetail.status}</p>
          </div>
        ) : (
          <p>No leave details found.</p>
        )}
      </div>
      </div>
    </MainLayout>
  );
};

export default LeaveDetail;
