from app import db

class IncidentReport(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    officer_id = db.Column(db.String(50), nullable=False)
    date = db.Column(db.Date, nullable=False)
    address = db.Column(db.String(255), nullable=False)
    urgency = db.Column(db.String(50), nullable=False)
    start_time = db.Column(db.Time, nullable=False)
    resolved = db.Column(db.String(50), nullable=False)
    time_resolved = db.Column(db.Time, nullable=True)
    event_description = db.Column(db.Text, nullable=False)
    comments = db.Column(db.Text, nullable=True)
    full_name = db.Column(db.String(120), nullable=False)
    contact_info = db.Column(db.String(120), nullable=False)
    pms_email = db.Column(db.String(120), nullable=False)

    # Establishing a relationship with the PersonInvolved model
    people_involved = db.relationship('PersonInvolved', backref='incident_report', lazy=True, cascade="all, delete-orphan")

    def to_dict(self):
        return {
            'id': self.id,
            'date': self.date.isoformat(),
            'address': self.address,
            'urgency': self.urgency,
            'start_time': self.start_time.strftime('%H:%M:%S'),
            'resolved': self.resolved,
            'time_resolved': self.time_resolved.strftime('%H:%M:%S') if self.time_resolved else None,
            'event_description': self.event_description,
            'comments': self.comments,
            'full_name': self.full_name,
            'contact_info': self.contact_info,
            'pms_email': self.pms_email,
            'people_involved': [person.to_dict() for person in self.people_involved]
        }

class PersonInvolved(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    report_id = db.Column(db.Integer, db.ForeignKey('incident_report.id'), nullable=False)
    name = db.Column(db.String(120), nullable=False)
    person_type = db.Column(db.String(50), nullable=False)
    unit_number = db.Column(db.String(50), nullable=True)
    additional_info = db.Column(db.Text, nullable=True)
    contact_info = db.Column(db.String(120), nullable=True)

    def to_dict(self):
        return {
            'id': self.id,
            'report_id': self.report_id,
            'name': self.name,
            'person_type': self.person_type,
            'unit_number': self.unit_number,
            'additional_info': self.additional_info,
            'contact_info': self.contact_info
        }