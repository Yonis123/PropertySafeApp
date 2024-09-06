import React, { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Table from 'react-bootstrap/Table';
import Modal from 'react-bootstrap/Modal';  // Import Bootstrap Modal
import Spinner from 'react-bootstrap/Spinner';  // Import Spinner for loading
import './OfficerReport.css';
import { useNavigate } from 'react-router-dom';

function OfficerReportsPage() {
  const [officerId, setOfficerId] = useState('');
  const [reports, setReports] = useState([]); // State to store the fetched reports
  const [loading, setLoading] = useState(false); // To indicate loading state
  const [showModal, setShowModal] = useState(false); // State to control modal visibility
  const [selectedReport, setSelectedReport] = useState(null); // State to store selected report for modal
  const [additionalInfo, setAdditionalInfo] = useState(''); // State to store additional information
  const [updateLoading, setUpdateLoading] = useState(false); // To indicate loading while updating
  const [updateSuccess, setUpdateSuccess] = useState(false); // To show success after updating
  const navigate = useNavigate();

  // Function to fetch the reports based on the Officer ID
  const fetchReports = async () => {
    setLoading(true); // Set loading state
    try {
      const response = await fetch(`http://localhost:5000/api/officer_reports?officer_id=${officerId}`, {
        method: 'GET',
        credentials: 'include',
      });
  
      if (response.ok) {
        const data = await response.json();
        console.log(data);
        setReports(data.reports || []); // Store fetched reports
      } else {
        console.error('Failed to fetch reports');
        setReports([]); // Set reports to empty if fetch fails
      }
    } catch (error) {
      console.error('Error fetching reports:', error);
      setReports([]); // Set reports to empty in case of an error
    } finally {
      setLoading(false); // Reset loading state
    }
  };

  // Handle form submission to fetch reports
  const handleSubmit = (e) => {
    e.preventDefault();
    if (officerId) {
      fetchReports();
    }
  };

  // Handle opening the modal with report details
  const handleViewReport = (report) => {
    setSelectedReport(report); // Set selected report
    setShowModal(true); // Show the modal
  };

  // Handle closing the modal
  const handleCloseModal = () => {
    setShowModal(false); // Hide the modal
    setSelectedReport(null); // Reset selected report
    setAdditionalInfo(''); // Clear additional information
    setUpdateLoading(false);
    setUpdateSuccess(false);
  };

  // Handle additional information submission
  const handleAdditionalInfoSubmit = async () => {
    if (!additionalInfo) return;

    setUpdateLoading(true); // Show loading spinner during update
    try {
      const response = await fetch(`http://localhost:5000/api/reports/${selectedReport.id}/update`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ additional_info: additionalInfo }), // Send additional info
      });

      if (response.ok) {
        console.log('Additional information submitted');
        setUpdateLoading(false);
        setUpdateSuccess(true); // Show success message

        // Redirect after 2 seconds
        setTimeout(() => {
          handleCloseModal(); // Close the modal after submission
          navigate('/');
        }, 2000);
      } else {
        console.error('Failed to submit additional information');
        setUpdateLoading(false);
      }
    } catch (error) {
      console.error('Error submitting additional information:', error);
      setUpdateLoading(false);
    }
  };

  return (
    <div className="officer-reports-container">
      <h1>View Your Previous Reports</h1>

      {/* Form to input Officer ID */}
      <Form onSubmit={handleSubmit}>
        <Form.Group controlId="officerId">
          <Form.Label>Enter Your Officer ID</Form.Label>
          <Form.Control
            type="text"
            placeholder="Officer ID"
            value={officerId}
            onChange={(e) => setOfficerId(e.target.value)}
            required
          />
        </Form.Group>

        <Button variant="primary" type="submit" disabled={loading}>
          {loading ? 'Loading...' : 'Fetch Reports'}
        </Button>
      </Form>

      {/* Table to display fetched reports */}
      {reports.length > 0 && (
        <Table striped bordered hover className="mt-4">
          <thead>
            <tr>
              <th>Date</th>
              <th>Incident</th>
              <th>Urgency</th>
              <th>Resolved</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {reports.map((report) => (
              <tr key={report.id}>
                <td>{report.date}</td>
                <td>{report.event_description}</td>
                <td>{report.urgency}</td>
                <td>{report.resolved === 'Yes' ? 'Resolved' : 'Open'}</td>
                <td>
                  <Button
                    variant="outline-primary"
                    onClick={() => handleViewReport(report)}  // Show the modal when clicked
                  >
                    View / Update
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}

      {reports.length === 0 && !loading && officerId && (
        <p>No reports found for Officer ID: {officerId}</p>
      )}

      {/* Modal for viewing report details */}
      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>Report Details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedReport ? (
            <div>
              <p><strong>Date:</strong> {selectedReport.date}</p>
              <p><strong>Incident:</strong> {selectedReport.event_description}</p>
              <p><strong>Urgency:</strong> {selectedReport.urgency}</p>
              <p><strong>Resolved:</strong> {selectedReport.resolved === 'Yes' ? 'Resolved' : 'Open'}</p>
              <p><strong>Comments:</strong> {selectedReport.comments}</p>

              {/* Form for providing additional information */}
              <Form.Group controlId="additionalInfo" className="mt-4">
                <Form.Label>Provide Additional Information</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={3}
                  value={additionalInfo}
                  onChange={(e) => setAdditionalInfo(e.target.value)}
                  placeholder="Enter additional details..."
                />
              </Form.Group>

              {updateLoading ? (
                <div className="loading-container">
                  <Spinner animation="border" role="status">
                    <span className="sr-only">Loading...</span>
                  </Spinner>
                  <p>Updating report...</p>
                </div>
              ) : updateSuccess ? (
                <div className="success-message">
                  <p>Report updated successfully! Redirecting...</p>
                </div>
              ) : null}
            </div>
          ) : (
            <p>Loading report details...</p>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>
            Close
          </Button>
          <Button variant="success" onClick={handleAdditionalInfoSubmit} disabled={!additionalInfo || updateLoading}>
            {updateLoading ? 'Submitting...' : 'Submit Additional Information'}
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default OfficerReportsPage;