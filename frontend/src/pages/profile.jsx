import React from "react";
import MainLayout from "../layout/MainLayout";
import { useSelector } from "react-redux";

const Profile = () => {
  // Retrieve user data from Redux store
  const user = useSelector((state) => state.user || {});
  const {
    first_name,
    last_name,
    role = "",
    email,
    phone,
    address,
    date_of_birth,
    date_of_joining,
    parents,
    username,
    class: studentClass,
    classes,
    subjects,
    gender,
  } = user;

  const userRole = role.toLowerCase();

  const capitalize = (str) =>
    !str ? "" : str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();

  const hasSubjects = Array.isArray(subjects) && subjects.length > 0;
  const hasClasses = Array.isArray(classes) && classes.length > 0;

  return (
    <MainLayout>
      <div className="min-h-screen bg-gray-50 py-10">
        <div className="max-w-7xl mx-auto px-4">
          {/* Profile Header */}
          <div className="flex flex-col items-center md:flex-row md:items-end gap-6 mb-10">
            {/* Avatar */}
            <div className="w-32 h-32 relative">
              <img
                src={"/defaultProfile.JPG"}
                alt="Profile Avatar"
                className="w-32 h-32 object-cover rounded-full shadow-md border-4 border-white"
              />
            </div>

            <div className="flex-1 text-center md:text-left">
              <h2 className="text-3xl font-bold text-gray-800">
                {capitalize(first_name)} {capitalize(last_name)}
              </h2>
              <p className="text-gray-600 text-lg">{capitalize(userRole)}</p>
            </div>
          </div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Personal Information */}
            <div className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition duration-200">
              <h3 className="text-xl font-semibold mb-4 text-gray-800 border-b pb-2">
                Personal Information
              </h3>
              <ul className="space-y-3 text-gray-700">
                <li>
                  <span className="font-semibold">Email:</span> {email || "—"}
                </li>
                <li>
                  <span className="font-semibold">Phone:</span> {phone || "—"}
                </li>
                <li>
                  <span className="font-semibold">Gender:</span> {gender || "—"}
                </li>
                <li>
                  <span className="font-semibold">Address:</span>{" "}
                  {address || "—"}
                </li>

                {/* Conditional fields by role */}
                {userRole === "student" && (
                  <>
                    <li>
                      <span className="font-semibold">Date of Birth:</span>{" "}
                      {date_of_birth || "—"}
                    </li>
                    <li>
                      <span className="font-semibold">Parents/Guardian:</span>{" "}
                      {parents || "—"}
                    </li>
                  </>
                )}

                {userRole === "teacher" && (
                  <>
                    <li>
                      <span className="font-semibold">Date of Joining:</span>{" "}
                      {date_of_joining || "—"}
                    </li>
                  </>
                )}

                {(userRole === "principal" ||
                  userRole === "admin" ||
                  userRole === "accountant") && (
                  <>
                    {/* Add any specific fields for principal/admin/accountant
                        if needed, such as date_of_hire, etc. */}
                  </>
                )}
              </ul>
            </div>

            {/* Academic / Role-Specific Information */}
            <div className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition duration-200">
              <h3 className="text-xl font-semibold mb-4 text-gray-800 border-b pb-2">
                {userRole === "student" || userRole === "teacher"
                  ? "Academic Information"
                  : "Profile Details"}
              </h3>
              <ul className="space-y-3 text-gray-700">
                <li>
                  <span className="font-semibold">Username:</span>{" "}
                  {username || "—"}
                </li>

                {/* Student-specific info */}
                {userRole === "student" && studentClass && (
                  <li>
                    <span className="font-semibold">Class:</span>{" "}
                    {`${studentClass.class_name} (Code: ${studentClass.class_code})`}
                  </li>
                )}

                {/* Teacher-specific info: classes, etc. */}
                {userRole === "teacher" && hasClasses && (
                  <li>
                    <span className="font-semibold">Assigned Classes:</span>
                    <div className="mt-1 ml-4 text-sm">
                      {classes.map((cls) => (
                        <div key={cls.id} className="text-gray-600">
                          {cls.class_name} (Code: {cls.class_code})
                        </div>
                      ))}
                    </div>
                  </li>
                )}

                {/* Principal/Admin/Accountant can have additional fields if necessary */}
                {(userRole === "principal" ||
                  userRole === "admin" ||
                  userRole === "accountant") && (
                  <>{/* Placeholder for role-specific info */}</>
                )}
              </ul>
            </div>
          </div>

          {/* Subjects Section: applicable if user has "subjects" array */}
          {hasSubjects && (
            <div className="bg-white mt-6 p-6 rounded-lg shadow hover:shadow-lg transition duration-200">
              <h3 className="text-xl font-semibold mb-4 text-gray-800 border-b pb-2">
                {userRole === "teacher" ? "Subjects You Teach" : "Subjects"}
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {subjects.map((subject) => (
                  <div
                    key={subject.id}
                    className="border border-gray-200 p-4 rounded-md text-gray-700 flex flex-col"
                  >
                    <span className="font-semibold">
                      {subject.subject_name}
                    </span>
                    <span className="text-sm text-gray-500">
                      Code: {subject.subject_code}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Footer Spacer or additional info if needed */}
          <div className="py-8"></div>
        </div>
      </div>
    </MainLayout>
  );
};

export default Profile;
