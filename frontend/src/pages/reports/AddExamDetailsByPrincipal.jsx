import React, { useState, useEffect } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { useParams } from "react-router-dom";
import MainLayout from "../../layout/MainLayout";
import { useSelector } from "react-redux";
import CreateExamDetailModal from "./CreateExamDetailModal";
import EditExamDetailModal from "./EditExamDetailModal";

const AddExamDetailsByPrincipal = () => {
  const { access } = useSelector((state) => state.user);
  const { examId } = useParams();
  const [examDetails, setExamDetails] = useState([]);
  const [exams, setExams] = useState([]);
  const [classes, setClasses] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDetail, setSelectedDetail] = useState(null);
  const [isConfirmDeleteOpen, setIsConfirmDeleteOpen] = useState(false);
  const [detailsToDelete, setDetailsToDelete] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      if (!access) {
        toast.error("User is not authenticated. Please log in.");
        return;
      }

      setIsLoading(true);
      try {
        const { data: examData } = await axios.get(
          `http://localhost:8000/api/exam-details/exam/${examId}/`,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${access}`,
            },
          }
        );
        setExamDetails(examData);

        const { data: examsData } = await axios.get(
          `http://localhost:8000/api/exams/${examId}`,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${access}`,
            },
          }
        );
        setExams(examsData);

        const { data: classesData } = await axios.get(
          "http://localhost:8000/api/classes/",
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${access}`,
            },
          }
        );
        setClasses(classesData);
      } catch (error) {
        toast.error("Error fetching data.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [access, examId]);

  const openAddDetailModal = () => {
    setSelectedDetail(null);
    setIsModalOpen(true);
  };

  const openEditDetailModal = (detail) => {
    setSelectedDetail(detail);
    setIsModalOpen(true);
  };

  const openViewDetailModal = (detail) => {
    setSelectedDetail(detail);
    setIsViewModalOpen(true); 
  };

  // const closeModal = () => {
  //   setIsModalOpen(false);
  //   setSelectedDetail(null);
  // };

  // Handle delete functionality
  const handleDeleteDetail = async () => {
    if (!access) {
      toast.error("User is not authenticated. Please log in.");
      return;
    }

    // Check if detailsToDelete is set correctly
    if (!detailsToDelete) {
      toast.error("Invalid detail ID. Please try again.");
      return;
    }

    try {
      console.log("Attempting to delete exam detail with ID:", detailsToDelete); // Log the ID

      await axios.delete(
        `http://localhost:8000/api/exam-details/${detailsToDelete}/`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${access}`,
          },
        }
      );

      // Update the state to remove the deleted exam detail
      setExamDetails((prevDetails) => ({
        ...prevDetails,
        exam_details: prevDetails.exam_details.filter(
          (detail) => detail.id !== detailsToDelete
        ),
      }));

      toast.success("Exam detail deleted successfully!");
      setIsConfirmDeleteOpen(false);
      setDetailsToDelete(null);
    } catch (error) {
      console.error("Error deleting exam detail:", error);
      toast.error("Error deleting exam detail.");
    }
  };

  const handleConfirmDelete = (detailId) => {
    console.log("Confirm delete for ID:", detailId);
    setDetailsToDelete(detailId);
    setIsConfirmDeleteOpen(true);
  };

  const handleCloseDeleteModal = () => {
    setIsConfirmDeleteOpen(false);
    setDetailsToDelete(null);
  };

  const handleSaveExamDetail = async (newDetail) => {
    try {
      if (selectedDetail) {
        // Update exam detail
        await axios.put(
          `http://localhost:8000/api/exam-details/${selectedDetail.id}/`,
          newDetail,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${access}`,
            },
          }
        );
        toast.success("Exam detail updated successfully!");
      } else {
        // Create new exam detail
        await axios.post("http://localhost:8000/api/exam-details/", newDetail, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${access}`,
          },
        });
        toast.success("Exam detail added successfully!");
      }

      // Fetch updated exam details
      const { data } = await axios.get(
        `http://localhost:8000/api/exam-details/exam/${examId}/`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${access}`,
          },
        }
      );
      setExamDetails(data);
      setIsModalOpen(false);
      setSelectedDetail(null);
    } catch (error) {
      toast.error("Error saving exam detail.");
    }
  };

  return (
    <MainLayout>
      <div className="bg-purple-50 p-6">
        <div className="bg-white p-6 rounded-lg shadow-lg border border-purple-300">
          <h1 className="text-3xl font-extrabold text-purple-800">
            Exam Details of {exams.name}
          </h1>
          <p className="mt-4 text-gray-600">
            Exam with their respective subjects.
          </p>

          {/* Button to add new exam detail */}
          <div className="mt-3 text-right">
            <button
              onClick={openAddDetailModal}
              className="bg-purple-700 text-white px-6 py-2 rounded-lg hover:bg-purple-800"
            >
              Add Subject
            </button>
          </div>

          {/* Loading indicator */}
          {isLoading && (
            <div className="mt-6 text-center">
              <p className="text-gray-600">Loading ...</p>
            </div>
          )}

          {/* List of exam details */}
          {!isLoading && examDetails?.exam_details?.length > 0 && (
            <div className="mt-6 overflow-x-auto">
              <h2 className="text-xl font-semibold text-purple-700">
                Subject Details List for Exam
              </h2>
              <table className="min-w-full table-auto mt-4">
                <thead>
                  <tr className="bg-purple-700 text-white">
                    <th className="px-6 py-3 text-left">Class</th>
                    <th className="px-6 py-3 text-left">Subject</th>
                    <th className="px-6 py-3 text-left">Exam Date</th>
                    <th className="px-6 py-3 text-left">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {examDetails?.exam_details?.map((detail) => (
                    <tr key={detail.id} className="border-b hover:bg-purple-50">
                      <td className="px-6 py-4">{detail.class_details.name}</td>
                      <td className="px-6 py-4">
                        {detail.subject.subject_name}
                      </td>
                      <td className="px-6 py-4">{detail.exam_date}</td>
                      <td className="px-6 py-4 flex gap-2">
                        <button
                          onClick={() => openViewDetailModal(detail)}
                          className="bg-purple-700 text-white px-4 py-2 rounded-lg hover:bg-purple-800 mr-2"
                        >
                          View
                        </button>
                        <button
                          onClick={() => openEditDetailModal(detail)}
                          className="bg-yellow-500 text-white px-4 py-2 rounded-lg hover:bg-yellow-600 mr-2"
                        >
                          Edit
                        </button>
                        {/* Delete Detail */}
                        <button
                          onClick={() => handleConfirmDelete(detail.id)}
                          className="bg-red-700 text-white px-4 py-2 rounded-lg hover:bg-red-800"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* No Exam Details */}
          {!isLoading && examDetails.length === 0 && (
            <div className="mt-4 text-gray-600">
              There are no subjects for this exam.
            </div>
          )}
        </div>

        {/* Modal for Confirm Delete */}
        {isConfirmDeleteOpen && detailsToDelete !== null && (
          <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex justify-center items-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg max-w-md mx-auto border border-purple-300">
              <h2 className="text-xl font-semibold text-purple-700 mb-4">
                Are you sure?
              </h2>
              <p className="mb-4">
                Do you really want to delete this exam detail?
              </p>
              <div className="mt-4 flex justify-end gap-4">
                <button
                  onClick={handleCloseDeleteModal}
                  className="text-sm text-gray-500 px-4 py-2 border rounded-lg hover:bg-gray-100"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDeleteDetail}
                  className="text-sm bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        )}

        {/* View Exam Details Modal */}
        {isViewModalOpen && selectedDetail && (
          <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex justify-center items-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg w-11/12 md:w-1/2">
              <h2 className="text-2xl font-bold text-purple-800">
                Exam Detail
              </h2>
              <div className="mt-4">
                <p className="text-gray-700">
                  <strong>Class:</strong> {selectedDetail.class_details.name}
                </p>
                <p className="text-gray-700">
                  <strong>Subject:</strong>{" "}
                  {selectedDetail.subject.subject_name}
                </p>
                <p className="text-gray-700">
                  <strong>Full Marks:</strong> {selectedDetail.full_marks}
                </p>
                <p className="text-gray-700">
                  <strong>Pass Marks:</strong> {selectedDetail.pass_marks}
                </p>
                <p className="text-gray-700">
                  <strong>Exam Date:</strong> {selectedDetail.exam_date}
                </p>
                <p className="text-gray-700">
                  <strong>Exam Time:</strong> {selectedDetail.exam_time}
                </p>
              </div>
              <div className="mt-6 text-center">
                <button
                  onClick={() => setIsViewModalOpen(false)}
                  className="bg-purple-700 text-white px-6 py-2 rounded-lg hover:bg-purple-800"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Modal for Adding/Editing Exam Details */}
        {isModalOpen && !selectedDetail && (
          <CreateExamDetailModal
            exams={exams}
            classes={classes}
            onSave={handleSaveExamDetail}
            onCancel={() => setIsModalOpen(false)}
          />
        )}

        {isModalOpen && selectedDetail && (
          <EditExamDetailModal
            examDetail={selectedDetail}
            exams={exams}
            classes={classes}
            onSave={handleSaveExamDetail}
            onCancel={() => setIsModalOpen(false)}
          />
        )}
      </div>
    </MainLayout>
  );
};

export default AddExamDetailsByPrincipal;
