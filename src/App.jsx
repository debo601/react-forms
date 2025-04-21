import React, { useEffect, useState } from "react";
import Table from "react-bootstrap/Table";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import "bootstrap/dist/css/bootstrap.min.css";

const App = () => {
  const [data, setData] = useState([]);
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);

  const [newUser, setNewUser] = useState({
    name: "",
    age: "",
    email: "",
    location: "",
    gender: "",
    phone: "",
    occupation: "",
    is_active: true,
    registered_at: new Date().toLocaleDateString(),
  });

  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    fetch("/data.json")
      .then((res) => res.json())
      .then((resData) => setData(resData))
      .catch((err) => console.log("Error:", err));
  }, []);

  const handleChange = (e) => {
    setNewUser({ ...newUser, [e.target.name]: e.target.value });
  };

  const handleAddUser = () => {
    if (!newUser.name || !newUser.email) {
      alert("Name and Email are required");
      return;
    }

    const userToAdd = {
      ...newUser,
      id: Date.now(),
    };

    setData([userToAdd, ...data]);
    resetForm();
  };

  const handleDelete = (id) => {
    setData(data.filter((user) => user.id !== id));
  };

  const handleEdit = (user) => {
    setNewUser(user);
    setEditingId(user.id);
    setShowModal(true);
  };

  const handleUpdateUser = () => {
    setData(data.map((user) => (user.id === editingId ? newUser : user)));
    setEditingId(null);
    setShowModal(false);
    resetForm();
  };

  const resetForm = () => {
    setNewUser({
      name: "",
      age: "",
      email: "",
      location: "",
      gender: "",
      phone: "",
      occupation: "",
      is_active: true,
      registered_at: new Date().toLocaleDateString(),
    });
  };

  const filteredData = data.filter((user) =>
    `${user.name} ${user.email} ${user.location} ${user.occupation}`
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  return (
    <div className="container mt-4">
      <h2 className="mb-4 text-center">User Data Table (CRUD with Modal)</h2>

      <Form.Group className="mb-4">
        <Form.Control
          type="text"
          placeholder="Search by name, email, location..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </Form.Group>

      <Form className="mb-4">
        <h5 className="mb-3">Add New User</h5>
        <div className="row g-2">
          <div className="col-md-3">
            <Form.Control
              type="text"
              name="name"
              placeholder="Name"
              value={newUser.name}
              onChange={handleChange}
            />
          </div>
          <div className="col-md-2">
            <Form.Control
              type="number"
              name="age"
              placeholder="Age"
              value={newUser.age}
              onChange={handleChange}
            />
          </div>
          <div className="col-md-3">
            <Form.Control
              type="email"
              name="email"
              placeholder="Email"
              value={newUser.email}
              onChange={handleChange}
            />
          </div>
          <div className="col-md-2">
            <Form.Control
              type="text"
              name="phone"
              placeholder="Phone"
              value={newUser.phone}
              onChange={handleChange}
            />
          </div>
          <div className="col-md-2 d-grid">
            <Button variant="success" onClick={handleAddUser}>
              Add
            </Button>
          </div>
          <div className="col-md-3">
            <Form.Control
              type="text"
              name="location"
              placeholder="Location"
              value={newUser.location}
              onChange={handleChange}
            />
          </div>
          <div className="col-md-3">
            <Form.Control
              type="text"
              name="gender"
              placeholder="Gender"
              value={newUser.gender}
              onChange={handleChange}
            />
          </div>
          <div className="col-md-3">
            <Form.Control
              type="text"
              name="occupation"
              placeholder="Occupation"
              value={newUser.occupation}
              onChange={handleChange}
            />
          </div>
        </div>
      </Form>

      <Table striped bordered hover responsive>
        <thead className="table-dark">
          <tr>
            <th>#</th>
            <th>Name</th>
            <th>Age</th>
            <th>Email</th>
            <th>Location</th>
            <th>Gender</th>
            <th>Phone</th>
            <th>Occupation</th>
            <th>Status</th>
            <th>Registered At</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredData.length > 0 ? (
            filteredData.map((user, index) => (
              <tr key={user.id}>
                <td>{index + 1}</td>
                <td>{user.name}</td>
                <td>{user.age}</td>
                <td>
                  <a href={`mailto:${user.email}`}>{user.email}</a>
                </td>
                <td>{user.location}</td>
                <td>{user.gender}</td>
                <td>{user.phone}</td>
                <td>{user.occupation}</td>
                <td>{user.is_active ? "Active" : "Inactive"}</td>
                <td>{user.registered_at}</td>
                <td>
                  <div className="d-flex gap-2">
                    <Button
                      variant="outline-primary"
                      size="sm"
                      onClick={() => handleEdit(user)}
                    >
                      ✏️ Edit
                    </Button>
                    <Button
                      variant="outline-danger"
                      size="sm"
                      onClick={() => handleDelete(user.id)}
                    >
                      Delete
                    </Button>
                  </div>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="11" className="text-center">
                No matching users found.
              </td>
            </tr>
          )}
        </tbody>
      </Table>

      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Edit User</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-2">
              <Form.Label>Name</Form.Label>
              <Form.Control
                type="text"
                name="name"
                value={newUser.name}
                onChange={handleChange}
              />
            </Form.Group>
            <Form.Group className="mb-2">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                name="email"
                value={newUser.email}
                onChange={handleChange}
              />
            </Form.Group>
            <Form.Group className="mb-2">
              <Form.Label>Phone</Form.Label>
              <Form.Control
                type="text"
                name="phone"
                value={newUser.phone}
                onChange={handleChange}
              />
            </Form.Group>
            <Form.Group className="mb-2">
              <Form.Label>Location</Form.Label>
              <Form.Control
                type="text"
                name="location"
                value={newUser.location}
                onChange={handleChange}
              />
            </Form.Group>
            <Form.Group className="mb-2">
              <Form.Label>Occupation</Form.Label>
              <Form.Control
                type="text"
                name="occupation"
                value={newUser.occupation}
                onChange={handleChange}
              />
            </Form.Group>
            <Form.Group className="mb-2">
              <Form.Label>Gender</Form.Label>
              <Form.Control
                type="text"
                name="gender"
                value={newUser.gender}
                onChange={handleChange}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleUpdateUser}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default App;
