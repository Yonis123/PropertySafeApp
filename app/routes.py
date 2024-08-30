from flask import Blueprint, request, jsonify
from app.models import db, IncidentReport, PersonInvolved
from datetime import datetime
from app import db


main = Blueprint('main', __name__)


# an api to create an incicent report

@main.route('/api/reports', methods=['POST'])
def create_report():
    data = request.get_json()

    # Convert the date string to a Python date object
    date_obj = datetime.strptime(data['date'], '%Y-%m-%d').date()

    # Create the IncidentReport instance
    new_report = IncidentReport(
        date=date_obj,
        address=data['address'],
        urgency=data['urgency'],
        start_time=datetime.strptime(data['start_time'], '%H:%M:%S').time(),  # Convert time string to time object
        resolved=data['resolved'],
        time_resolved=datetime.strptime(data['time_resolved'], '%H:%M:%S').time() if data.get('time_resolved') else None,
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

    return jsonify({
        "message": "Report and associated people created successfully",
        "report": new_report.to_dict()
    }), 201
    
    
# an api to get all the reports that a property manager receive  sorted by most recent

@main.route('/api/reports/<pms_email>', methods=['GET'])
def get_reports_for_manager(pms_email):
    # Query the database for reports associated with the given pms_email
    reports = IncidentReport.query.filter_by(pms_email=pms_email).order_by(IncidentReport.date.desc()).all()
    
    # Serialize the reports
    reports_list = [report.to_dict() for report in reports]
    
    return jsonify({"reports": reports_list}), 200

    
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
def get_report(id):
    report = IncidentReport.query.get_or_404(id)
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


