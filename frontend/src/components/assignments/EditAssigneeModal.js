import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import { toast } from 'react-toastify';
import BaseModal from '../common/modal/BaseModal';
import ModalHeader from '../common/modal/ModalHeader';
import ModalBody from '../common/modal/ModalBody';
import ModalFooter from '../common/modal/ModalFooter';
import TextInput from '../common/ui/TextInput';
import Select from '../common/ui/Select';
import Button from '../common/ui/Button';

/**
 * EditAssigneeModal component for editing assignment assignees
 *
 * @param {Object} props - Component props
 * @param {Object} props.assignment - The assignment to edit
 * @param {Function} props.onClose - Function to call when the modal is closed
 * @param {Function} props.onAssigneeUpdated - Function to call when the assignee is updated
 * @param {boolean} props.isOpen - Whether the modal is open
 * @returns {JSX.Element} - Rendered component
 */
const EditAssigneeModal = ({ assignment, onClose, onAssigneeUpdated, isOpen = true }) => {
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

    if (isOpen) {
      fetchPeople();
    }
  }, [assignment, isOpen]);

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
        due_date: assignment.due_date,
      });

      // Find the selected person's name for the UI update
      const person = people.find((p) => p.id === parseInt(selectedPerson));

      // Create updated assignment object for the parent component
      const updatedAssignment = {
        ...assignment,
        person_id: parseInt(selectedPerson),
        person_name: person ? person.name : 'Unknown',
      };

      toast.success('Assignee updated successfully');
      onAssigneeUpdated(updatedAssignment);
      onClose();
    } catch (error) {
      console.error('Error updating assignee:', error);
      toast.error('Failed to update assignee');
    }
  };

  // Convert people array to options format for Select component
  const peopleOptions = people.map((person) => ({
    value: person.id.toString(),
    label: person.name,
  }));

  return (
    <BaseModal isOpen={isOpen} onClose={onClose} size="medium">
      <ModalHeader onClose={onClose}>Edit Assignee</ModalHeader>
      <ModalBody>
        {loading ? (
          <div className="text-center py-4">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-light-300 border-t-primary-600"></div>
            <p className="mt-2 text-dark-800 dark:text-light-200">Loading...</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} id="edit-assignee-form">
            <div className="mb-4">
              <label
                htmlFor="duty"
                className="block text-sm font-medium text-dark-800 dark:text-light-200 mb-1"
              >
                Duty
              </label>
              <TextInput
                id="duty"
                name="duty"
                value={assignment.duty_name}
                onChange={() => {}}
                disabled={true}
              />
              <p className="mt-1 text-sm text-light-500 dark:text-light-400">
                Duty cannot be changed
              </p>
            </div>

            <div className="mb-4">
              <label
                htmlFor="person"
                className="block text-sm font-medium text-dark-800 dark:text-light-200 mb-1"
              >
                Assign To
              </label>
              <Select
                id="person"
                name="person"
                value={selectedPerson}
                onChange={(e) => setSelectedPerson(e.target.value)}
                options={peopleOptions}
                placeholder="Select a person"
                required
                disabled={people.length === 0}
              />
            </div>

            <div className="mb-4">
              <label
                htmlFor="date"
                className="block text-sm font-medium text-dark-800 dark:text-light-200 mb-1"
              >
                Date
              </label>
              <TextInput
                id="date"
                name="date"
                value={assignment.assigned_date}
                onChange={() => {}}
                disabled={true}
              />
            </div>
          </form>
        )}
      </ModalBody>
      <ModalFooter>
        <Button variant="secondary" onClick={onClose}>
          Cancel
        </Button>
        <Button
          variant="primary"
          type="submit"
          form="edit-assignee-form"
          disabled={loading || people.length === 0}
        >
          Update Assignee
        </Button>
      </ModalFooter>
    </BaseModal>
  );
};

EditAssigneeModal.propTypes = {
  assignment: PropTypes.shape({
    id: PropTypes.number.isRequired,
    duty_name: PropTypes.string.isRequired,
    person_id: PropTypes.number,
    assigned_date: PropTypes.string.isRequired,
    due_date: PropTypes.string,
  }).isRequired,
  onClose: PropTypes.func.isRequired,
  onAssigneeUpdated: PropTypes.func.isRequired,
  isOpen: PropTypes.bool,
};

export default EditAssigneeModal;
