import { Component } from 'react';
import { nanoid } from 'nanoid';
import Form from './Form';
import Filter from './Filter';
import ContactsList from './ContactsList';
import { AppBox } from './App.styled';
import { loadStorage, saveStorage } from 'Services/storage';

const LOCLAL_STORAGE_KEY = 'contacts';
export class App extends Component {
  state = {
    contacts: [],
    filter: '',
  };

  componentDidMount = () => {
    const contacts = loadStorage(LOCLAL_STORAGE_KEY);

    if (contacts !== null) {
      this.setState({ contacts });
      return;
    }
    this.setState({ contacts: [] });
  };

  componentDidUpdate(prevProps, prevState) {
    const nextContacts = this.state.contacts;
    const prevContacts = prevState.contacts;

    if (nextContacts !== prevContacts) {
      saveStorage(LOCLAL_STORAGE_KEY, nextContacts);
    }
  }
  notifiesAlert = nameContact => {
    alert(`${nameContact} is already in contacts.`);
  };

  checkСontact = nameContact => {
    return this.state.contacts.some(
      ({ name: curentName }) => curentName === nameContact
    );
  };

  addContact = (name, number) => {
    this.setState(({ contacts }) => ({
      contacts: [...contacts, { id: nanoid(4), name, number }],
    }));
  };

  onDeleteContact = contactId => {
    this.setState(prevState => ({
      contacts: prevState.contacts.filter(({ id }) => id !== contactId),
    }));
  };

  handleChange = e => {
    const { name, value } = e.currentTarget;
    this.setState({
      [name]: value,
    });
  };

  handleSubmit = ({ name: newName, number }) => {
    this.checkСontact(newName)
      ? this.notifiesAlert(newName)
      : this.addContact(newName, number);
  };

  render() {
    const { contacts, filter } = this.state;

    return (
      <AppBox>
        <h1>Phonebook</h1>
        <Form onSubmit={this.handleSubmit} />

        <h2>Contacts</h2>
        <Filter onChange={this.handleChange} value={filter} />
        <ContactsList
          contacts={contacts}
          filter={filter}
          onDeleteContact={this.onDeleteContact}
        />
      </AppBox>
    );
  }
}
