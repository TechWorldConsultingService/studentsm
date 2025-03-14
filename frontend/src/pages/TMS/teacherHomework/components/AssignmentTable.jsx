import React from "react";

const AssignmentTable = ({
  assignments,
  onEdit,
  onView,
  onDelete,
  onViewSubmissions,
  showSubmissions = false,
}) => {
  if (!assignments?.length) return null;

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200 bg-white mt-2 border">
        <thead className="bg-gray-100">
          <tr>
            <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700">
              S.N.
            </th>
            <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700">
              Subject
            </th>
            <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700">
              Topic
            </th>
            <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700">
              Due Date
            </th>
            <th className="px-4 py-2 text-sm font-semibold text-gray-700">
              Action
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {assignments.map((assignment,index) => (
            <tr key={assignment.id}>
              <td className="px-4 py-2">{index+1}</td>
              <td className="px-4 py-2">{assignment.subject}</td>
              <td className="px-4 py-2">{assignment.assignment_name}</td>
              <td className="px-4 py-2">{assignment.due_date}</td>
              <td className="px-4 py-2 whitespace-nowrap space-x-3 text-sm">
                {showSubmissions ? (
                  <>
                    <button
                      onClick={() => onViewSubmissions(assignment)}
                      className="text-purple-600 hover:underline"
                    >
                      View Submissions
                    </button>
                    <button
                      onClick={() => onView(assignment)}
                      className="text-green-600 hover:underline"
                    >
                      View
                    </button>

                  </>
                ) : (
                  <>
                                      <button
                      onClick={() => onViewSubmissions(assignment)}
                      className="text-purple-600 hover:underline"
                    >
                      View Submissions
                    </button>
                    <button
                      onClick={() => onEdit(assignment)}
                      className="text-blue-600 hover:underline"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => onView(assignment)}
                      className="text-green-600 hover:underline"
                    >
                      View
                    </button>
                    <button
                      onClick={() => onDelete(assignment)}
                      className="text-red-600 hover:underline"
                    >
                      Delete
                    </button>
                  </>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AssignmentTable;
