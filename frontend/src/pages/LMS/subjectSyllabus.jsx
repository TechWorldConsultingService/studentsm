import axios from "axios";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";




const SubjectSyllabus = () => {
  const [syllabusData, setSyllabusData] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const {access,class: userClass} = useSelector((state) => state.user);
console.log(access)
console.log(userClass)

  const fetchSyllabusData = async () => {
    if (!access) {
      setErrorMessage("User is not authenticated. Please Login.");
      return;
    }
    try {
      setIsLoading(true);
      const { data } = await axios.get(`http://localhost:8000/api/syllabus/class/${userClass.class_code}/`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${access}`,
        },
      });

      setSyllabusData(data);
    } catch (error) {
      setErrorMessage("Error fetching leave data.", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchSyllabusData();
  }, [access]);

  return (
    <div className="flex flex-col items-center gap-2 w-full">
      {errorMessage ? (
        <p>{errorMessage}</p>
      ) : isLoading ? (
        <p>Loading...</p>
      ) : (
        <div>
          Subject Syllabugs
          {
          syllabusData.length >0 ? syllabusData.map((item) =>{
            return(
<div>
  <h1>syllabus data</h1>
  {item.topics}
  </div>
            )
          }):(
            <p>syllabus data not found</p>
          )
        }
          </div>
      )}
    </div>
  );
};

export default SubjectSyllabus;
