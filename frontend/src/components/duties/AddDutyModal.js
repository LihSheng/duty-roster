import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import { toast } from 'react-toastify';
import FrequencySelector from './FrequencySelector';
import BaseModal from '../common/modal/BaseModal';
import ModalHeader from '../common/modal/ModalHeader';
import ModalBody from '../common/modal/ModalBody';
import ModalFooter from '../common/modal/ModalFooter';
import Button from '../common/ui/Button';
import TextInput from '../common/ui/TextInput';
import TextArea from '../common/ui/TextArea';
import Select from '../common/ui/Select';
import Checkbox from '../common/ui/Checkbox';

/**
 * AddDutyModal component for adding new duties or assigning existing duties
 *
 * @param {Object} props - Component props
 * @param {string} props.date - The date to assign the duty to
 * @param {Function} props.onClose - Function to call when the modal is closed
 * @param {Function} props.onDutyAdded - Function to call when a duty is added
 * @param {boolean} props.isOpen - Whether the modal is open
 * @returns {JSX.Element} - Rendered component
 */
const AddDutyModal = ({ date, onClose, onDutyAdded, isOpen = true }) => {
  const [mode, setMode] = useState('existing'); // 'existing' or 'new'
  const [duties, setDuties] = useState([]);
  const [people, setPeople] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedDuty, setSelectedDuty] = useState('');
  const [selectedPerson, setSelectedPerson] = useState('');
  const [selectedPeople, setSelectedPeople] = useState([]);
  const [isGroupDuty, setIsGroupDuty] = useState(false);
  const [newDuty, setNewDuty] = useState({
    name: '',
    description: '',
    frequency: 'custom',
    days_of_week: [],
    is_group_duty: false,
  });

  // Special case for House keeping duty
  const isLastFridayOfMonth = (dateStr) => {
    const date = new Date(dateStr);
    // Check if it's a Friday (5)
    if (date.getDay() !== 5) {
      return false;
    }

    // Get the last day of the month
    const lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0);

    // If this is the last Friday, then there should be no more Fridays in the month
    const daysUntilEndOfMonth = lastDay.getDate() - date.getDate();

    // If there are less than 7 days until the end of the month, and it's a Friday,
    // then it's the last Friday of the month

    return daysUntilEndOfMonth < 7;
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [dutiesRes, peopleRes] = await Promise.all([
          axios.get('/api/duties'),
          axios.get('/api/people'),
        ]);

        setDuties(dutiesRes.data);
        setPeople(peopleRes.data);

        if (dutiesRes.data.length > 0) {
          setSelectedDuty(dutiesRes.data[0].id.toString());
          // Check if the first duty is a group duty
          setIsGroupDuty(dutiesRes.data[0].is_group_duty === 1);
        }

        if (peopleRes.data.length > 0) {
          setSelectedPerson(peopleRes.data[0].id.toString());
        }

        setLoading(false);
      } catch (error) {
        console.error('Error fetching data:', error);
        toast.error('Failed to load duties and people');
        setLoading(false);
      }
    };

    if (isOpen) {
      fetchData();
    }
  }, [isOpen]);

  const handleAddExistingDuty = async (e) => {
    e.preventDefault();

    if (!selectedDuty) {
      toast.error('Please select a duty');
      return;
    }

    // Get the selected duty to check if it's a group duty
    const duty = duties.find((d) => d.id === parseInt(selectedDuty));
    const isGroupDuty = duty && duty.is_group_duty === 1;

    // For group duties, we need at least one person selected
    // For individual duties, we need exactly one person
    if (isGroupDuty && selectedPeople.length === 0) {
      toast.error('Please select at least one person for this group duty');
      return;
    } else if (!isGroupDuty && !selectedPerson) {
      toast.error('Please select a person for this duty');
      return;
    }

    try {
      // First check if this duty is already assigned for this date
      const checkRes = await axios.get(`/api/assignments?start_date=${date}&end_date=${date}`);
      const existingAssignment = checkRes.data.find(
        (a) => a.duty_id === parseInt(selectedDuty) && a.assigned_date === date
      );

      if (existingAssignment && !isGroupDuty) {
        toast.warning('This duty is already assigned for this date');
        return;
      }

      let newAssignments = [];

      if (isGroupDuty) {
        // For group duties, create an assignment for each selected person
        const peopleToAssign = selectedPeople.length > 0 ? selectedPeople : [selectedPerson];

        for (const personId of peopleToAssign) {
          // Skip if this person already has this duty assigned for this date
          const alreadyAssigned = checkRes.data.find(
            (a) =>
              a.duty_id === parseInt(selectedDuty) &&
              a.person_id === parseInt(personId) &&
              a.assigned_date === date
          );

          if (alreadyAssigned) {
            continue;
          }

          const res = await axios.post('/api/assignments', {
            duty_id: parseInt(selectedDuty),
            person_id: parseInt(personId),
            assigned_date: date,
            due_date: date,
          });

          const person = people.find((p) => p.id === parseInt(personId));

          newAssignments.push({
            id: res.data.id,
            duty_id: parseInt(selectedDuty),
            person_id: parseInt(personId),
            duty_name: duty.name,
            person_name: person.name,
            description: duty.description,
            assigned_date: date,
            due_date: date,
            status: 'pending',
          });
        }

        if (newAssignments.length === 0) {
          toast.warning('All selected people already have this duty assigned for this date');
          return;
        }
      } else {
        // For individual duties, create a single assignment
        const res = await axios.post('/api/assignments', {
          duty_id: parseInt(selectedDuty),
          person_id: parseInt(selectedPerson),
          assigned_date: date,
          due_date: date,
        });

        const person = people.find((p) => p.id === parseInt(selectedPerson));

        newAssignments = [
          {
            id: res.data.id,
            duty_id: parseInt(selectedDuty),
            person_id: parseInt(selectedPerson),
            duty_name: duty.name,
            person_name: person.name,
            description: duty.description,
            assigned_date: date,
            due_date: date,
            status: 'pending',
          },
        ];
      }

      toast.success(
        `Duty assigned successfully to ${newAssignments.length} ${newAssignments.length === 1 ? 'person' : 'people'}`
      );

      // Notify parent component about all new assignments
      newAssignments.forEach((assignment) => {
        onDutyAdded(assignment);
      });

      onClose();
    } catch (error) {
      console.error('Error assigning duty:', error);
      toast.error('Failed to assign duty');
    }
  };

  const handleCreateNewDuty = async (e) => {
    e.preventDefault();

    if (!newDuty.name) {
      toast.error('Please enter a duty name');
      return;
    }

    // For group duties, we need at least one person selected
    // For individual duties, we need exactly one person
    if (isGroupDuty && selectedPeople.length === 0) {
      toast.error('Please select at least one person for this group duty');
      return;
    } else if (!isGroupDuty && !selectedPerson) {
      toast.error('Please select a person for this duty');
      return;
    }

    try {
      // Check if a duty with this name already exists
      const existingDuty = duties.find((d) => d.name.toLowerCase() === newDuty.name.toLowerCase());

      let dutyId;

      if (existingDuty) {
        // Use the existing duty
        dutyId = existingDuty.id;
        toast.info('Using existing duty with the same name');

        // Check if this duty is already assigned for this date
        const checkRes = await axios.get(`/api/assignments?start_date=${date}&end_date=${date}`);

        if (!isGroupDuty) {
          const existingAssignment = checkRes.data.find(
            (a) => a.duty_id === dutyId && a.assigned_date === date
          );

          if (existingAssignment) {
            toast.warning('This duty is already assigned for this date');
            return;
          }
        }
      } else {
        // Create a new duty
        const dutyRes = await axios.post('/api/duties', {
          name: newDuty.name,
          description: newDuty.description,
          frequency: newDuty.frequency,
          days_of_week: newDuty.days_of_week || [],
          is_group_duty: isGroupDuty,
        });
        dutyId = dutyRes.data.id;
      }

      let newAssignments = [];

      if (isGroupDuty) {
        // For group duties, create an assignment for each selected person
        const checkRes = await axios.get(`/api/assignments?start_date=${date}&end_date=${date}`);

        for (const personId of selectedPeople) {
          // Skip if this person already has this duty assigned for this date
          const alreadyAssigned = checkRes.data.find(
            (a) =>
              a.duty_id === dutyId && a.person_id === parseInt(personId) && a.assigned_date === date
          );

          if (alreadyAssigned) {
            continue;
          }

          const res = await axios.post('/api/assignments', {
            duty_id: dutyId,
            person_id: parseInt(personId),
            assigned_date: date,
            due_date: date,
          });

          const person = people.find((p) => p.id === parseInt(personId));

          newAssignments.push({
            id: res.data.id,
            duty_id: dutyId,
            person_id: parseInt(personId),
            duty_name: newDuty.name,
            person_name: person.name,
            description: newDuty.description,
            assigned_date: date,
            due_date: date,
            status: 'pending',
          });
        }

        if (newAssignments.length === 0) {
          toast.warning('All selected people already have this duty assigned for this date');
          return;
        }
      } else {
        // For individual duties, create a single assignment
        const assignmentRes = await axios.post('/api/assignments', {
          duty_id: dutyId,
          person_id: parseInt(selectedPerson),
          assigned_date: date,
          due_date: date,
        });

        const person = people.find((p) => p.id === parseInt(selectedPerson));

        newAssignments = [
          {
            id: assignmentRes.data.id,
            duty_id: dutyId,
            person_id: parseInt(selectedPerson),
            duty_name: newDuty.name,
            person_name: person.name,
            description: newDuty.description,
            assigned_date: date,
            due_date: date,
            status: 'pending',
          },
        ];
      }

      toast.success(
        `Duty assigned successfully to ${newAssignments.length} ${newAssignments.length === 1 ? 'person' : 'people'}`
      );

      // Notify parent component about all new assignments
      newAssignments.forEach((assignment) => {
        onDutyAdded(assignment);
      });

      onClose();
    } catch (error) {
      console.error('Error creating duty:', error);
      toast.error('Failed to create duty');
    }
  };

  const handleNewDutyChange = (e) => {
    const { name, value } = e.target;
    setNewDuty({
      ...newDuty,
      [name]: value,
    });
  };

  const handleGroupDutyChange = (e) => {
    const isGroup = e.target.checked;
    setIsGroupDuty(isGroup);
    setNewDuty({
      ...newDuty,
      is_group_duty: isGroup,
    });

    // Reset selections when switching between individual and group duty
    if (isGroup) {
      setSelectedPeople(selectedPerson ? [selectedPerson] : []);
    } else {
      setSelectedPerson(selectedPeople.length > 0 ? selectedPeople[0] : '');
    }
  };

  const handlePersonSelection = (e) => {
    setSelectedPerson(e.target.value);
  };

  const handleMultiplePersonSelection = (e) => {
    const options = e.target.options;
    const selectedValues = [];

    for (let i = 0; i < options.length; i++) {
      if (options[i].selected) {
        selectedValues.push(options[i].value);
      }
    }

    setSelectedPeople(selectedValues);
  };

  const handleFrequencyChange = (frequency, days) => {
    setNewDuty({
      ...newDuty,
      frequency,
      days_of_week: days,
    });
  };

  // Convert duties array to options format for Select component
  const dutyOptions = duties.map((duty) => ({
    value: duty.id.toString(),
    label: `${duty.name} ${duty.is_group_duty === 1 ? '(Group)' : ''}`,
  }));

  // Convert people array to options format for Select component
  const peopleOptions = people.map((person) => ({
    value: person.id.toString(),
    label: person.name,
  }));

  return (
    <BaseModal isOpen={isOpen} onClose={onClose} size="medium">
      <ModalHeader onClose={onClose}>Add Duty for {date}</ModalHeader>
      <ModalBody>
        {loading ? (
          <div className="text-center py-4">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-light-300 border-t-primary-600"></div>
            <p className="mt-2 text-dark-800 dark:text-light-200">Loading...</p>
          </div>
        ) : (
          <>
            <div className="mb-4 flex space-x-2">
              <Button
                variant={mode === 'existing' ? 'primary' : 'secondary'}
                onClick={() => setMode('existing')}
                className="flex-1"
              >
                Use Existing Duty
              </Button>
              <Button
                variant={mode === 'new' ? 'primary' : 'secondary'}
                onClick={() => setMode('new')}
                className="flex-1"
              >
                Create New Duty
              </Button>
            </div>

            {mode === 'existing' ? (
              <form onSubmit={handleAddExistingDuty} id="existing-duty-form">
                <div className="mb-4">
                  <label
                    htmlFor="duty"
                    className="block text-sm font-medium text-dark-800 dark:text-light-200 mb-1"
                  >
                    Select Duty
                  </label>
                  <Select
                    id="duty"
                    name="duty"
                    value={selectedDuty}
                    onChange={(e) => {
                      const dutyId = e.target.value;
                      setSelectedDuty(dutyId);

                      // Check if this is a group duty
                      const duty = duties.find((d) => d.id === parseInt(dutyId));
                      setIsGroupDuty(duty && duty.is_group_duty === 1);
                    }}
                    options={dutyOptions}
                    required
                    disabled={duties.length === 0}
                  />
                </div>

                {isGroupDuty ? (
                  <div className="mb-4">
                    <label
                      htmlFor="people"
                      className="block text-sm font-medium text-dark-800 dark:text-light-200 mb-1"
                    >
                      Assign To (hold Ctrl/Cmd to select multiple)
                    </label>
                    <select
                      id="people"
                      multiple
                      value={selectedPeople}
                      onChange={handleMultiplePersonSelection}
                      className="block w-full px-3 py-2 rounded-md border border-light-300 dark:border-dark-600 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 bg-white dark:bg-dark-800 min-h-[120px]"
                      required
                    >
                      {people.map((person) => (
                        <option key={person.id} value={person.id}>
                          {person.name}
                        </option>
                      ))}
                    </select>
                    <p className="mt-1 text-sm text-light-500 dark:text-light-400">
                      Selected: {selectedPeople.length}{' '}
                      {selectedPeople.length === 1 ? 'person' : 'people'}
                    </p>
                  </div>
                ) : (
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
                      onChange={handlePersonSelection}
                      options={peopleOptions}
                      required
                      disabled={people.length === 0}
                    />
                  </div>
                )}
              </form>
            ) : (
              <form onSubmit={handleCreateNewDuty} id="new-duty-form">
                <div className="mb-4">
                  <label
                    htmlFor="name"
                    className="block text-sm font-medium text-dark-800 dark:text-light-200 mb-1"
                  >
                    Duty Name
                  </label>
                  <TextInput
                    id="name"
                    name="name"
                    value={newDuty.name}
                    onChange={handleNewDutyChange}
                    required
                  />
                </div>

                <div className="mb-4">
                  <label
                    htmlFor="description"
                    className="block text-sm font-medium text-dark-800 dark:text-light-200 mb-1"
                  >
                    Description
                  </label>
                  <TextArea
                    id="description"
                    name="description"
                    value={newDuty.description}
                    onChange={handleNewDutyChange}
                    rows={3}
                  />
                </div>

                <FrequencySelector
                  frequency={newDuty.frequency}
                  days={newDuty.days_of_week}
                  onChange={handleFrequencyChange}
                />

                <div className="mb-4">
                  <Checkbox
                    id="is_group_duty"
                    name="is_group_duty"
                    checked={isGroupDuty}
                    onChange={handleGroupDutyChange}
                    label="This is a group duty (can be assigned to multiple people)"
                  />
                </div>

                {isGroupDuty ? (
                  <div className="mb-4">
                    <label
                      htmlFor="people"
                      className="block text-sm font-medium text-dark-800 dark:text-light-200 mb-1"
                    >
                      Assign To (hold Ctrl/Cmd to select multiple)
                    </label>
                    <select
                      id="people"
                      multiple
                      value={selectedPeople}
                      onChange={handleMultiplePersonSelection}
                      className="block w-full px-3 py-2 rounded-md border border-light-300 dark:border-dark-600 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 bg-white dark:bg-dark-800 min-h-[120px]"
                      required
                    >
                      {people.map((person) => (
                        <option key={person.id} value={person.id}>
                          {person.name}
                        </option>
                      ))}
                    </select>
                    <p className="mt-1 text-sm text-light-500 dark:text-light-400">
                      Selected: {selectedPeople.length}{' '}
                      {selectedPeople.length === 1 ? 'person' : 'people'}
                    </p>
                  </div>
                ) : (
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
                      onChange={handlePersonSelection}
                      options={peopleOptions}
                      required
                      disabled={people.length === 0}
                    />
                  </div>
                )}
              </form>
            )}
          </>
        )}
      </ModalBody>
      <ModalFooter>
        <Button variant="secondary" onClick={onClose}>
          Cancel
        </Button>
        <Button
          variant="primary"
          type="submit"
          form={mode === 'existing' ? 'existing-duty-form' : 'new-duty-form'}
          disabled={loading || people.length === 0 || (mode === 'existing' && duties.length === 0)}
        >
          {mode === 'existing' ? 'Assign Duty' : 'Create & Assign'}
        </Button>
      </ModalFooter>
    </BaseModal>
  );
};

AddDutyModal.propTypes = {
  date: PropTypes.string.isRequired,
  onClose: PropTypes.func.isRequired,
  onDutyAdded: PropTypes.func.isRequired,
  isOpen: PropTypes.bool,
};

export default AddDutyModal;
