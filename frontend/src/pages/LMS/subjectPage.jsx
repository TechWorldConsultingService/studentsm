import React from "react";
import { useParams } from "react-router-dom";
import SubjectLayout from "../../layout/SubjectLayout";

const SubjectPage = () => {
  const { subjectName } = useParams(); // Get the subject name from the URL

  return (
    <SubjectLayout>
      <div>
        <h1 className="text-2xl font-bold">
          {subjectName.charAt(0).toUpperCase() + subjectName.slice(1)} Page
        </h1>
        <p>Content for the subject: {subjectName}</p>
      </div>
    </SubjectLayout>
  );
};

export default SubjectPage;
