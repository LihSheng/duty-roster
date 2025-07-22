import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import FrequencySelector from './FrequencySelector';

const AddDutyModal = ({ date, onClose, onDutyAdded }) => {
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
					setSelectedDuty(dutiesRes.data[0].id);
				}

				if (peopleRes.data.length > 0) {
					setSelectedPerson(peopleRes.data[0].id);
				}

				setLoading(false);
			} catch (error) {
				console.error('Error fetching data:', error);
				toast.error('Failed to load duties and people');
				setLoading(false);
			}
		};

		fetchData();
	}, []);

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
			const checkRes = await axios.get(
				`/api/assignments?start_date=${date}&end_date=${date}`
			);
			const existingAssignment = checkRes.data.find(
				(a) =>
					a.duty_id === parseInt(selectedDuty) &&
					a.assigned_date === date
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

				newAssignments = [{
					id: res.data.id,
					duty_id: parseInt(selectedDuty),
					person_id: parseInt(selectedPerson),
					duty_name: duty.name,
					person_name: person.name,
					description: duty.description,
					assigned_date: date,
					due_date: date,
					status: 'pending',
				}];
			}

			toast.success(`Duty assigned successfully to ${newAssignments.length} ${newAssignments.length === 1 ? 'person' : 'people'}`);
			
			// Notify parent component about all new assignments
			newAssignments.forEach(assignment => {
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
			const existingDuty = duties.find(
				(d) => d.name.toLowerCase() === newDuty.name.toLowerCase()
			);

			let dutyId;

			if (existingDuty) {
				// Use the existing duty
				dutyId = existingDuty.id;
				toast.info('Using existing duty with the same name');

				// Check if this duty is already assigned for this date
				const checkRes = await axios.get(
					`/api/assignments?start_date=${date}&end_date=${date}`
				);
				
				if (!isGroupDuty) {
					const existingAssignment = checkRes.data.find(
						(a) => a.duty_id === dutyId && a.assigned_date === date
					);

					if (existingAssignment) {
						toast.warning(
							'This duty is already assigned for this date'
						);
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
					is_group_duty: isGroupDuty
				});
				dutyId = dutyRes.data.id;
			}

			let newAssignments = [];
			
			if (isGroupDuty) {
				// For group duties, create an assignment for each selected person
				const checkRes = await axios.get(
					`/api/assignments?start_date=${date}&end_date=${date}`
				);
				
				for (const personId of selectedPeople) {
					// Skip if this person already has this duty assigned for this date
					const alreadyAssigned = checkRes.data.find(
						(a) => 
							a.duty_id === dutyId && 
							a.person_id === parseInt(personId) &&
							a.assigned_date === date
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

				const person = people.find(
					(p) => p.id === parseInt(selectedPerson)
				);

				newAssignments = [{
					id: assignmentRes.data.id,
					duty_id: dutyId,
					person_id: parseInt(selectedPerson),
					duty_name: newDuty.name,
					person_name: person.name,
					description: newDuty.description,
					assigned_date: date,
					due_date: date,
					status: 'pending',
				}];
			}

			toast.success(`Duty assigned successfully to ${newAssignments.length} ${newAssignments.length === 1 ? 'person' : 'people'}`);
			
			// Notify parent component about all new assignments
			newAssignments.forEach(assignment => {
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
			is_group_duty: isGroup
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

	if (loading) {
		return (
			<div className='modal-overlay'>
				<div className='modal'>
					<div className='modal-header'>
						<h2>Add Duty for {date}</h2>
						<button className='btn' onClick={onClose}>
							&times;
						</button>
					</div>
					<div className='modal-body text-center'>Loading...</div>
				</div>
			</div>
		);
	}

	return (
		<div className='modal-overlay'>
			<div className='modal'>
				<div className='modal-header'>
					<h2>Add Duty for {date}</h2>
					<button className='btn' onClick={onClose}>
						&times;
					</button>
				</div>
				<div className='modal-body'>
					<div className='mb-3'>
						<div className='flex-between'>
							<button
								className={`btn ${
									mode === 'existing' ? 'btn-primary' : ''
								}`}
								onClick={() => setMode('existing')}
							>
								Use Existing Duty
							</button>
							<button
								className={`btn ${
									mode === 'new' ? 'btn-primary' : ''
								}`}
								onClick={() => setMode('new')}
							>
								Create New Duty
							</button>
						</div>
					</div>

					{mode === 'existing' ? (
						<form onSubmit={handleAddExistingDuty}>
							<div className='form-group'>
								<label htmlFor='duty'>Select Duty</label>
								<select
									id='duty'
									value={selectedDuty}
									onChange={(e) => {
										const dutyId = e.target.value;
										setSelectedDuty(dutyId);
										
										// Check if this is a group duty
										const duty = duties.find(d => d.id === parseInt(dutyId));
										setIsGroupDuty(duty && duty.is_group_duty === 1);
									}}
									required
								>
									{duties.length === 0 ? (
										<option value=''>
											No duties available
										</option>
									) : (
										duties.map((duty) => (
											<option
												key={duty.id}
												value={duty.id}
											>
												{duty.name} {duty.is_group_duty === 1 ? '(Group)' : ''}
											</option>
										))
									)}
								</select>
							</div>

							{isGroupDuty ? (
								<div className='form-group'>
									<label htmlFor='people'>Assign To (hold Ctrl/Cmd to select multiple)</label>
									<select
										id='people'
										multiple
										value={selectedPeople}
										onChange={handleMultiplePersonSelection}
										className='multi-select'
										size={Math.min(5, people.length)}
										required
									>
										{people.length === 0 ? (
											<option value=''>
												No people available
											</option>
										) : (
											people.map((person) => (
												<option
													key={person.id}
													value={person.id}
												>
													{person.name}
												</option>
											))
										)}
									</select>
									<small className='form-text'>
										Selected: {selectedPeople.length} {selectedPeople.length === 1 ? 'person' : 'people'}
									</small>
								</div>
							) : (
								<div className='form-group'>
									<label htmlFor='person'>Assign To</label>
									<select
										id='person'
										value={selectedPerson}
										onChange={handlePersonSelection}
										required
									>
										{people.length === 0 ? (
											<option value=''>
												No people available
											</option>
										) : (
											people.map((person) => (
												<option
													key={person.id}
													value={person.id}
												>
													{person.name}
												</option>
											))
										)}
									</select>
								</div>
							)}

							<div className='modal-footer'>
								<button
									type='button'
									className='btn'
									onClick={onClose}
								>
									Cancel
								</button>
								<button
									type='submit'
									className='btn btn-primary'
									disabled={
										duties.length === 0 ||
										people.length === 0
									}
								>
									Assign Duty
								</button>
							</div>
						</form>
					) : (
						<form onSubmit={handleCreateNewDuty}>
							<div className='form-group'>
								<label htmlFor='name'>Duty Name</label>
								<input
									type='text'
									id='name'
									name='name'
									value={newDuty.name}
									onChange={handleNewDutyChange}
									required
								/>
							</div>

							<div className='form-group'>
								<label htmlFor='description'>Description</label>
								<textarea
									id='description'
									name='description'
									value={newDuty.description}
									onChange={handleNewDutyChange}
									rows='3'
								></textarea>
							</div>

							<FrequencySelector
								frequency={newDuty.frequency}
								days={newDuty.days_of_week}
								onChange={handleFrequencyChange}
							/>
							
							<div className='form-group'>
								<label>
									<input
										type='checkbox'
										checked={isGroupDuty}
										onChange={handleGroupDutyChange}
									/>
									{' '}This is a group duty (can be assigned to multiple people)
								</label>
							</div>

							{isGroupDuty ? (
								<div className='form-group'>
									<label htmlFor='people'>Assign To (hold Ctrl/Cmd to select multiple)</label>
									<select
										id='people'
										multiple
										value={selectedPeople}
										onChange={handleMultiplePersonSelection}
										className='multi-select'
										size={Math.min(5, people.length)}
										required
									>
										{people.length === 0 ? (
											<option value=''>
												No people available
											</option>
										) : (
											people.map((person) => (
												<option
													key={person.id}
													value={person.id}
												>
													{person.name}
												</option>
											))
										)}
									</select>
									<small className='form-text'>
										Selected: {selectedPeople.length} {selectedPeople.length === 1 ? 'person' : 'people'}
									</small>
								</div>
							) : (
								<div className='form-group'>
									<label htmlFor='person'>Assign To</label>
									<select
										id='person'
										value={selectedPerson}
										onChange={handlePersonSelection}
										required
									>
										{people.length === 0 ? (
											<option value=''>
												No people available
											</option>
										) : (
											people.map((person) => (
												<option
													key={person.id}
													value={person.id}
												>
													{person.name}
												</option>
											))
										)}
									</select>
								</div>
							)}

							<div className='modal-footer'>
								<button
									type='button'
									className='btn'
									onClick={onClose}
								>
									Cancel
								</button>
								<button
									type='submit'
									className='btn btn-primary'
									disabled={people.length === 0}
								>
									Create & Assign
								</button>
							</div>
						</form>
					)}
				</div>
			</div>
		</div>
	);
};

export default AddDutyModal;
