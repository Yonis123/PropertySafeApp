import React, { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { useNavigate } from 'react-router-dom';
import Spinner from 'react-bootstrap/Spinner'; // Import Spinner for loading indicator
import './OfficerPortalPage.css';
// const apiUrl = process.env.REACT_APP_API_URL
const apiUrl = "https://propertysafeapp.onrender.com"

function OfficerPortalPage() {
  const [officerId, setOfficerId] = useState('');
  const [date, setDate] = useState('');
  const [address, setAddress] = useState('');
  const [urgency, setUrgency] = useState('');
  const [startTime, setStartTime] = useState('');
  const [resolved, setResolved] = useState('');
  const [timeResolved, setTimeResolved] = useState('');
  const [eventDescription, setEventDescription] = useState('');
  const [comments, setComments] = useState('');
  const [fullName, setFullName] = useState('');
  const [contactInfo, setContactInfo] = useState('');
  const [pmsEmail, setPmsEmail] = useState('');
  const [peopleInvolved, setPeopleInvolved] = useState([{ name: '', person_type: '', unit_number: '', additional_info: '', contact_info: '' }]);
  const [loading, setLoading] = useState(false); // Add loading state
  const [submitted, setSubmitted] = useState(false); // Add submission state
  const navigate = useNavigate();

  // Add a new person involved in the incident
  const handleAddPerson = () => {
      setPeopleInvolved([...peopleInvolved, { name: '', person_type: '', unit_number: '', additional_info: '', contact_info: '' }]);
  };

  // Remove a person from the people involved list
  const handleRemovePerson = (index) => {
      const updatedPeople = [...peopleInvolved];
      updatedPeople.splice(index, 1);
      setPeopleInvolved(updatedPeople);
  };

  // Handle the input changes for people involved
  const handlePersonChange = (index, event) => {
      const { name, value } = event.target;
      const updatedPeople = [...peopleInvolved];
      updatedPeople[index][name] = value;
      setPeopleInvolved(updatedPeople);
  };

  // Handle the form submission
  const handleSubmit = async (e) => {
      e.preventDefault();
      const reportData = {
          officer_id: officerId,
          date,
          address,
          urgency,
          start_time: startTime,
          resolved,
          time_resolved: timeResolved,
          event_description: eventDescription,
          comments,
          full_name: fullName,
          contact_info: contactInfo,
          pms_email: pmsEmail,
          people_involved: peopleInvolved
      };

      try {
        setLoading(true); // Show loading spinner
        const response = await fetch(`${apiUrl}/api/make_report`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(reportData),
        });
  
        if (response.ok) {
          const data = await response.json();
          console.log(data.message);
  
          // Show submitted message
          setLoading(false);
          setSubmitted(true);
  
          // Navigate after 2 seconds
          setTimeout(() => {
            navigate('/'); // Redirect to dashboard after successful submission
          }, 2000);
        } else {
          console.error('Failed to submit report');
          setLoading(false);
        }
      } catch (error) {
        console.error('Error submitting report:', error);
        setLoading(false);
      }
    };

  return (
      <div className="create-report-container">
          <h1>Create New Report</h1>

          {loading ? (
            <div className="loading-container">
              <Spinner animation="border" role="status">
                <span className="sr-only">Loading...</span>
              </Spinner>
              <p>Submitting your report...</p>
            </div>
          ) : submitted ? (
            <div className="submitted-container">
              <h2>Report Submitted Successfully!</h2>
              <p>You will be redirected shortly...</p>
            </div>
          ) : (
            <Form onSubmit={handleSubmit}>
              <Row>
                  <Col md={6}>
                      <Form.Group controlId="officerId">
                          <Form.Label>Officer ID</Form.Label>
                          <Form.Control
                              type="text"
                              value={officerId}
                              onChange={(e) => setOfficerId(e.target.value)}
                              placeholder="Enter officer ID"
                              required
                          />
                      </Form.Group>
                  </Col>
                  <Col md={6}>
                      <Form.Group controlId="date">
                          <Form.Label>Date</Form.Label>
                          <Form.Control
                              type="date"
                              value={date}
                              onChange={(e) => setDate(e.target.value)}
                              required
                          />
                      </Form.Group>
                  </Col>
              </Row>

              <Form.Group controlId="address">
                  <Form.Label>Address</Form.Label>
                  <Form.Control
                      type="text"
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      placeholder="Enter address"
                      required
                  />
              </Form.Group>

              <Form.Group controlId="urgency">
                  <Form.Label>Urgency</Form.Label>
                  <Form.Control
                      as="select"
                      value={urgency}
                      onChange={(e) => setUrgency(e.target.value)}
                      required
                  >
                      <option value="">Select urgency</option>
                      <option value="Low">Low</option>
                      <option value="Medium">Medium</option>
                      <option value="High">High</option>
                  </Form.Control>
              </Form.Group>

              <Row>
                  <Col md={6}>
                      <Form.Group controlId="startTime">
                          <Form.Label>Start Time</Form.Label>
                          <Form.Control
                              type="time"
                              value={startTime}
                              onChange={(e) => setStartTime(e.target.value)}
                              required
                          />
                      </Form.Group>
                  </Col>
                  <Col md={6}>
                      <Form.Group controlId="resolved">
                          <Form.Label>Resolved</Form.Label>
                          <Form.Control
                              as="select"
                              value={resolved}
                              onChange={(e) => setResolved(e.target.value)}
                              required
                          >
                              <option value="">Select status</option>
                              <option value="Yes">Yes</option>
                              <option value="No">No</option>
                          </Form.Control>
                      </Form.Group>
                  </Col>
              </Row>

              {resolved === 'Yes' && (
                  <Form.Group controlId="timeResolved">
                      <Form.Label>Time Resolved</Form.Label>
                      <Form.Control
                          type="time"
                          value={timeResolved}
                          onChange={(e) => setTimeResolved(e.target.value)}
                      />
                  </Form.Group>
              )}

              <Form.Group controlId="eventDescription">
                  <Form.Label>Event Description</Form.Label>
                  <Form.Control
                      as="textarea"
                      rows={3}
                      value={eventDescription}
                      onChange={(e) => setEventDescription(e.target.value)}
                      placeholder="Describe the event"
                      required
                  />
              </Form.Group>

              <Form.Group controlId="comments">
                  <Form.Label>Comments</Form.Label>
                  <Form.Control
                      as="textarea"
                      rows={2}
                      value={comments}
                      onChange={(e) => setComments(e.target.value)}
                      placeholder="Additional comments (optional)"
                  />
              </Form.Group>

              <Row>
                  <Col md={6}>
                      <Form.Group controlId="fullName">
                          <Form.Label>Full Name</Form.Label>
                          <Form.Control
                              type="text"
                              value={fullName}
                              onChange={(e) => setFullName(e.target.value)}
                              placeholder="Enter your full name"
                              required
                          />
                      </Form.Group>
                  </Col>
                  <Col md={6}>
                      <Form.Group controlId="contactInfo">
                          <Form.Label>Contact Info</Form.Label>
                          <Form.Control
                              type="text"
                              value={contactInfo}
                              onChange={(e) => setContactInfo(e.target.value)}
                              placeholder="Enter your contact info"
                              required
                          />
                      </Form.Group>
                  </Col>
              </Row>

              <Form.Group controlId="pmsEmail">
                  <Form.Label>Property Manager's Email</Form.Label>
                  <Form.Control
                      type="email"
                      value={pmsEmail}
                      onChange={(e) => setPmsEmail(e.target.value)}
                      placeholder="Enter PM's email"
                      required
                  />
              </Form.Group>

              <h3>People Involved</h3>
              {peopleInvolved.map((person, index) => (
                  <div key={index} className="person-involved">
                      <Row>
                          <Col md={6}>
                              <Form.Group controlId={`name-${index}`}>
                                  <Form.Label>Name</Form.Label>
                                  <Form.Control
                                      type="text"
                                      name="name"
                                      value={person.name}
                                      onChange={(e) => handlePersonChange(index, e)}
                                      placeholder="Enter name"
                                      required
                                  />
                              </Form.Group>
                          </Col>
                          <Col md={6}>
                              <Form.Group controlId={`personType-${index}`}>
                                  <Form.Label>Person Type</Form.Label>
                                  <Form.Control
                                      type="text"
                                      name="person_type"
                                      value={person.person_type}
                                      onChange={(e) => handlePersonChange(index, e)}
                                      placeholder="e.g., Witness, Suspect, etc."
                                      required
                                  />
                              </Form.Group>
                          </Col>
                      </Row>

                      <Row>
                          <Col md={6}>
                              <Form.Group controlId={`unitNumber-${index}`}>
                                  <Form.Label>Unit Number</Form.Label>
                                  <Form.Control
                                      type="text"
                                      name="unit_number"
                                      value={person.unit_number}
                                      onChange={(e) => handlePersonChange(index, e)}
                                      placeholder="Enter unit number (if applicable)"
                                  />
                              </Form.Group>
                          </Col>
                          <Col md={6}>
                              <Form.Group controlId={`contactInfo-${index}`}>
                                  <Form.Label>Contact Info</Form.Label>
                                  <Form.Control
                                      type="text"
                                      name="contact_info"
                                      value={person.contact_info}
                                      onChange={(e) => handlePersonChange(index, e)}
                                      placeholder="Enter contact info (optional)"
                                  />
                              </Form.Group>
                          </Col>
                      </Row>

                      <Form.Group controlId={`additionalInfo-${index}`}>
                          <Form.Label>Additional Info</Form.Label>
                          <Form.Control
                              as="textarea"
                              rows={2}
                              name="additional_info"
                              value={person.additional_info}
                              onChange={(e) => handlePersonChange(index, e)}
                              placeholder="Enter any additional info"
                          />
                      </Form.Group>

                      {index > 0 && (
                          <Button variant="danger" onClick={() => handleRemovePerson(index)} className="mb-3">
                              Remove Person
                          </Button>
                      )}
                  </div>
              ))}

              <Button variant="primary" onClick={handleAddPerson} className="mb-3">
                  Add Another Person
              </Button>

              <Button variant="success" type="submit">
                  Submit Report
              </Button>
          </Form>
          )}
      </div>
  );
}

export default OfficerPortalPage;