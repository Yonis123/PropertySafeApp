import openai
import os

openai.api_key = os.getenv("OPENAI_API_KEY")


def generate_ai_summary(report):
    try:
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
                    "content": f"Please summarize the following data regarding an incident report sent by a security officer, focusing primarily on the key events that occurred. Additionally, suggest potential actions the property manager could take:\n\n{report}"
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
 
 
