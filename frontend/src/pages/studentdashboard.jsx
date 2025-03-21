import React from "react";
import MainLayout from "../layout/MainLayout";
import { useSelector } from "react-redux";



// Quick Actions for Student Dashboard
const quickActions = [
  {
    title: "Subjects",
    description: "Start your study here",
    href: "/lms",
    image: "/books.webp",
  },
  {
    title: "Pricipal",
    description: "Contact to the principal",
  },
  {
    title: "Class Teacher",
    description: "Contact to class teacher",
  },
  {
    title: "Payment",
    description: "See your payment details",
  },
  {
    title: "Student help desk",
    description: "Have a question or an issue? We can help."
  },
  {
    title: "Library",
    description: "Access a world of knowledge"
  }
];

const StudentHomePage = () => {
  const { first_name, last_name} = useSelector((state) => state.user);

  return (
    <MainLayout>
      <div className="min-h-screen bg-gray-50 p-6">
        {/* Hero Section */}
        <div className="bg-gradient-to-r from-purple-600 to-purple-500 rounded-lg shadow p-8 mb-8 ">
          <h1 className="text-3xl font-bold text-white">Hello,{first_name} {last_name} </h1>
          <p className="mt-2 text-lg text-white">
            Explore your dashboard and get started on your learning journey.
          </p>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {quickActions.map((action, index) => (
            <a
              key={index}
              href={action.href}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-white rounded-lg shadow hover:shadow-xl transition transform hover:-translate-y-1 p-6 flex flex-col items-center text-center"
            >
              <img
                src={action.image}
                alt={action.title}
                className="h-20 w-20 object-contain mb-4"
              />
              <h3 className="text-xl font-semibold text-gray-800">
                {action.title}
              </h3>
              <p className="text-gray-600 mt-2 text-sm">
                {action.description}
              </p>
            </a>
          ))}
        </div>
      </div>
    </MainLayout>
  );
};

export default StudentHomePage;
