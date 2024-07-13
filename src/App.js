import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Modal from 'react-modal';
import './App.css';

Modal.setAppElement('#root');

const App = () => {
  const [contacts, setContacts] = useState([]);
  const [newContact, setNewContact] = useState({ name: '', email: '' });
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [currentContact, setCurrentContact] = useState({ id: null, name: '', email: '' });

  useEffect(() => {
    fetchContacts();
  }, []);

  const fetchContacts = async () => {
    try {
      const response = await axios.get('https://jsonplaceholder.typicode.com/users');
      setContacts(response.data);
    } catch (error) {
      console.error('Error fetching contacts:', error);
    }
  };

  const addContact = async () => {
    try {
      const response = await axios.post('https://jsonplaceholder.typicode.com/users', newContact);
      setContacts([...contacts, response.data]);
      setNewContact({ name: '', email: '' });
    } catch (error) {
      console.error('Error adding contact:', error);
    }
  };

  const openModal = (contact) => {
    setCurrentContact(contact);
    setModalIsOpen(true);
  };

  const closeModal = () => {
    setModalIsOpen(false);
    setCurrentContact({ id: null, name: '', email: '' });
  };

  const updateContact = async () => {
    try {
      const response = await axios.put(`https://jsonplaceholder.typicode.com/users/${currentContact.id}`, currentContact);
      setContacts(contacts.map(contact => contact.id === currentContact.id ? response.data : contact));
      closeModal();
    } catch (error) {
      console.error('Error updating contact:', error);
    }
  };

  const deleteContact = async (id) => {
    try {
      await axios.delete(`https://jsonplaceholder.typicode.com/users/${id}`);
      setContacts(contacts.filter(contact => contact.id !== id));
    } catch (error) {
      console.error('Error deleting contact:', error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewContact({ ...newContact, [name]: value });
  };

  const handleModalInputChange = (e) => {
    const { name, value } = e.target;
    setCurrentContact({ ...currentContact, [name]: value });
  };

  return (
    <div className="App">
      <h1>Contact Manager</h1>
      <div>
        <input
          type="text"
          name="name"
          placeholder="Name"
          value={newContact.name}
          onChange={handleInputChange}
        />
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={newContact.email}
          onChange={handleInputChange}
        />
        <button className="add" onClick={addContact}>Add Contact</button>
      </div>
      <ul>
        {contacts.map(contact => (
          <li key={contact.id}>
            <div className="info">
              <span className="name">{contact.name}</span>
              <span className="email">{contact.email}</span>
            </div>
            <div className="actions">
              <button className="update" onClick={() => openModal(contact)}>Update</button>
              <button className="delete" onClick={() => deleteContact(contact.id)}>Delete</button>
            </div>
          </li>
        ))}
      </ul>
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        contentLabel="Update Contact"
        className="modal"
        overlayClassName="overlay"
      >
        <h2>Update Contact</h2>
        <input
          type="text"
          name="name"
          placeholder="Name"
          value={currentContact.name}
          onChange={handleModalInputChange}
        />
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={currentContact.email}
          onChange={handleModalInputChange}
        />
        <button className="update" onClick={updateContact}>Save</button>
        <button className="delete" onClick={closeModal}>Cancel</button>
      </Modal>
    </div>
  );
};

export default App;
