// NewAssignment.js
import React, { useState } from 'react';

const NewAssignment = () => {
  const [subject, setSubject] = useState('');
  const [topics, setTopics] = useState('');
  const [description, setDescription] = useState('');
  const [dueDate, setDueDate] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('New Assignment Submitted:', { subject, topics, description, dueDate });
    setSubject('');
    setTopics('');
    setDescription('');
    setDueDate('');
  };

  return (
    <div className="bg-purple-50 p-6">
      <div className="bg-white p-6 rounded-lg shadow-lg border border-purple-300">
        <h1 className="text-3xl font-extrabold text-purple-800">Create New Assignment</h1>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div className="flex flex-col sm:flex-row sm:space-x-4 sm:space-y-0 space-y-4">
            <div className="flex flex-col w-full sm:w-1/2">
              <label className="text-purple-700 font-semibold" htmlFor="subject">Subject</label>
              <input
                type="text"
                id="subject"
                name="subject"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className="mt-2 p-2 rounded-lg border border-purple-300 focus:outline-none focus:ring-2 focus:ring-purple-500"
                required
              />
            </div>
            <div className="flex flex-col w-full sm:w-1/2">
              <label className="text-purple-700 font-semibold" htmlFor="topics">Topics</label>
              <input
                type="text"
                id="topics"
                name="topics"
                value={topics}
                onChange={(e) => setTopics(e.target.value)}
                className="mt-2 p-2 rounded-lg border border-purple-300 focus:outline-none focus:ring-2 focus:ring-purple-500"
                required
              />
            </div>
          </div>

          <div className="flex flex-col">
            <label className="text-purple-700 font-semibold" htmlFor="description">Description</label>
            <textarea
              id="description"
              name="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="mt-2 p-2 rounded-lg border border-purple-300 focus:outline-none focus:ring-2 focus:ring-purple-500"
              rows="4"
              required
            />
          </div>

          <div className="flex flex-col">
            <label className="text-purple-700 font-semibold" htmlFor="dueDate">Due Date</label>
            <input
              type="date"
              id="dueDate"
              name="dueDate"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              className="mt-2 p-2 rounded-lg border border-purple-300 focus:outline-none focus:ring-2 focus:ring-purple-500"
              required
            />
          </div>

          <div className="mt-6 text-center">
            <button type="submit" className="bg-purple-700 text-white px-6 py-2 rounded-lg hover:bg-purple-800 focus:outline-none">
              Submit Assignment
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default NewAssignment;
