from flask_mail import Message
from app import mail
from app.summary_utils import generate_ai_summary
import os

def send_report_notification(pm_email, report):
    try:
        subject = f"Incident Report - {report.date.strftime('%B %d, %Y')}"

        # Generate the AI summary for the report
        summary = generate_ai_summary(report)

        # Compose the email content
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
                {summary}
            </p>
            <p style="font-size: 14px; color: #7f8c8d;">
                This is an automated notification from the Incident Reporting System. Please do not reply to this email.
            </p>
        </body>
        </html>
        """

        # Create the email message
        msg = Message(subject=subject,
                      recipients=[pm_email],
                      sender=os.getenv("MAIL_USERNAME"),
                      html=html_content)

        # Send the email
        mail.send(msg)
        print(f"Email sent successfully to {pm_email}")

    except Exception as e:
        print(f"Error sending email: {str(e)}")
        
        
def send_notif_update(report):
    try:
        # Property manager's email
        pm_email = report.pms_email

        # Subject for the email
        subject = f"Incident Report Updated - Report ID {report.id}"

        # Email content
        html_content = f"""
        <html>
        <body>
            <h2 style="color: #2c3e50;">Incident Report Update</h2>
            <p style="font-size: 16px; line-height: 1.6;">
                <strong>Date:</strong> {report.date.strftime('%B %d, %Y')}<br>
                <strong>Location:</strong> {report.address}<br>
                <strong>Officer ID:</strong> {report.officer_id}<br>
            </p>
            <h3 style="color: #2c3e50;">Update Summary:</h3>
            <p style="font-size: 16px; line-height: 1.6;">
                 Report {report.id} has been updated with additional information. Please log in to review the latest details.
            </p>
            <p style="font-size: 14px; color: #7f8c8d;">
                This is an automated notification from the Incident Reporting System. Please do not reply to this email.
            </p>
        </body>
        </html>
        """

        # Create the email message
        msg = Message(subject=subject,
                      recipients=[pm_email],
                      sender=os.getenv("MAIL_USERNAME"),
                      html=html_content)

        # Send the email
        mail.send(msg)
        print(f"Email sent successfully to {pm_email}")

    except Exception as e:
        print(f"Error sending email: {str(e)}")