from flask_mail import Message
from app import mail
from app.summary_utils import generate_ai_summary
import os

def send_report_notification(pm_email, report):
    subject = f"Incident Report - {report.date.strftime('%B %d, %Y')}"
    
    html_content = f"""
    <html>
    <body>
        <h2 style="color: #2c3e50;">Incident Report Summary</h2>
        <p style="font-size: 16px; line-height: 1.6;">
            <strong>Date:</strong> {report.date.strftime('%B %d, %Y')}<br>
            <strong>Time:</strong> {report.start_time.strftime('%H:%M')}<br>
            <strong>Location:</strong> {report.address}<br>
            <strong>Officer ID:</strong> {report.officer_id}<br>
            <strong>Urgency Level:</strong> {report.urgency}<br>
        </p>
        <h3 style="color: #2c3e50;">Summary:</h3>
        <p style="font-size: 16px; line-height: 1.6;">
            {generate_ai_summary(report)}
        </p>
        <p style="font-size: 14px; color: #7f8c8d;">
            This is an automated notification from the Incident Reporting System. Please do not reply to this email.
        </p>
    </body>
    </html>
    """
    
    msg = Message(subject=subject,
                  recipients=[pm_email], sender=os.getenv("MAIL_USERNAME"), html=html_content)
   
    mail.send(msg)