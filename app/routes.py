from flask import Blueprint, request, jsonify
from app.models import db, IncidentReport, PersonInvolved
from datetime import datetime
from app import db
from app.models import PropertyManager
from flask_login import login_user, logout_user, login_required, current_user
from app.email_utils import send_report_notification, send_notif_update
from werkzeug.security import generate_password_hash
from flask_cors import cross_origin

main = Blueprint('main', __name__)


# a route to create an account for pm. 
@main.route('/api/create-account', methods=['POST'])
def create_account():
    data = request.get_json()

    # Extract the fields from the request
    email = data.get('email')
    password = data.get('password')

    # Check if the username or email already exists
    existing_user = PropertyManager.query.filter((PropertyManager.email == email)).first()
    if existing_user:
        return jsonify({"error": "Username or email already exists"}), 400

    # Create a new PropertyManager instance
    new_pm = PropertyManager(
        email=email,
        password_hash=generate_password_hash(password)
    )

    # Add the new property manager to the database
    db.session.add(new_pm)
    db.session.commit()

    return jsonify({"message": "Account created successfully"}), 201


# i need a route to get the number of reports for the pm 

@main.route('/api/reports_count/<pms_email>', methods=['GET'])
@cross_origin(supports_credentials=True)
def get_reports_count(pms_email):
    # Query the database to count the number of reports sent to the given PM
    report_count = IncidentReport.query.filter_by(pms_email=pms_email).count()

    # Return the count as a JSON response
    return jsonify({'pm_email': pms_email, 'reports_count': report_count})
    

# an api to create an incicent report

@main.route('/api/make_report', methods=['POST'])
def create_report():
    data = request.get_json()

    # Convert the date string to a Python date object
    date_obj = datetime.strptime(data['date'], '%Y-%m-%d').date()

    # Try to parse the start time and time resolved in either format
    start_time_str = data['start_time']
    try:
        start_time_obj = datetime.strptime(start_time_str, '%H:%M:%S').time()
    except ValueError:
        start_time_obj = datetime.strptime(start_time_str, '%H:%M').time()

    time_resolved_str = data.get('time_resolved')
    time_resolved_obj = None
    if time_resolved_str:
        try:
            time_resolved_obj = datetime.strptime(time_resolved_str, '%H:%M:%S').time()
        except ValueError:
            time_resolved_obj = datetime.strptime(time_resolved_str, '%H:%M').time()

    # Create the IncidentReport instance
    new_report = IncidentReport(
        date=date_obj,
        officer_id=data['officer_id'],
        address=data['address'],
        urgency=data['urgency'],
        start_time=start_time_obj,
        resolved=data['resolved'],
        time_resolved=time_resolved_obj,
        event_description=data['event_description'],
        comments=data.get('comments'),
        full_name=data['full_name'],
        contact_info=data['contact_info'],
        pms_email=data['pms_email']
    )

    # Add the incident report to the session
    db.session.add(new_report)
    db.session.commit()

    # Add the people involved
    people_data = data.get('people_involved', [])
    for person in people_data:
        new_person = PersonInvolved(
            report_id=new_report.id,
            name=person['name'],
            person_type=person['person_type'],
            unit_number=person.get('unit_number'),
            additional_info=person.get('additional_info'),
            contact_info=person.get('contact_info')
        )
        db.session.add(new_person)

    # Commit the transaction to save both the report and the people involved
    db.session.commit()

    # Optionally, send a notification to the property manager about the report
    send_report_notification(new_report.pms_email, new_report)

    return jsonify({
        "message": "Report and associated people created successfully",
        "report": new_report.to_dict()
    }), 201
    
# an api to get all the reports that a property manager receive  sorted by most recent

@main.route('/api/reports/<pms_email>', methods=['GET'])
@cross_origin(supports_credentials=True)
def get_reports_for_manager(pms_email):
    # Query the database for reports associated with the given pms_email
    reports = IncidentReport.query.filter_by(pms_email=pms_email).order_by(IncidentReport.date.desc()).all()
    
    # Serialize the reports
    reports_list = [report.to_dict() for report in reports]
    
    return jsonify({"reports": reports_list}), 200


