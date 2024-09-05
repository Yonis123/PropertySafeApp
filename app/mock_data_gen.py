from app import create_app, db
from app.models import IncidentReport, PersonInvolved, PropertyManager
from datetime import date, time

app = create_app()

# Create the app context
with app.app_context():
    db.create_all()  # Ensure the tables are created

    # Mock Incident Reports
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
            pms_email="yonis_123@live.com"
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
            pms_email="yonis_123@live.com"
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
            pms_email="yonis_123@live.com"
        ),
        IncidentReport(
            officer_id="OFF12345",
            date=date(2024, 9, 1),
            address="123 Main St, Toronto, ON",
            urgency="High",
            start_time=time(14, 30),
            resolved="No",
            time_resolved=None,
            event_description="Suspicious activity reported near the main entrance.",
            comments="No additional comments.",
            full_name="John Doe",
            contact_info="johndoe@example.com",
            pms_email="yonis_123@live.com"
        ),
        IncidentReport(
            officer_id="OFF67890",
            date=date(2024, 9, 2),
            address="456 Oak St, Toronto, ON",
            urgency="Medium",
            start_time=time(9, 0),
            resolved="Yes",
            time_resolved=time(11, 30),
            event_description="Broken window reported on the ground floor.",
            comments="Replaced window on the same day.",
            full_name="Jane Smith",
            contact_info="janesmith@example.com",
            pms_email="yonis_123@live.com"
        ) 
    ]
    
    # Add Incident Reports to session
    db.session.add_all(mock_data)
    db.session.commit()  # Commit here to get IDs for the incident reports

    # Associate people with the incidents
    people_involved = [
        PersonInvolved(
            report_id=mock_data[0].id,  # Associated with the first incident report
            name="Alice Johnson",
            person_type="Witness",
            unit_number="101",
            additional_info="Saw two individuals entering the building.",
            contact_info="alicejohnson@example.com"
        ),
        PersonInvolved(
            report_id=mock_data[0].id,  # Associated with the first incident report
            name="Bob Williams",
            person_type="Suspect",
            unit_number=None,
            additional_info="Identified by the witness as one of the intruders.",
            contact_info=None
        ),
        PersonInvolved(
            report_id=mock_data[1].id,  # Associated with the second incident report
            name="Charlie Davis",
            person_type="Witness",
            unit_number="202",
            additional_info="Observed a person lingering near the lobby.",
            contact_info="charliedavis@example.com"
        ),
        PersonInvolved(
            report_id=mock_data[2].id,  # Associated with the third incident report
            name="Eve Martinez",
            person_type="Firefighter",
            unit_number=None,
            additional_info="Responded to the fire call.",
            contact_info="evemartinez@example.com"
        ),
        PersonInvolved(
            report_id=mock_data[2].id,  # Associated with the third incident report
            name="Franklin Green",
            person_type="Witness",
            unit_number="305",
            additional_info="Noticed smoke coming from the garbage area.",
            contact_info="franklingreen@example.com"
        ),
        PersonInvolved(
            report_id=mock_data[3].id,
            name="Mike Johnson",
            person_type="Witness",
            unit_number="Apt 101",
            additional_info="Provided a detailed description of the suspect.",
            contact_info="mikejohnson@example.com"
        ),
        PersonInvolved(
            report_id=mock_data[3].id,
            name="Suspect Unknown",
            person_type="Suspect",
            unit_number=None,
            additional_info="Suspect was wearing a black hoodie and jeans.",
            contact_info=None
        ),
        PersonInvolved(
            report_id=mock_data[4].id,
            name="Security Officer 2",
            person_type="Responding Officer",
            unit_number=None,
            additional_info="Responded to the scene and filed a report.",
            contact_info="security2@example.com"
        )
    ]
    
    # Add People Involved to session
    db.session.add_all(people_involved)

    # Create a Property Manager
    pm = PropertyManager(email="yonis_123@live.com")
    pm.set_password("welcome22")

    # Add Property Manager to session
    db.session.add(pm)

    # Commit all changes
    db.session.commit()

    print("Mock data added successfully!")