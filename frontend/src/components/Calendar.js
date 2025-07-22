import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { toast } from 'react-toastify';
import AddDutyModal from './duties/AddDutyModal';

const Calendar = () => {
  const [assignments, setAssignments] = useState([]);
  const [people, setPeople] = useState([]);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [loading, setLoading] = useState(true);
  const [resetting, setResetting] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Get start and end dates for the week
        const startDate = getStartOfWeek(currentDate);
        const endDate = getEndOfWeek(currentDate);
        
        const startDateStr = formatDate(startDate);
        const endDateStr = formatDate(endDate);
        
        // Fetch assignments for the week
        const [assignmentsRes, peopleRes] = await Promise.all([
          axios.get(`/api/assignments?start_date=${startDateStr}&end_date=${endDateStr}`),
          axios.get('/api/people')
        ]);
        
        setAssignments(assignmentsRes.data);
        setPeople(peopleRes.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching calendar data:', error);
        setLoading(false);
        toast.error('Failed to load calendar data');
      }
    };
    
    fetchData();
  }, [currentDate]);
  
  const getStartOfWeek = (date) => {
    const d = new Date(date);
    const day = d.getDay();
    const diff = d.getDate() - day;
    return new Date(d.setDate(diff));
  };
  
  const getEndOfWeek = (date) => {
    const d = new Date(date);
    const day = d.getDay();
    const diff = d.getDate() - day + 6;
    return new Date(d.setDate(diff));
  };
  
  const formatDate = (date) => {
    return date.toISOString().split('T')[0];
  };
  
  const getDaysOfWeek = () => {
    const days = [];
    const startDate = getStartOfWeek(currentDate);
    
    for (let i = 0; i < 7; i++) {
      const day = new Date(startDate);
      day.setDate(startDate.getDate() + i);
      days.push(day);
    }
    
    return days;
  };
  
  const getAssignmentsForDay = (date) => {
    const dateStr = formatDate(date);
    return assignments.filter(a => a.assigned_date === dateStr);
  };
  
  const handleDragEnd = async (result) => {
    if (!result.destination) return;
    
    const { draggableId, destination } = result;
    const assignmentId = parseInt(draggableId.split('-')[1]);
    const destinationDay = destination.droppableId;
    
    try {
      // Find the assignment
      const assignment = assignments.find(a => a.id === assignmentId);
      
      // Update the assignment date
      await axios.put(`/api/assignments/${assignmentId}`, {
        person_id: assignment.person_id,
        assigned_date: destinationDay,
        due_date: destinationDay
      });
      
      // Update local state
      setAssignments(
        assignments.map(a => 
          a.id === assignmentId 
            ? { ...a, assigned_date: destinationDay, due_date: destinationDay } 
            : a
        )
      );
      
      toast.success('Assignment moved successfully');
    } catch (error) {
      console.error('Error updating assignment:', error);
      toast.error('Failed to move assignment');
    }
  };
  
  const markAsCompleted = async (id) => {
    try {
      await axios.put(`/api/assignments/${id}/complete`);
      
      // Update local state
      setAssignments(
        assignments.map(a => 
          a.id === id ? { ...a, status: 'completed' } : a
        )
      );
      
      toast.success('Duty marked as completed');
    } catch (error) {
      console.error('Error marking duty as completed:', error);
      toast.error('Failed to mark duty as completed');
    }
  };
  
  const deleteAssignment = async (id) => {
    if (window.confirm('Are you sure you want to delete this assignment?')) {
      try {
        await axios.delete(`/api/assignments/${id}`);
        
        // Update local state
        setAssignments(assignments.filter(a => a.id !== id));
        
        toast.success('Assignment deleted successfully');
      } catch (error) {
        console.error('Error deleting assignment:', error);
        toast.error('Failed to delete assignment');
      }
    }
  };
  
  const nextWeek = () => {
    const next = new Date(currentDate);
    next.setDate(currentDate.getDate() + 7);
    setCurrentDate(next);
  };
  
  const prevWeek = () => {
    const prev = new Date(currentDate);
    prev.setDate(currentDate.getDate() - 7);
    setCurrentDate(prev);
  };
  
  const resetWeek = async () => {
    if (window.confirm('Are you sure you want to reset all assignments for this week? This action cannot be undone.')) {
      try {
        setResetting(true);
        const startDate = formatDate(getStartOfWeek(currentDate));
        const endDate = formatDate(getEndOfWeek(currentDate));
        
        await axios.delete(`/api/admin/reset-assignments?start_date=${startDate}&end_date=${endDate}`);
        
        // Update local state
        setAssignments([]);
        
        toast.success('All assignments for this week have been reset');
        setResetting(false);
      } catch (error) {
        console.error('Error resetting assignments:', error);
        toast.error('Failed to reset assignments');
        setResetting(false);
      }
    }
  };
  
  const openAddDutyModal = (date) => {
    setSelectedDate(date);
    setShowAddModal(true);
  };
  
  const closeAddDutyModal = () => {
    setShowAddModal(false);
    setSelectedDate(null);
  };
  
  const handleDutyAdded = (newAssignment) => {
    setAssignments([...assignments, newAssignment]);
  };
  
  const daysOfWeek = getDaysOfWeek();
  const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  
  if (loading) {
    return <div className="text-center mt-3">Loading calendar...</div>;
  }
  
  return (
    <div>
      <h1 className="mb-3">Duty Calendar</h1>
      
      <div className="flex-between mb-3">
        <div></div>
        <button 
          className="btn btn-danger" 
          onClick={resetWeek}
          disabled={resetting || assignments.length === 0}
        >
          {resetting ? 'Resetting...' : 'Reset All Assignments'}
        </button>
      </div>
      
      <div className="calendar">
        <div className="calendar-header">
          <button className="btn" onClick={prevWeek}>
            &lt; Previous Week
          </button>
          <h2>
            {formatDate(daysOfWeek[0])} to {formatDate(daysOfWeek[6])}
          </h2>
          <button className="btn" onClick={nextWeek}>
            Next Week &gt;
          </button>
        </div>
        
        <div className="calendar-grid">
          {/* Day headers */}
          {dayNames.map((day, index) => (
            <div key={day} className="calendar-day-header">
              {day}
              <div>{formatDate(daysOfWeek[index])}</div>
            </div>
          ))}
          
          {/* Calendar days */}
          <DragDropContext onDragEnd={handleDragEnd}>
            {daysOfWeek.map((day, index) => (
              <Droppable key={formatDate(day)} droppableId={formatDate(day)}>
                {(provided) => (
                  <div
                    className="calendar-day"
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                  >
                    {getAssignmentsForDay(day).map((assignment, idx) => (
                      <Draggable
                        key={`assignment-${assignment.id}`}
                        draggableId={`assignment-${assignment.id}`}
                        index={idx}
                      >
                        {(provided) => (
                          <div
                            className={`duty-item ${assignment.status}`}
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                          >
                            <div className="flex-between">
                              <div>{assignment.duty_name}</div>
                              <button 
                                className="btn btn-sm btn-danger"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  deleteAssignment(assignment.id);
                                }}
                              >
                                ×
                              </button>
                            </div>
                            <div><small>Assigned to: {assignment.person_name}</small></div>
                            {assignment.status === 'pending' && (
                              <button
                                className="btn btn-sm btn-success mt-1"
                                onClick={() => markAsCompleted(assignment.id)}
                              >
                                Complete
                              </button>
                            )}
                          </div>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                    
                    {/* Add duty button */}
                    <div 
                      className="add-duty-button"
                      onClick={() => openAddDutyModal(formatDate(day))}
                    >
                      <span>+</span>
                    </div>
                  </div>
                )}
              </Droppable>
            ))}
          </DragDropContext>
        </div>
      </div>
      
      {/* Add Duty Modal */}
      {showAddModal && (
        <AddDutyModal
          date={selectedDate}
          onClose={closeAddDutyModal}
          onDutyAdded={handleDutyAdded}
        />
      )}
    </div>
  );
};

export default Calendar;