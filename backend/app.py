# File Path: backend/app.py (FINAL VERIFIED VERSION FOR VERCEL)

import os
import uuid
from flask import Flask, request, jsonify
from flask_cors import CORS
from dotenv import load_dotenv
import google.generativeai as genai

# --- Step 1: Initial Setup ---
load_dotenv()
app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "*"}})

# --- Step 2: Configure Gemini API ---
try:
    genai.configure(api_key=os.getenv("GEMINI_API_KEY"))
    model = genai.GenerativeModel("gemini-1.5-flash")
except Exception as e:
    print(f"CRITICAL ERROR: Failed to configure Gemini API. Error: {e}")
    model = None

# --- Step 3: API Endpoint ---
@app.route("/api/identify", methods=["POST"])
def identify_breed():
    prompt = """
    ROLE: You are an expert Livestock Breed Identifier.
    TASK: Analyze the following four images of a single animal. Synthesize all information to provide ONE consolidated and final report.
    1.  Consistency Check: Verify all four images show the same animal. If not, respond ONLY with: "Error: Inconsistent images."
    2.  Clarity Check: If images are too blurry or unclear for a confident identification (over 70%), respond ONLY with: "Error: Breed cannot be determined. Please upload clearer photos."
    3.  Final Report: If the images are good, provide a single, final report in this exact 'Key: Value' format. Do NOT use markdown. The order of keys is important.
        Accuracy: [Your percentage confidence, e.g., 96%]
        Animal Name: [e.g., Adult Sahiwal Cow]
        Breed: [The single most likely breed name]
        Breed Gender: [Your best guess: Male, Female, or Calf]
        Region of Origin: [e.g., Punjab, India]
        Milk Production: [Average lactation yield. If Male, state 'Not Applicable']
        Main Identity: [3 key visual points]
        Market Value: [Estimated value in INR]
    """
    if not model: 
        return jsonify({"error": "AI model not configured"}), 500
    if not all(k in request.files for k in ['front', 'back', 'left', 'right']):
        return jsonify({"error": "All four images are required."}), 400
    
    image_parts = []
    # This loop reads the images directly into memory without saving them to a file
    for side in ['front', 'back', 'left', 'right']:
        file = request.files[side]
        image_bytes = file.read()
        image_parts.append({'mime_type': file.mimetype, 'data': image_bytes})
            
    try:
        response = model.generate_content([prompt] + image_parts)
        cleaned_text = response.text.replace('**', '').replace('##', '').strip()
        
        if cleaned_text.strip().startswith("Error:"): 
            return jsonify({"error": cleaned_text.replace("Error: ", "")}), 400

        # Return the AI result directly
        return jsonify({
            "result": cleaned_text, 
            "record_id": str(uuid.uuid4()) # A temporary ID for the prototype
        })
    except Exception as e: 
        return jsonify({"error": f"AI analysis failed. Error: {str(e)}"}), 500

# This is a health check endpoint to make sure the server is running
@app.route("/api/health", methods=["GET"])
def health_check():
    return jsonify({"status": "ok"}), 200