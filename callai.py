from flask import Flask, request, jsonify
from flask_cors import CORS
from google import genai
from google.genai import types
import os

app = Flask(__name__)
# CORS ensures your HTML frontend can communicate with this backend smoothly
CORS(app)

def analyze_content(content_to_analyze: str) -> str:
    # Initializing client with your team's test API key
    client = genai.Client(
        api_key="AQ.Ab8RN6I1MgU_t8e1AW6QsuBz0BdFnsa5zyv1kZ7a1kT7FfJg6Q"
    )

    model = "gemini-2.5-flash"

    prompt = f"""
You are a fraud investigator and cybersecurity analyst.

Analyze the following content for potential scams.

Tasks:
1. Determine the probability it is a scam (0-100%).
2. Identify every red flag.
3. Explain the scam tactics being used.
4. List evidence FOR legitimacy.
5. List evidence FOR fraud.
6. Identify what information is missing.
7. Describe the most likely scam type.
8. Assess financial, identity theft, and malware risk separately.
9. Tell me exactly how to verify it safely.
10. Give a final verdict.

IMPORTANT:
- THE VERDICT MUST BE WRITTEN ENTIRELY IN FORMAL VIETNAMESE.
- THE VERDICT MUST BE EXACTLY ONE SENTENCE.
- THE VERDICT MUST START WITH: "KẾT LUẬN: "
- NO ENGLISH WORDS OR PHRASES ARE ALLOWED IN THE VERDICT.
- USE LANGUAGE FAMILIAR TO VIETNAMESE PEOPLE AGED 40 AND ABOVE.

Content to analyze:

{content_to_analyze}
"""

    config = types.GenerateContentConfig(
        thinking_config=types.ThinkingConfig(
            thinking_budget=4096
        ),
        tools=[
            types.Tool(
                google_search=types.GoogleSearch()
            )
        ],
    )

    # Accumulate stream chunks into a string to send back to the web UI
    full_response = ""
    for chunk in client.models.generate_content_stream(
        model=model,
        contents=prompt,
        config=config,
    ):
        if chunk.text:
            full_response += chunk.text

    return full_response


@app.route('/api/chat', methods=['POST'])
def chat():
    try:
        data = request.json
        user_prompt = data.get('prompt', '')

        if not user_prompt:
            return jsonify({'error': 'No content provided for analysis'}), 400

        # Run your teammate's custom analysis logic
        analysis_result = analyze_content(user_prompt)

        # Return the markdown analysis back to JavaScript
        return jsonify({'response': analysis_result})

    except Exception as e:
        return jsonify({'error': str(e)}), 500


if __name__ == '__main__':
    # Binds to the port provided by hosting environments or defaults to local port 5000
    port = int(os.environ.get("PORT", 5000))
    app.run(host='0.0.0.0', port=port, debug=True)
