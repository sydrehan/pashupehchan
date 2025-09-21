# File Path: backend/app.py (Vercel Ready, DB Disabled)

# Step 1: Import all necessary libraries
import os
import uuid
import datetime
from flask import Flask, request, jsonify, send_from_directory
# from flask_sqlalchemy import SQLAlchemy   # ❌ DB disabled
from flask_cors import CORS
from dotenv import load_dotenv
import google.generativeai as genai

# Step 2: Initial Application and CORS Setup
load_dotenv()
app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "*"}})

# Secret password for BPA integration
BPA_API_KEY = "PASHUPEHCHAN_BPA_SECRET_123XYZ"

# Step 3: Vercel-compatible Upload Folder Setup
UPLOAD_FOLDER = '/tmp/uploads'  # CRITICAL: Use /tmp for Vercel
if not os.path.exists(UPLOAD_FOLDER):
    os.makedirs(UPLOAD_FOLDER)
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

# Step 4: Configure Google Gemini API
try:
    genai.configure(api_key=os.getenv("GEMINI_API_KEY"))
    model = genai.GenerativeModel("gemini-1.5-flash")
except Exception as e:
    print(f"CRITICAL ERROR: Failed to configure Gemini API. Error: {e}")
    model = None

# Step 5: Database Models ❌ Disabled
"""
class User(db.Model):
    id = db.Column(db.String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    name = db.Column(db.String(80), nullable=False)
    phone = db.Column(db.String(20), nullable=False)
    state = db.Column(db.String(50), nullable=False)
    district = db.Column(db.String(50), nullable=False)
    pincode = db.Column(db.String(10), nullable=False)
    gender = db.Column(db.String(10), nullable=False, default='other')

class History(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.String(36), db.ForeignKey('user.id'), nullable=False)
    animal_name = db.Column(db.String(100), nullable=False)
    breed_result = db.Column(db.Text, nullable=False)
    front_image = db.Column(db.String(200), nullable=False)
    back_image = db.Column(db.String(200), nullable=False)
    left_image = db.Column(db.String(200), nullable=False)
    right_image = db.Column(db.String(200), nullable=False)
    timestamp = db.Column(db.DateTime, default=datetime.datetime.utcnow)
    is_saved = db.Column(db.Boolean, default=False, nullable=False)
    latitude = db.Column(db.Float, nullable=True)
    longitude = db.Column(db.Float, nullable=True)
"""

# --- Step 6: API Endpoints ---

# User registration (DB disabled)
@app.route("/register", methods=["POST"])
def register_user():
    data = request.json
    required_fields = ['name', 'phone', 'state', 'district', 'pincode', 'gender']
    if not all(k in data for k in required_fields):
        return jsonify({"error": "Missing fields"}), 400
    if not data['name'].strip():
        return jsonify({"error": "Name cannot be empty"}), 400
    if not data['phone'].isdigit() or len(data['phone']) < 10:
        return jsonify({"error": "Invalid phone"}), 400
    if not data['pincode'].isdigit() or len(data['pincode']) != 6:
        return jsonify({"error": "Invalid pincode"}), 400

    new_user_id = str(uuid.uuid4())
    return jsonify({
        "id": new_user_id,
        "name": data['name'],
        "gender": data['gender'],
        "message": "User registered! (DB Disabled)"
    }), 201

# Breed identification (DB disabled)
@app.route("/identify", methods=["POST"])
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
    if 'latitude' not in request.form or not all(k in request.files for k in ['front', 'back', 'left', 'right']):
        return jsonify({"error": "Location and all four images are required."}), 400

    latitude = request.form.get('latitude')
    longitude = request.form.get('longitude')

    image_parts, saved_paths = [], {}
    for side in ['front', 'back', 'left', 'right']:
        file = request.files[side]
        filename = f"{uuid.uuid4()}_{file.filename}"
        filepath = os.path.join(app.config['UPLOAD_FOLDER'], filename)
        file.save(filepath)
        with open(filepath, "rb") as f:
            image_bytes = f.read()
        image_parts.append({'mime_type': file.mimetype, 'data': image_bytes})
        saved_paths[side] = filename

    try:
        response = model.generate_content([prompt] + image_parts)
        cleaned_text = response.text.replace('**', '').replace('##', '').strip()
        if cleaned_text.strip().startswith("Error:"):
            return jsonify({"error": cleaned_text.replace("Error: ", "")}), 400

        return jsonify({
            "result": cleaned_text,
            "record_id": str(uuid.uuid4()),  # fake ID since DB disabled
            "message": "AI analysis done (DB Disabled)"
        })
    except Exception as e:
        return jsonify({"error": f"AI analysis failed. Error: {str(e)}"}), 500

# Mock history routes (DB disabled)
@app.route("/history/<user_id>", methods=["GET"])
def get_history(user_id):
    return jsonify([{
        "id": "demo123",
        "animal_name": "Demo Cow",
        "is_saved": False,
        "breed_result": "Accuracy: 95%\nAnimal Name: Demo Cow\nBreed: Sahiwal\n...",
        "timestamp": datetime.datetime.utcnow().isoformat(),
        "latitude": 26.85,
        "longitude": 75.80,
        "images": {
            "front": "/uploads/demo_front.jpg",
            "back": "/uploads/demo_back.jpg",
            "left": "/uploads/demo_left.jpg",
            "right": "/uploads/demo_right.jpg"
        }
    }])

@app.route("/history/saved/<user_id>", methods=["GET"])
def get_saved_history(user_id):
    return jsonify([])

@app.route("/history/toggle_save/<record_id>", methods=["POST"])
def toggle_save_record(record_id):
    return jsonify({"message": "Save status updated (DB Disabled)", "new_status": True}), 200

@app.route("/translate", methods=["POST"])
def translate_text():
    data = request.json
    original_text = data.get('text')
    target_language = data.get('target_language')
    if not original_text or not target_language:
        return jsonify({"error": "Text and target language are required."}), 400
    prompt = f"Translate the following text into {target_language}. Maintain the original 'Key: Value' format. Text:\n\n{original_text}"
    try:
        response = model.generate_content(prompt)
        cleaned_text = response.text.replace('**', '')
        return jsonify({"translated_text": cleaned_text})
    except Exception as e:
        return jsonify({"error": f"Translation failed. Error: {str(e)}"}), 500

@app.route("/history/delete/<record_id>", methods=["DELETE"])
def delete_history_record(record_id):
    return jsonify({"message": "Record deleted successfully (DB Disabled)"}), 200

# Serve uploaded images
@app.route('/uploads/<filename>')
def uploaded_file(filename):
    return send_from_directory(app.config['UPLOAD_FOLDER'], filename)

# Initialize DB ❌ Disabled
"""
with app.app_context():
    db.create_all()
"""

# Run Flask app
if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)
