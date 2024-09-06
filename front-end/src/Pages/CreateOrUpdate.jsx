import React from 'react';
import Button from 'react-bootstrap/Button';
import { useNavigate } from 'react-router-dom';
import './CreateOrUpdate.css';  // Import the updated custom CSS
import reportImage from '../assets/png/paper_pic.png';  // Your create image
import report2Image from '../assets/png/report_pic.png';  // Your update image

function CreateOrUpdatePage() {
    const navigate = useNavigate();

    const handleCreate = () => {
        navigate('/officer-portal-page');
    };

    const handleUpdate = () => {
        navigate('/update-report');
    };

    return (
        <div className="create-update-container">
            <div className="hero-section">
                <h1 className="display-4">Create or Update a Report</h1>
                <p className="lead">Choose an option to continue:</p>
            </div>
            <div className="role-selection">
                <div className="role-card">
                    <div onClick={handleCreate} className="role-image">
                        <img src={reportImage} alt="Create Report" />
                    </div>
                    <Button variant="primary" className="mx-2" onClick={handleCreate}>
                        Create New Report
                    </Button>
                </div>
                <div className="role-card">
                    <div onClick={handleUpdate} className="role-image">
                        <img src={report2Image} alt="Update Report" />
                    </div>
                    <Button variant="secondary" className="mx-2" onClick={handleUpdate}>
                        Update Existing Report
                    </Button>
                </div>
            </div>
        </div>
    );
}

export default CreateOrUpdatePage;