# search function 
@main.route('/api/search_reports', methods=['GET'])
@cross_origin(supports_credentials=True)
def search_reports():
    pm_email = request.args.get('pm_email')  # Property manager's email
    unit_number = request.args.get('unit_number')  # Unit number to filter by
    start_date = request.args.get('start_date')  # Start date to filter by
    end_date = request.args.get('end_date')  # End date to filter by
    unresolved = request.args.get('unresolved')  # Filter unresolved reports

    # Start the query by filtering reports associated with the PM
    query = IncidentReport.query.filter_by(pms_email=pm_email)

    # Filter by unit number if provided
    if unit_number:
        query = query.join(PersonInvolved).filter(PersonInvolved.unit_number == unit_number)

    # Filter by date range if provided
    if start_date:
        try:
            start_date_obj = datetime.strptime(start_date, '%Y-%m-%d').date()
            query = query.filter(IncidentReport.date >= start_date_obj)
        except ValueError:
            return jsonify({"error": "Invalid start date format"}), 400

    if end_date:
        try:
            end_date_obj = datetime.strptime(end_date, '%Y-%m-%d').date()
            query = query.filter(IncidentReport.date <= end_date_obj)
        except ValueError:
            return jsonify({"error": "Invalid end date format"}), 400

    # Filter by unresolved reports if requested
    if unresolved == 'true':
        query = query.filter(IncidentReport.resolved == 'No')

    # Execute the query and get the filtered reports
    reports = query.all()

    # Convert reports to a format that can be returned as JSON
    report_list = [report.to_dict() for report in reports]

    return jsonify({'reports': report_list})

    
# an api that gets all the reports of a particular unit number sent to them 
@main.route('/api/reports/unit', methods=['GET'])
def get_reports_by_unit_and_pms_email():
    unit_number = request.args.get('unit_number')
    pms_email = request.args.get('pms_email')
    
    if not unit_number:
        return jsonify({"error": "Unit number is required"}), 400
    
    if not pms_email:
        return jsonify({"error": "Property manager email is required"}), 400
    
    # Query to find all reports where the associated people have the specified unit number and the pms_email matches
    reports = (IncidentReport.query
               .join(PersonInvolved)
               .filter(PersonInvolved.unit_number == unit_number)
               .filter(IncidentReport.pms_email == pms_email)
               .all())
    
    # Serialize the reports
    reports_list = [report.to_dict() for report in reports]
    
    return jsonify({"reports": reports_list}), 200
    
 
#  an api for the specified dates
@main.route('/api/reports/date-range', methods=['GET'])
def get_reports_by_date_range():
    pms_email = request.args.get('pms_email')
    start_date = request.args.get('start_date')
    end_date = request.args.get('end_date')

    # Check if all required parameters are provided
    if not pms_email or not start_date or not end_date:
        return jsonify({"error": "Property manager email, start_date, and end_date are required"}), 400

    try:
        # Convert start_date and end_date to date objects
        start_date_obj = datetime.strptime(start_date, '%Y-%m-%d').date()
        end_date_obj = datetime.strptime(end_date, '%Y-%m-%d').date()
    except ValueError:
        return jsonify({"error": "Invalid date format. Use YYYY-MM-DD."}), 400

    # Query the database for reports within the date range and matching the pms_email
    reports = (IncidentReport.query
               .filter(IncidentReport.date >= start_date_obj)
               .filter(IncidentReport.date <= end_date_obj)
               .filter(IncidentReport.pms_email == pms_email)
               .all())

    # Serialize the reports
    reports_list = [report.to_dict() for report in reports]

    return jsonify({"reports": reports_list}), 200
    
# Get all Incident Reports
@main.route('/api/reports', methods=['GET'])
def get_reports():
    reports = IncidentReport.query.all()
    return jsonify([report.to_dict() for report in reports])

