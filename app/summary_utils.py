import openai
import os

openai.api_key = os.getenv("OPENAI_API_KEY")


def generate_ai_summary(report):
    try:

        report_data = {
            "officer_id": report.officer_id,
            "date": report.date.strftime('%Y-%m-%d'),
            "start_time": report.start_time.strftime('%H:%M'),
            "address": report.address,
            "urgency": report.urgency,
            "event_description": report.event_description,
            "resolved": report.resolved,
            "time_resolved": report.time_resolved.strftime('%H:%M') if report.time_resolved else None,
            "comments": report.comments
        }
        
        # Create a chat completion request
        response = openai.ChatCompletion.create(
            model="gpt-3.5-turbo",  # You can use "gpt-4" if available
            messages=[
                {
                    "role": "system",
                    "content": "You are a helpful assistant that is really good at taking json data and summarizing it."
                },
                {
                    "role": "user",
                    "content": f"Please summarize the following data regarding an incident report sent by a security officer, foucs on describing overall what happened:\n\n{report_data}"
                }
            ],
            max_tokens=150
        )
        # Extract the summary from the response
        summary = response['choices'][0]['message']['content'].strip()
        return summary
    except Exception as e:
        print(f"Error generating summary: {str(e)}")
        return "Summary could not be generated."
 
 
