import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './PM-dashboard.css';  // Custom CSS for the dashboard
import pmpic from '../assets/png/pmpic.png';
import reportpic from '../assets/png/report.png';
import resolvedpic from '../assets/png/resolved.png';
import resolved2pic from '../assets/png/resolved2.png';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';  // Import Modal component
const apiUrl = process.env.REACT_APP_API_URL

function PMDashboard() {
    const [reports, setReports] = useState([]); // State to store reports, initialized as an empty array
    const [totalReports, setTotalReports] = useState(0); // State to store the total number of reports
    const [pmEmail, setPmEmail] = useState(""); // State to store the PM's email
    const [selectedReport, setSelectedReport] = useState(null); // State to store the currently selected report for the modal
    const [showModal, setShowModal] = useState(false); // State to control modal visibility
    const navigate = useNavigate(); // Use useNavigate for navigation

    const handleShow = () => setShowModal(true);
    const handleClose = () => setShowModal(false);

    // Function to fetch and view the report details in a modal
    const viewReport = async (id) => {
        try {
            const response = await fetch(`${apiUrl}/api/reports/${id}`, {
                method: 'GET',
                credentials: 'include',  // Include credentials (session cookies)
            });

            if (response.ok) {
                const data = await response.json();
                setSelectedReport(data);  // Set the selected report data
                handleShow();  // Show the modal
            } else {
                console.error('Error fetching incident report:', response.statusText);
            }
        } catch (error) {
            console.error('Error fetching incident report:', error);
        }
    };

    const resolveReport = async (id) => {
        try {
            const response = await fetch(`${apiUrl}/api/resolve/${id}`, {
                method: 'PUT',
                credentials: 'include',  // Include credentials (session cookies)
            });

            if (response.ok) {
                const data = await response.json();
                fetchReports(pmEmail);  // Refresh reports after resolving
            } else {
                console.error('Error resolving report:', response.statusText);
            }
        } catch (error) {
            console.error('Error resolving report:', error);
        }
    };

    const take_to_reports_page = async () => {
        navigate('/PM-reports')
    }

    // Function to fetch property manager email
    const fetchPMEmail = async () => {
        try {
            const response = await fetch(`${apiUrl}/current_pm`, {
                method: 'GET',
                credentials: 'include',  // Include credentials (session cookies)
            });

            if (response.ok) {
                const data = await response.json();
                setPmEmail(data.email); // Store PM email in state
            } else {
                console.error('Error fetching PM email:', response.statusText);
            }
        } catch (error) {
            console.error('Error fetching PM email:', error);
        }
    };

    // Function to fetch the total number of reports
    const fetchReportsCount = async (email) => {
        try {
            const response = await fetch(`${apiUrl}/api/reports_count/${email}`, {
                method: 'GET',
                credentials: 'include',  // Include credentials (session cookies)
            });

            if (response.ok) {
                const data = await response.json();
                setTotalReports(data.reports_count); // Set the total number of reports
            } else {
                console.error('Error fetching reports count:', response.statusText);
            }
        } catch (error) {
            console.error('Error fetching reports count:', error);
        }
    };

    // Function to fetch reports from the backend
    const fetchReports = async (email) => {
        try {
            const response = await fetch(`${apiUrl}/api/reports/${email}`, {
                method: 'GET',
                credentials: 'include',  // Include credentials (session cookies)
            });

            if (response.ok) {
                const data = await response.json();
                setReports(data.reports || []); // Ensure reports is an array
            } else {
                console.error('Error fetching reports:', response.statusText);
            }
        } catch (error) {
            console.error('Error fetching reports:', error);
            setReports([]); // Ensure it's an array in case of error
        }
    };

    // Fetch PM email on component mount
    useEffect(() => {
        fetchPMEmail(); // Fetch PM email on mount
    }, []);

    // Fetch reports count and reports when PM email is available
    useEffect(() => {
        if (pmEmail) {
            fetchReportsCount(pmEmail); // Fetch total report count once the PM email is available
            fetchReports(pmEmail); // Fetch actual reports
        }
    }, [pmEmail]);

    // Function to log out the user
    const handleLogout = async () => {
        try {
            const response = await fetch(`${apiUrl}/logout`, {
                method: 'POST',
                credentials: 'include',  // Important: this includes session cookies
                headers: {
                    'Content-Type': 'application/json',  // Specify the content type
                },
            });

            if (response.ok) {
                // If the logout is successful, redirect the user to the login page
                window.location.href = `${apiUrl}/pm-portal`;
            } else {
                console.error('Logout failed:', response.statusText);
            }
        } catch (error) {
            console.error('An error occurred during logout:', error);
        }
    };

    // Sort and slice the reports to get the 4 most recent (oldest first)
    const firstFourReports = reports
        // .sort((a, b) => new Date(a.date) - new Date(b.date))  // Sort by date, oldest first
        .slice(0, 4);  // Get only the first 4 reports

    return (
        <div className="pm-dashboard-container">
            <nav className="pm-nav">
                <a href="#" className="active">Dashboard</a>
                <a href="#" onClick={take_to_reports_page}>Reports</a>
                <button onClick={handleLogout} className="btn btn-outline-danger">
                    Logout
                </button>
            </nav>
            <div className="pm-content">
                <div className="pm-header">
                    <div className="header-left">
                        <h1>Welcome, Property Manager</h1>
                        <p>Manage your properties and incidents efficiently</p>
                    </div>
                    <img src={pmpic} alt="Property Manager" className="header-image" />
                </div>
                <div className="pm-cards">
                    <div className="pm-card">
                        <img src={reportpic} alt="Total Reports" className="card-image" />
                        <h2>Total Reports</h2>
                        <p>{totalReports}</p> {/* Always up-to-date total reports */}
                    </div>
                    <div className="pm-card">
                        <img src={resolvedpic} alt="Open Reports" className="card-image" />
                        <h2>Open Reports</h2>
                        <p>{reports.filter(report => report.resolved === 'No').length}</p>
                    </div>
                    <div className="pm-card">
                        <img src={resolved2pic} alt="Resolved Reports" className="card-image" />
                        <h2>Resolved Reports</h2>
                        <p>{reports.filter(report => report.resolved === 'Yes').length}</p>
                    </div>
                </div>
                <div className="pm-reports-list">
                    <h2>Most Recent Reports</h2>
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
                            {firstFourReports.map((report) => (
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
                                            <Button variant="outline-success" onClick={() => resolveReport(report.id)} className="ml-2">
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
                            <p><strong>Contact Info:</strong> {selectedReport.contact_info}</p>
                            <p><strong>People Involved:</strong></p>
                            <ul>
                                {selectedReport.people_involved.map((person) => (
                                    <li key={person.id}>
                                        <strong>{person.person_type}:</strong> {person.name} ({person.additional_info})
                                    </li>
                                ))}
                            </ul>
                            <p><strong>More Info:</strong> {selectedReport.comments}</p>
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
    </div>
);
}

export default PMDashboard;