# Get a Single Incident Report
@main.route('/api/reports/<int:id>', methods=['GET'])
@cross_origin(supports_credentials=True)
def get_report(id):
    report = IncidentReport.query.get_or_404(id)
    return jsonify(report.to_dict())


# resolve report
@main.route('/api/resolve/<int:id>', methods=['PUT'])
@cross_origin(supports_credentials=True)
def resolve_report(id):
    report = IncidentReport.query.get_or_404(id)
    report.resolved = "Yes"
    report.time_resolved = datetime.strptime(datetime.now().strftime('%H:%M:%S'), '%H:%M:%S').time()
    db.session.commit()
    
    
    return jsonify(report.to_dict())

# Update an Incident Report
@main.route('/api/reports/<int:id>', methods=['PUT'])
def update_report(id):
    report = IncidentReport.query.get_or_404(id)
    data = request.get_json()
    
    date_obj = datetime.strptime(data['date'], '%Y-%m-%d').date()
    
    report.date= date_obj
    report.address = data['address']
    report.urgency = data['urgency']
    report.start_time = datetime.strptime(data['start_time'], '%H:%M:%S').time()
    report.resolved = data['resolved']
    report.time_resolved = datetime.strptime(data['start_time'], '%H:%M:%S').time()
    report.event_description = data['event_description']
    report.comments = data.get('comments')
    report.full_name = data['full_name']
    report.contact_info = data['contact_info']
    report.pms_email = data['pms_email']
    db.session.commit()
    return jsonify({"message": "Report updated successfully"})

# Delete an Incident Report
@main.route('/api/reports/<int:id>', methods=['DELETE'])
def delete_report(id):
    report = IncidentReport.query.get_or_404(id)
    db.session.delete(report)
    db.session.commit()
    return jsonify({"message": "Report deleted successfully"})

# gets all reports from an officer 

@main.route('/api/officer_reports', methods=['GET'])
@cross_origin(supports_credentials=True)
def get_officer_reports():
    officer_id = request.args.get('officer_id')  # Get the officer ID from query params

    # Debug: print officer_id
    print(f"Officer ID received: {officer_id}")

    # Check if officer_id is provided
    if not officer_id:
        return jsonify({"error": "Officer ID is required"}), 400

    try:
        # Convert officer_id to the correct type (integer) if necessary
        try:
            officer_id = int(officer_id)  # Assuming officer_id is an integer in your database
        except ValueError:
            return jsonify({"error": "Officer ID must be a valid integer"}), 400

        # Query the database for reports by the officer's ID
        reports = IncidentReport.query.filter_by(officer_id=officer_id).all()

        # Debug: print the reports retrieved
        print(f"Reports retrieved: {reports}")

        # If no reports are found
        if not reports:
            return jsonify({"message": "No reports found for the provided officer ID"}), 404

        # Convert reports to a list of dictionaries
        reports_data = [report.to_dict() for report in reports]

        return jsonify({"officer_id": officer_id, "reports": reports_data}), 200

    except Exception as e:
        print(f"Error occurred while retrieving reports: {e}")
        return jsonify({"error": "An internal error occurred while retrieving reports."}), 500

@main.route('/api/reports/<int:report_id>/update', methods=['PUT'])
@cross_origin(supports_credentials=True)
def updater_report(report_id):
    # Retrieve the report by its ID
    report = IncidentReport.query.get_or_404(report_id)
    
    # Get the additional information from the request body
    data = request.get_json()
    additional_info = data.get('additional_info')

    # Check if additional information was provided
    if not additional_info:
        return jsonify({'error': 'No additional information provided'}), 400

    # Append the new additional information to the report's comments
    if report.comments:
        report.comments += f"\n\n The officer later provided the following update: {additional_info}"
    else:
        report.comments = f"Additional Info: {additional_info}"

    # Commit the changes to the database
    db.session.commit()

    # Send notification after updating the report
    send_notif_update(report)

    return jsonify({
        'message': 'Report updated successfully',
        'report': report.to_dict()  # Assuming you have a method to serialize the report
    }), 200