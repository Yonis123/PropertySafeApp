import React, { useState, useEffect } from 'react';
import './PM-reports.css';
import { useNavigate, Link } from 'react-router-dom';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form'; // Import Bootstrap Form
import Row from 'react-bootstrap/Row'; // Import Bootstrap Grid components
import Col from 'react-bootstrap/Col'; // Import Bootstrap Grid components

function PMReports() {
    const [reports, setReports] = useState([]); 
    const [filteredReports, setFilteredReports] = useState([]);
    const [selectedReport, setSelectedReport] = useState(null); 
    const [showModal, setShowModal] = useState(false);
    const [pmEmail, setPmEmail] = useState("");
    const [unitNumber, setUnitNumber] = useState("");
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [unresolved, setUnresolved] = useState(false);
    const navigate = useNavigate();

    const handleShow = () => setShowModal(true);
    const handleClose = () => setShowModal(false);

    const fetchPMEmailAndReports = async () => {
        try {
            const response = await fetch('http://localhost:5000/current_pm', {
                method: 'GET',
                credentials: 'include',
            });

            if (response.ok) {
                const data = await response.json();
                setPmEmail(data.email);
                fetchReports(data.email);
            } else {
                console.error('Error fetching PM email:', response.statusText);
            }
        } catch (error) {
            console.error('Error fetching PM email:', error);
        }
    };

    const fetchReports = async (email) => {
        try {
            const response = await fetch(`http://localhost:5000/api/reports/${email}`, {
                method: 'GET',
                credentials: 'include',
            });

            if (response.ok) {
                const data = await response.json();
                setReports(data.reports || []);
                setFilteredReports(data.reports || []);
            } else {
                console.error('Error fetching reports:', response.statusText);
            }
        } catch (error) {
            console.error('Error fetching reports:', error);
        }
    };

    useEffect(() => {
        fetchPMEmailAndReports();
    }, []);

    const viewReport = async (id) => {
        try {
            const response = await fetch(`http://localhost:5000/api/reports/${id}`, {
                method: 'GET',
                credentials: 'include',
            });

            if (response.ok) {
                const data = await response.json();
                setSelectedReport(data);
                handleShow();
            } else {
                console.error('Error fetching report details:', response.statusText);
            }
        } catch (error) {
            console.error('Error fetching report details:', error);
        }
    };

    const resolveReport = async (id) => {
        try {
            const response = await fetch(`http://localhost:5000/api/resolve/${id}`, {
                method: 'PUT',
                credentials: 'include',
            });

            if (response.ok) {
                fetchReports(pmEmail);
            } else {
                console.error('Error resolving report:', response.statusText);
            }
        } catch (error) {
            console.error('Error resolving report:', error);
        }
    };

    const handleLogout = async () => {
        try {
            const response = await fetch('http://localhost:5000/logout', {
                method: 'POST',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (response.ok) {
                window.location.href = 'http://localhost:3000/pm-portal';
            } else {
                console.error('Logout failed:', response.statusText);
            }
        } catch (error) {
            console.error('An error occurred during logout:', error);
        }
    };

    const handleSearch = (e) => {
        e.preventDefault();
        let filtered = reports;

        if (unitNumber) {
            filtered = filtered.filter(report => report.people_involved.some(person => person.unit_number === unitNumber));
        }

        if (startDate) {
            filtered = filtered.filter(report => new Date(report.date) >= new Date(startDate));
        }

        if (endDate) {
            filtered = filtered.filter(report => new Date(report.date) <= new Date(endDate));
        }

        if (unresolved) {
            filtered = filtered.filter(report => report.resolved === 'No');
        }

        setFilteredReports(filtered);
    };

    return (
        <div className="pm-dashboard-container">
            {/* Navbar */}
            <nav className="pm-nav">
                <Link to="/PM-dashboard" className="nav-link">Dashboard</Link>
                <Link to="/PM-reports" className="nav-link active">Reports</Link>
                <button onClick={handleLogout} className="btn btn-outline-danger">
                    Logout
                </button>
            </nav>

            {/* Search Form */}
            <div className="pm-content">
                <h1>Search Reports</h1>
                <Form onSubmit={handleSearch} className="mb-4">
                    <Row className="mb-3">
                        <Col md={4}>
                            <Form.Group controlId="unitNumber">
                                <Form.Label>Unit Number</Form.Label>
                                <Form.Control 
                                    type="text" 
                                    value={unitNumber} 
                                    onChange={(e) => setUnitNumber(e.target.value)} 
                                    placeholder="Enter unit number" 
                                />
                            </Form.Group>
                        </Col>
                        <Col md={4}>
                            <Form.Group controlId="startDate">
                                <Form.Label>Start Date</Form.Label>
                                <Form.Control 
                                    type="date" 
                                    value={startDate} 
                                    onChange={(e) => setStartDate(e.target.value)} 
                                />
                            </Form.Group>
                        </Col>
                        <Col md={4}>
                            <Form.Group controlId="endDate">
                                <Form.Label>End Date</Form.Label>
                                <Form.Control 
                                    type="date" 
                                    value={endDate} 
                                    onChange={(e) => setEndDate(e.target.value)} 
                                />
                            </Form.Group>
                        </Col>
                    </Row>
                    <Row className="mb-3">
                        <Col>
                            <Form.Group controlId="unresolved">
                                <Form.Check 
                                    type="checkbox" 
                                    label="Show Unresolved Reports Only" 
                                    checked={unresolved} 
                                    onChange={(e) => setUnresolved(e.target.checked)} 
                                />
                            </Form.Group>
                        </Col>
                    </Row>
                    <Button type="submit" variant="primary">Search</Button>
                </Form>

                {/* Reports Table */}
                <h1>Reports</h1>
                <table className="reports-table">
                    <thead>
                        <tr>
                            <th>Date</th>
                            <th>Incident</th>
                            <th>Status</th>
                            <th>People Involved</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredReports.map((report) => (
                            <tr key={report.id}>
                                <td>{report.date}</td>
                                <td>{report.event_description}</td>
                                <td className={report.resolved === 'Yes' ? 'resolved' : 'open'}>
                                    {report.resolved === 'Yes' ? 'Resolved' : 'Open'}
                                </td>
                                <td>
                                    {report.people_involved.map((person) => (
                                        <div key={person.id}>
                                            <strong>{person.person_type}:</strong> {person.name} ({person.additional_info})
                                        </div>
                                    ))}
                                </td>
                                <td>
                                    <Button variant="outline-primary" onClick={() => viewReport(report.id)}>View</Button>
                                    {report.resolved === 'No' && (
                                        <Button variant="outline-success" className="ml-2" onClick={() => resolveReport(report.id)}>
                                            Resolve
                                        </Button>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Modal for viewing report details */}
            <Modal show={showModal} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Report Details</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {selectedReport ? (
                        <div>
                            <p><strong>Officer ID:</strong> {selectedReport.officer_id}</p>
                            <p><strong>Date:</strong> {selectedReport.date}</p>
                            <p><strong>Incident:</strong> {selectedReport.event_description}</p>
                            <p><strong>Address:</strong> {selectedReport.address}</p>
                            <p><strong>Urgency:</strong> {selectedReport.urgency}</p>
                            <p><strong>Status:</strong> {selectedReport.resolved === 'Yes' ? 'Resolved' : 'Open'}</p>
                            {selectedReport.resolved === 'Yes' && (
                                <p><strong>Time Resolved:</strong> {selectedReport.time_resolved}</p>
                            )}
                            <p><strong>Contact Info:</strong>
                            {selectedReport.contact_info}</p>
                            <p><strong>People Involved:</strong></p>
                            <ul>
                                {selectedReport.people_involved.map((person) => (
                                    <li key={person.id}>
                                        <strong>{person.person_type}:</strong> {person.name} ({person.additional_info})
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ) : (
                        <p>Loading report details...</p>
                    )}
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                        Close
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
}

export default PMReports;