import React from 'react';
import { useNavigate } from 'react-router-dom';
import Button from 'react-bootstrap/Button';
import './HomePage.css';  // Custom CSS for additional styling
import pmpic from '../assets/png/pmpic.png';
import secpic from '../assets/png/secpic.png';

function HomePage() {
    const navigate = useNavigate();

    const handleSelection = (role) => {
        if (role === 'officer') {
            navigate('/officer-portal-page');
        } else if (role === 'manager') {
            navigate('/pm-portal');
        }
    };

    return (
        <div className="homepage-container">
            <div className="hero-section">
                <h1 className="display-4">Welcome to the Incident Reporting System</h1>
                <p className="lead">Please select your role to continue:</p>
            </div>
            <div className="role-selection">
                <div className="role-card">
                    <img 
                        src={secpic} 
                        alt="Security Officer" 
                        className="role-image" 
                        onClick={() => handleSelection('officer')} // Added onClick handler for the image
                        style={{ cursor: 'pointer' }} // Optional: Change cursor to pointer on hover
                    />
                    <Button 
                        variant="primary"
                        className="mx-2"
                        onClick={() => handleSelection('officer')}
                    >
                        Security Officer
                    </Button>
                </div>
                <div className="role-card">
                    <img 
                        src={pmpic} 
                        alt="Property Manager" 
                        className="role-image" 
                        onClick={() => handleSelection('manager')} // Added onClick handler for the image
                        style={{ cursor: 'pointer' }} // Optional: Change cursor to pointer on hover
                    />
                    <Button 
                        variant="secondary"
                        className="mx-2"
                        onClick={() => handleSelection('manager')}
                    >
                        Property Manager
                    </Button>
                </div>
            </div>
        </div>
    );
}

export default HomePage;