import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

const EditAssigneeModal = ({ assignment, onClose, onAssigneeUpdated }) => {
  const [people, setPeople] = useState([]);
  const [selectedPerson, setSelectedPerson] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPeople = async () => {
      try {
        const res = await axios.get('/api/people');
        setPeople(res.data);
        
        // Set the current assignee as the default selected person
        if (assignment && assignment.person_id) {
          setSelectedPerson(assignment.person_id.toString());
        } else if (res.data.length > 0) {
          setSelectedPerson(res.data[0].id.toString());
        }
        
        setLoading(false);
      } catch (error) {
        console.error('Error fetching people:', error);
        toast.error('Failed to load people');
        setLoading(false);
      }
    };

    fetchPeople();
  }, [assignment]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!selectedPerson) {
      toast.error('Please select a person');
      return;
    }

    try {
      await axios.put(`/api/assignments/${assignment.id}`, {
        person_id: parseInt(selectedPerson),
        assigned_date: assignment.assigned_date,
        due_date: assignment.due_date
      });

      // Find the selected person's name for the UI update
      const person = people.find(p => p.id === parseInt(selectedPerson));
      
      // Create updated assignment object for the parent component
      const updatedAssignment = {
        ...assignment,
        person_id: parseInt(selectedPerson),
        person_name: person ? person.name : 'Unknown'
      };

      toast.success('Assignee updated successfully');
      onAssigneeUpdated(updatedAssignment);
      onClose();
    } catch (error) {
      console.error('Error updating assignee:', error);
      toast.error('Failed to update assignee');
    }
  };

  if (loading) {
    return (
      <div className="modal-overlay">
        <div className="modal">
          <div className="modal-header">
            <h2>Edit Assignee</h2>
            <button className="btn" onClick={onClose}>
              &times;
            </button>
          </div>
          <div className="modal-body text-center">Loading...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="modal-overlay">
      <div className="modal">
        <div className="modal-header">
          <h2>Edit Assignee</h2>
          <button className="btn" onClick={onClose}>
            &times;
          </button>
        </div>
        <div className="modal-body">
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Duty</label>
              <input
                type="text"
                value={assignment.duty_name}
                disabled
                className="form-control"
              />
              <small className="form-text">Duty cannot be changed</small>
            </div>

            <div className="form-group">
              <label htmlFor="person">Assign To</label>
              <select
                id="person"
                value={selectedPerson}
                onChange={(e) => setSelectedPerson(e.target.value)}
                required
              >
                {people.length === 0 ? (
                  <option value="">No people available</option>
                ) : (
                  people.map((person) => (
                    <option key={person.id} value={person.id}>
                      {person.name}
                    </option>
                  ))
                )}
              </select>
            </div>

            <div className="form-group">
              <label>Date</label>
              <input
                type="text"
                value={assignment.assigned_date}
                disabled
                className="form-control"
              />
            </div>

            <div className="modal-footer">
              <button type="button" className="btn" onClick={onClose}>
                Cancel
              </button>
              <button
                type="submit"
                className="btn btn-primary"
                disabled={people.length === 0}
              >
                Update Assignee
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditAssigneeModal;