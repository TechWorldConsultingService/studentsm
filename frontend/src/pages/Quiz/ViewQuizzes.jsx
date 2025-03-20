import axios from "axios";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";
import { Divider, List, Modal } from "antd";
import React, { useEffect, useState } from "react";

export default function ViewQuizzes({ selectedQuizCategory, onClose }) {
  const { access } = useSelector((state) => state.user);

  const [, setLoading] = useState(false);
  const [quizList, setQuizList] = useState([]);

  useEffect(() => {
    if (selectedQuizCategory) {
      const fetchQuizQuetions = async () => {
        if (!access) {
          return toast.error("User is not authenticated. Please log in.");
        }
        setLoading(true);

        try {
          const { data } = await axios.get(
            // `http://localhost:8000/api/questions`,
            `http://localhost:8000/api/questions/by-quiz?quiz_id=${selectedQuizCategory.id}`,
            {
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${access}`,
              },
            }
          );
          setQuizList(data);
        } catch (error) {
          if (error.response && error.response.status === 401) {
            // navigate("/");
          } else {
            toast.error(
              "Error fetching quiz category: " + (error.message || error)
            );
          }
        } finally {
          setLoading(false);
        }
      };

      fetchQuizQuetions();
    }
  }, [selectedQuizCategory]);

  return (
    <Modal
      centered
      width={800}
      footer={null}
      onCancel={onClose}
      open={!!selectedQuizCategory}
      title={
        <h2 className="text-2xl font-bold text-purple-800 mb-4">
          View Quizzes
        </h2>
      }
    >
      {quizList.map((quiz) => (
        <div key={quiz.id}>
          <List
            size="small"
            header={<div className="font-bold">{quiz.question_text}</div>}
            footer={null}
            bordered
            dataSource={[
              quiz.option1,
              quiz.option2,
              quiz.option3,
              quiz.option4,
            ]}
            renderItem={(item) => (
              <List.Item
                className={
                  item === quiz.correct_answer
                    ? "bg-purple-700 !text-white"
                    : ""
                }
              >
                {item}
              </List.Item>
            )}
          />
          <Divider orientation="left"></Divider>
        </div>
      ))}
    </Modal>
  );
}
