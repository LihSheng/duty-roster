import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import PersonForm from './PersonForm';

const PeopleList = () => {
  const [people, setPeople] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [currentPerson, setCurrentPerson] = useState(null);

  useEffect(() => {
    fetchPeople();
  }, []);

  const fetchPeople = async () => {
    try {
      const res = await axios.get('/api/people');
      setPeople(res.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching people:', error);
      setLoading(false);
      toast.error('Failed to load people');
    }
  };

  const addPerson = async (personData) => {
    try {
      const res = await axios.post('/api/people', personData);
      setPeople([...people, { id: res.data.id, ...personData }]);
      setShowForm(false);
      toast.success('Person added successfully');
    } catch (error) {
      console.error('Error adding person:', error);
      toast.error('Failed to add person');
    }
  };

  const updatePerson = async (id, personData) => {
    try {
      await axios.put(`/api/people/${id}`, personData);
      setPeople(people.map((p) => (p.id === id ? { ...p, ...personData } : p)));
      setShowForm(false);
      setCurrentPerson(null);
      toast.success('Person updated successfully');
    } catch (error) {
      console.error('Error updating person:', error);
      toast.error('Failed to update person');
    }
  };

  const deletePerson = async (id) => {
    if (window.confirm('Are you sure you want to remove this person?')) {
      try {
        await axios.delete(`/api/people/${id}`);
        setPeople(people.filter((p) => p.id !== id));
        toast.success('Person removed successfully');
      } catch (error) {
        console.error('Error deleting person:', error);
        toast.error('Failed to remove person');
      }
    }
  };

  const openEditForm = (person) => {
    setCurrentPerson(person);
    setShowForm(true);
  };

  const closeForm = () => {
    setShowForm(false);
    setCurrentPerson(null);
  };

  if (loading) {
    return <div className="text-center mt-3">Loading...</div>;
  }

  return (
    <div>
      <div className="flex-between mb-4">
        <h1 className="mt-2">People</h1>
        <button className="btn btn-primary" onClick={() => setShowForm(true)}>
          Add Person
        </button>
      </div>

      {showForm && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h2>{currentPerson ? 'Edit Person' : 'Add Person'}</h2>
              <button className="btn" onClick={closeForm}>
                &times;
              </button>
            </div>
            <div className="modal-body">
              <PersonForm
                person={currentPerson}
                onSubmit={currentPerson ? updatePerson : addPerson}
                onCancel={closeForm}
              />
            </div>
          </div>
        </div>
      )}

      {people.length === 0 ? (
        <p>No people found. Add someone to get started.</p>
      ) : (
        <div className="card">
          <table className="table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {people.map((person) => (
                <tr key={person.id}>
                  <td>{person.name}</td>
                  <td>{person.email || '-'}</td>
                  <td>{person.phone || '-'}</td>
                  <td>
                    <button
                      className="btn btn-primary btn-sm mr-2"
                      onClick={() => openEditForm(person)}
                    >
                      Edit
                    </button>
                    <button
                      className="btn btn-danger btn-sm"
                      onClick={() => deletePerson(person.id)}
                    >
                      Remove
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default PeopleList;
