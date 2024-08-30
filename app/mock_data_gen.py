from app import create_app, db
from app.models import IncidentReport, PersonInvolved
from datetime import date, time

app = create_app()

# Create the app context
with app.app_context():
    db.create_all()  # Ensure the tables are created

    # Your mock data
    mock_data = [
        IncidentReport(
            officer_id="OFF12345",
            date=date(2024, 8, 30),
            address="1234 Elm Street",
            urgency="High",
            start_time=time(14, 30),
            resolved="Yes",
            time_resolved=time(15, 45),
            event_description="Suspicious activity reported.",
            comments="No further issues.",
            full_name="John Doe",
            contact_info="john.doe@example.com",
            pms_email="propertymanager@example.com"
        ),
         IncidentReport(
        officer_id="OFF456",
        date=date(2024, 8, 2),
        address="456 Elm St, Toronto, ON",
        urgency="Medium",
        start_time=time(10, 15),
        resolved="No",
        time_resolved=None,
        event_description="Suspicious person loitering near the entrance.",
        comments="Person left before police arrived.",
        full_name="Jane Smith",
        contact_info="janesmith@example.com",
        pms_email="propertymanager@example.com"
    ),
         IncidentReport(
        officer_id="OFF789",
        date=date(2024, 8, 3),
        address="789 Pine St, Toronto, ON",
        urgency="Low",
        start_time=time(18, 45),
        resolved="Yes",
        time_resolved=time(19, 15),
        event_description="A minor fire was reported in the garbage disposal area.",
        comments="Fire department responded and extinguished the fire.",
        full_name="Michael Brown",
        contact_info="michaelbrown@example.com",
        pms_email="pm2@example.com"
    )
        
        # Add more mock data as needed
    ]
    
    
    people_involved = [
    PersonInvolved(
        report_id=1,  # Associated with the first incident report
        name="Alice Johnson",
        person_type="Witness",
        unit_number="101",
        additional_info="Saw two individuals entering the building.",
        contact_info="alicejohnson@example.com"
    ),
    PersonInvolved(
        report_id=1,  # Associated with the first incident report
        name="Bob Williams",
        person_type="Suspect",
        unit_number=None,
        additional_info="Identified by the witness as one of the intruders.",
        contact_info=None
    ),
    PersonInvolved(
        report_id=2,  # Associated with the second incident report
        name="Charlie Davis",
        person_type="Witness",
        unit_number="202",
        additional_info="Observed a person lingering near the lobby.",
        contact_info="charliedavis@example.com"
    ),
    PersonInvolved(
        report_id=3,  # Associated with the third incident report
        name="Eve Martinez",
        person_type="Firefighter",
        unit_number=None,
        additional_info="Responded to the fire call.",
        contact_info="evemartinez@example.com"
    ),
    PersonInvolved(
        report_id=3,  # Associated with the third incident report
        name="Franklin Green",
        person_type="Witness",
        unit_number="305",
        additional_info="Noticed smoke coming from the garbage area.",
        contact_info="franklingreen@example.com"
    )
]


    # Add mock data to the session and commit to the database
    db.session.add_all(mock_data)
    db.session.add_all(people_involved)
    
    db.session.commit()

    print("Mock data added successfully!")