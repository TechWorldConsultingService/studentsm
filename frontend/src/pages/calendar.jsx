import React, { useState, useEffect } from 'react';
import { Calendar as BigCalendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { Modal, Input, Button } from 'antd';
import axios from 'axios';
import MainLayout from '../layout/MainLayout';

const localizer = momentLocalizer(moment);

const MyCalendar = () => {
  const [events, setEvents] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [note, setNote] = useState("");

  // Fetch events from the server when the component mounts
  useEffect(() => {
    axios.get('http://localhost:8000/api/events/', {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    })
    .then(response => {
      setEvents(response.data.map(event => ({
        start: moment(event.start_time),
        end: moment(event.end_time),
        title: event.title,
        description: event.description
      })));
    })
    .catch(error => {
      console.error('Error fetching events:', error);
    });
  }, []);

  // Show modal when a date is selected
  const handleSelectSlot = ({ start }) => {
    setSelectedDate(start);
    setModalVisible(true);
  };

  // Save the note as an event
  const handleSaveNote = () => {
    if (note) {
      const newEvent = {
        title: note,
        description: note,
        start_time: selectedDate.toISOString(),  // Ensure it's an ISO string
        end_time: selectedDate.toISOString(),    // Ensure it's an ISO string
      };
      
      axios.post('http://localhost:8000/api/events/', newEvent, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      })
      .then(response => {
        // Add the new event to the list and close the modal
        setEvents([...events, {
          start: moment(response.data.start_time),
          end: moment(response.data.end_time),
          title: response.data.title,
          description: response.data.description
        }]);
        setNote("");
        setModalVisible(false);
      })
      .catch(error => {
        console.error('Error saving event:', error);
      });
    }
  };

  return (
    <MainLayout>
      <div>
        <BigCalendar
          localizer={localizer}
          events={events}
          selectable
          onSelectSlot={handleSelectSlot}
          startAccessor="start"
          endAccessor="end"
          style={{ height: 500 }}
        />

        <Modal
          title="Add Note"
          visible={modalVisible}
          onCancel={() => setModalVisible(false)}
          footer={[
            <Button key="cancel" onClick={() => setModalVisible(false)}>Cancel</Button>,
            <Button key="save" type="submit" onClick= {handleSaveNote }>Save</Button>
          ]}
        >
          <Input
            placeholder="Enter note"
            value={note}
            onChange={(e) => setNote(e.target.value)}
          />
        </Modal>
      </div>
    </MainLayout>
  );
};

export default MyCalendar;
