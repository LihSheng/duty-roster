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
	const [newDuty, setNewDuty] = useState({
		name: '',
		description: '',
		frequency: 'custom',
		days_of_week: [],
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

		if (!selectedDuty || !selectedPerson) {
			toast.error('Please select both a duty and a person');
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

			if (existingAssignment) {
				toast.warning('This duty is already assigned for this date');
				return;
			}

			const res = await axios.post('/api/assignments', {
				duty_id: parseInt(selectedDuty),
				person_id: parseInt(selectedPerson),
				assigned_date: date,
				due_date: date,
			});

			// Get the full duty and person details for the UI update
			const duty = duties.find((d) => d.id === parseInt(selectedDuty));
			const person = people.find(
				(p) => p.id === parseInt(selectedPerson)
			);

			const newAssignment = {
				id: res.data.id,
				duty_id: parseInt(selectedDuty),
				person_id: parseInt(selectedPerson),
				duty_name: duty.name,
				person_name: person.name,
				description: duty.description,
				assigned_date: date,
				due_date: date,
				status: 'pending',
			};

			toast.success('Duty assigned successfully');
			onDutyAdded(newAssignment);
			onClose();
		} catch (error) {
			console.error('Error assigning duty:', error);
			toast.error('Failed to assign duty');
		}
	};

	const handleCreateNewDuty = async (e) => {
		e.preventDefault();

		if (!newDuty.name || !selectedPerson) {
			toast.error('Please enter a duty name and select a person');
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
				const existingAssignment = checkRes.data.find(
					(a) => a.duty_id === dutyId && a.assigned_date === date
				);

				if (existingAssignment) {
					toast.warning(
						'This duty is already assigned for this date'
					);
					return;
				}
			} else {
				// Create a new duty
				const dutyRes = await axios.post('/api/duties', {
					name: newDuty.name,
					description: newDuty.description,
					frequency: newDuty.frequency,
					days_of_week: newDuty.days_of_week || [],
				});
				dutyId = dutyRes.data.id;
			}

			// Create the assignment
			const assignmentRes = await axios.post('/api/assignments', {
				duty_id: dutyId,
				person_id: parseInt(selectedPerson),
				assigned_date: date,
				due_date: date,
			});

			const person = people.find(
				(p) => p.id === parseInt(selectedPerson)
			);

			const newAssignment = {
				id: assignmentRes.data.id,
				duty_id: dutyId,
				person_id: parseInt(selectedPerson),
				duty_name: newDuty.name,
				person_name: person.name,
				description: newDuty.description,
				assigned_date: date,
				due_date: date,
				status: 'pending',
			};

			toast.success('Duty assigned successfully');
			onDutyAdded(newAssignment);
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
									onChange={(e) =>
										setSelectedDuty(e.target.value)
									}
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
												{duty.name}
											</option>
										))
									)}
								</select>
							</div>

							<div className='form-group'>
								<label htmlFor='person'>Assign To</label>
								<select
									id='person'
									value={selectedPerson}
									onChange={(e) =>
										setSelectedPerson(e.target.value)
									}
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
								<label htmlFor='person'>Assign To</label>
								<select
									id='person'
									value={selectedPerson}
									onChange={(e) =>
										setSelectedPerson(e.target.value)
									}
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
