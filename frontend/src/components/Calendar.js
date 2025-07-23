import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import LazyDragDrop, { useDragDropComponents } from './common/LazyDragDrop';
import AddDutyModal from './duties/AddDutyModal';
import EditAssigneeModal from './assignments/EditAssigneeModal';
import ConfirmationModal from './common/ConfirmationModal';
import Button from './common/ui/Button'; // Import the Button component

const Calendar = () => {
  const [assignments, setAssignments] = useState([]);
  const [people, setPeople] = useState([]);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [loading, setLoading] = useState(true);
  const [resetting, setResetting] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedAssignment, setSelectedAssignment] = useState(null);
  const [isMobileView, setIsMobileView] = useState(window.innerWidth < 768);
  const [showCompletionConfirmation, setShowCompletionConfirmation] = useState(false);
  const [assignmentToComplete, setAssignmentToComplete] = useState(null);
  
  // Get drag and drop components
  const dragDropComponents = useDragDropComponents();
  
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
  
  // Add responsive handler
  useEffect(() => {
    const handleResize = () => {
      setIsMobileView(window.innerWidth < 768);
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  
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
  
  const handleCompleteClick = (assignment) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Reset time part for accurate date comparison
    
    const assignmentDate = new Date(assignment.assigned_date);
    assignmentDate.setHours(0, 0, 0, 0);
    
    // If the assignment date is today or in the past, complete it directly
    if (assignmentDate <= today) {
      markAsCompleted(assignment.id);
    } else {
      // If the assignment date is in the future, show confirmation modal
      setAssignmentToComplete(assignment);
      setShowCompletionConfirmation(true);
    }
  };
  
  const confirmCompletion = () => {
    if (assignmentToComplete) {
      markAsCompleted(assignmentToComplete.id);
      setShowCompletionConfirmation(false);
      setAssignmentToComplete(null);
    }
  };
  
  const cancelCompletion = () => {
    setShowCompletionConfirmation(false);
    setAssignmentToComplete(null);
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
  
  const goToCurrentWeek = () => {
    setCurrentDate(new Date());
    toast.info('Returned to current week');
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
  
  const openEditAssigneeModal = (assignment) => {
    setSelectedAssignment(assignment);
    setShowEditModal(true);
  };
  
  const closeEditAssigneeModal = () => {
    setShowEditModal(false);
    setSelectedAssignment(null);
  };
  
  const handleDutyAdded = (newAssignment) => {
    setAssignments([...assignments, newAssignment]);
  };
  
  const handleAssigneeUpdated = (updatedAssignment) => {
    setAssignments(
      assignments.map(a => 
        a.id === updatedAssignment.id ? updatedAssignment : a
      )
    );
  };
  
  const daysOfWeek = getDaysOfWeek();
  const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const shortDayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  
  if (loading) {
    return <div className="text-center mt-3">Loading calendar...</div>;
  }
  
  // Helper function to get abbreviated day name for mobile
  const getDayName = (index) => {
    return isMobileView ? shortDayNames[index] : dayNames[index];
  };
  
  return (
    <div>
      <h1 className="mb-3">Duty Calendar</h1>
      
      <div className="flex-between mb-3">
        <Button 
          variant="secondary" 
          onClick={goToCurrentWeek}
          title="Go to current week"
        >
          {isMobileView ? 'Today' : 'Current Week'}
        </Button>
        <Button 
          variant="danger" 
          onClick={resetWeek}
          disabled={resetting || assignments.length === 0}
        >
          {resetting ? 'Resetting...' : 'Reset All Assignments'}
        </Button>
      </div>
      
      <div className="responsive-container">
        <div className="calendar">
        <div className="calendar-header">
          <Button onClick={prevWeek}>
            {isMobileView ? '← Prev' : '← Previous Week'}
          </Button>
          <h2>
            {formatDate(daysOfWeek[0])} to {formatDate(daysOfWeek[6])}
          </h2>
          <Button onClick={nextWeek}>
            {isMobileView ? 'Next →' : 'Next Week →'}
          </Button>
        </div>
        
        <div className="calendar-grid">
          {/* Day headers */}
          {daysOfWeek.map((day, index) => {
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            const dayDate = new Date(day);
            dayDate.setHours(0, 0, 0, 0);
            const isToday = dayDate.getTime() === today.getTime();
            const isPast = dayDate < today;
            
            return (
              <div 
                key={formatDate(day)} 
                className={`calendar-day-header ${isToday ? 'today' : ''} ${isPast ? 'past-date' : ''}`}
              >
                {getDayName(index)}
                <div>{formatDate(day)}</div>
              </div>
            );
          })}
          
          {/* Calendar days */}
          <LazyDragDrop onDragEnd={handleDragEnd}>
            {daysOfWeek.map((day, index) => {
              const { Droppable, Draggable } = dragDropComponents || {};
              
              if (!dragDropComponents) {
                return (
                  <div key={formatDate(day)} className="calendar-day">
                    <div className="text-center p-4">Loading...</div>
                  </div>
                );
              }
              
              return (
                <Droppable key={formatDate(day)} droppableId={formatDate(day)}>
                  {(provided) => (
                    <div
                      className={`calendar-day ${(() => {
                        const today = new Date();
                        today.setHours(0, 0, 0, 0);
                        const dayDate = new Date(day);
                        dayDate.setHours(0, 0, 0, 0);
                        return dayDate < today ? 'past-date' : '';
                      })()}`}
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
                              {/* Only show delete button for pending duties */}
                              {assignment.status === 'pending' && (
                                <button 
                                  className="btn btn-sm btn-danger"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    deleteAssignment(assignment.id);
                                  }}
                                  title="Delete assignment"
                                >
                                  ×
                                </button>
                              )}
                            </div>
                            <div className="duty-info">
                              <small>{assignment.person_name}</small>
                              {assignment.status === 'completed' && (
                                <span className="completed-badge" title="Completed">✓</span>
                              )}
                            </div>
                            <div className="duty-actions mt-1">
                              {assignment.status === 'pending' && (
                                <>
                                  <Button
                                    variant="success"
                                    size="small"
                                    onClick={() => handleCompleteClick(assignment)}
                                  >
                                    {isMobileView ? '✓' : 'Complete'}
                                  </Button>
                                  <Button
                                    variant="primary"
                                    size="small"
                                    className="ml-1"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      openEditAssigneeModal(assignment);
                                    }}
                                  >
                                    {isMobileView ? '✎' : 'Edit'}
                                  </Button>
                                </>
                              )}
                            </div>
                          </div>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                    
                    {/* Add duty button - only show for today and future dates */}
                    {(() => {
                      const today = new Date();
                      today.setHours(0, 0, 0, 0); // Reset time part for accurate date comparison
                      
                      const dayDate = new Date(day);
                      dayDate.setHours(0, 0, 0, 0);
                      
                      // Only show add button if the date is today or in the future
                      if (dayDate >= today) {
                        return (
                          <div 
                            className="add-duty-button"
                            onClick={() => openAddDutyModal(formatDate(day))}
                          >
                            <span>+</span>
                          </div>
                        );
                      }
                      
                      // For past dates, show a disabled indicator or nothing
                      return (
                        <div className="past-date-indicator">
                          <small>Past date</small>
                        </div>
                      );
                    })()}
                  </div>
                )}
              </Droppable>
            );
            })}
          </LazyDragDrop>
        </div>
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
      
      {/* Edit Assignee Modal */}
      {showEditModal && selectedAssignment && (
        <EditAssigneeModal
          assignment={selectedAssignment}
          onClose={closeEditAssigneeModal}
          onAssigneeUpdated={handleAssigneeUpdated}
        />
      )}
      
      {/* Completion Confirmation Modal */}
      {showCompletionConfirmation && assignmentToComplete && (
        <ConfirmationModal
          title="Confirm Early Completion"
          message={`This duty is scheduled for ${assignmentToComplete.assigned_date}, which is in the future. Are you sure you want to mark it as completed now?`}
          onConfirm={confirmCompletion}
          onCancel={cancelCompletion}
        />
      )}
    </div>
  );
};

export default Calendar;