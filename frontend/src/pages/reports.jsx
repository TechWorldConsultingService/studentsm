// import React from 'react'

// const ComputerSyllabus = () => {
//   return (
//     <div>ComputerSyllabus</div>
//   )
// }

// export default ComputerSyllabus
import React, { useState, useEffect } from "react";
import axios from "axios";

const Reports = () => {
    const [syllabus, setSyllabus] = useState([]);

    useEffect(() => {
        axios.get("http://localhost:8000/api/syllabus/")
            .then((response) => setSyllabus(response.data))
            .catch((error) => console.error(error));
    }, []);

    return (
        <div>
            <h1>Syllabus Progress</h1>
            {syllabus.map((item) => (
                <div key={item.id}>
                    <h3>{item.class_assigned} - {item.subject}</h3>
                    <p>Topics: {item.topics}</p>
                    <p>Completed Topics: {item.completed_topics}</p>
                    <p>Completion: {item.completion_percentage}%</p>
                </div>
            ))}
        </div>
    );
};

export default Reports;
