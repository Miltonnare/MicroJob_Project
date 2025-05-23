from flask import Flask, request, jsonify
from flask_cors import CORS
import pandas as pd
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
from transformers import pipeline
from twilio.twiml.messaging_response import MessagingResponse
import re

app = Flask(__name__)
CORS(app)  

# Initialize Hugging Face sentiment analysis
sentiment = pipeline('sentiment-analysis')

# Load CSVs (mock data if empty)
def load_csv(file, default_data=None):
    try:
        return pd.read_csv(file)
    except FileNotFoundError:
        if default_data:
            df = pd.DataFrame(default_data)
            df.to_csv(file, index=False)
            return df
        return pd.DataFrame()

# Mock CSVs
users = load_csv('users.csv', [{'name': 'Mary', 'skills': 'farming', 'location': 'Kisumu', 'jobsApplied': 2, 'coursesCompleted': 1}])
jobs = load_csv('jobs.csv', [
    {'Title': 'Farm Worker', 'Pay': 'KSh 500', 'Location': 'Kisumu', 'Skills': 'farming', 'Duration': '1 day'},
    {'Title': 'Cleaner', 'Pay': 'KSh 300', 'Location': 'Nairobi', 'Skills': 'cleaning', 'Duration': '4 hours'},
    {'Title': 'Maize Harvest', 'Pay': 'KSh 500', 'Location': 'Kisumu', 'Skills': 'farming', 'Duration': '2 days'},
])
courses = load_csv('courses.csv', [{'Title': 'Organic Farming'}, {'Title': 'Digital Literacy'}, {'Title': 'Basic Cleaning'}])
feedback = load_csv('feedback.csv', [{'name': 'Mary', 'Text': 'Great worker'}, {'name': 'Mary', 'Text': 'Reliable'}])

# User Tracking Routes
@app.route('/signup', methods=['POST'])
def signup():
    data = request.json
    global users
    new_user = {
        'name': data.get('name', 'Guest'),
        'skills': data.get('skills', ''),
        'location': data.get('location', ''),
        'jobsApplied': 0,
        'coursesCompleted': 0
    }
    users = pd.concat([users, pd.DataFrame([new_user])], ignore_index=True)
    users.to_csv('users.csv', index=False)
    return jsonify({'message': 'User created', 'user': new_user})

@app.route('/user', methods=['GET'])
def get_user():
    # Mock: Return first user or query by name (future)
    if not users.empty:
        return jsonify(users.iloc[0].to_dict())
    return jsonify({'name': 'Guest', 'skills': 'farming', 'location': 'Kisumu', 'jobsApplied': 0, 'coursesCompleted': 0})

@app.route('/update_profile', methods=['POST'])
def update_profile():
    data = request.json
    global users
    # Mock: Update first user
    if not users.empty:
        users.iloc[0] = {
            'name': data.get('name', users.iloc[0]['name']),
            'skills': data.get('skills', users.iloc[0]['skills']),
            'location': data.get('location', users.iloc[0]['location']),
            'jobsApplied': users.iloc[0].get('jobsApplied', 0),
            'coursesCompleted': users.iloc[0].get('coursesCompleted', 0)
        }
        users.to_csv('users.csv', index=False)
        return jsonify({'message': 'Profile updated', 'user': users.iloc[0].to_dict()})
    return jsonify({'error': 'No user found'}), 404

# Job Matching
@app.route('/match_jobs', methods=['POST'])
def match_jobs():
    user_skills = request.json.get('skills', '')
    if not user_skills:
        return jsonify({'jobs': []})
    vectorizer = TfidfVectorizer()
    vectors = vectorizer.fit_transform([user_skills] + jobs['Skills'].tolist())
    similarities = cosine_similarity(vectors[0:1], vectors[1:]).flatten()
    top_indices = similarities.argsort()[-4:][::-1]  # Top 4 jobs
    matched_jobs = jobs.iloc[top_indices][['Title', 'Pay', 'Location', 'Skills', 'Duration']].to_dict('records')
    return jsonify({'jobs': matched_jobs})

# Course Recommendations
@app.route('/courses', methods=['POST'])
def recommend_courses():
    user_skills = request.json.get('skills', '').lower()
    if not user_skills:
        return jsonify({'courses': []})
    matched_courses = [c['Title'] for c in courses.to_dict('records') if user_skills in c['Title'].lower()]
    return jsonify({'courses': matched_courses[:3]})  # Top 3 courses

# Reputation Scoring
@app.route('/reputation', methods=['GET'])
def get_reputation():
    # Mock: Score for first user
    user_feedback = feedback[feedback['name'] == users.iloc[0]['name']]['Text'].tolist()
    if not user_feedback:
        return jsonify({'score': 0})
    scores = [sentiment(f)[0]['score'] for f in user_feedback]
    avg_score = sum(scores) / len(scores) * 5  # Scale to 0-5
    return jsonify({'score': avg_score})

# Job Posting
@app.route('/post_job', methods=['POST'])
def post_job():
    data = request.json
    global jobs
    new_job = {
        'Title': data.get('title', 'Untitled Job'),
        'Pay': data.get('pay', 'KSh 0'),
        'Location': data.get('location', ''),
        'Skills': data.get('skills', ''),
        'Duration': data.get('duration', '')
    }
    jobs = pd.concat([jobs, pd.DataFrame([new_job])], ignore_index=True)
    jobs.to_csv('jobs.csv', index=False)
    return jsonify({'message': 'Job posted', 'job': new_job})

# Twilio SMS
@app.route('/sms', methods=['POST'])
def sms():
    user_input = request.form.get('Body', '').lower()
    # Parse SMS (e.g., "jobs farming Kisumu")
    match = re.match(r'jobs\s+(\w+)\s+(\w+)', user_input)
    if match:
        skills, location = match.groups()
        vectorizer = TfidfVectorizer()
        vectors = vectorizer.fit_transform([skills] + jobs['Skills'].tolist())
        similarities = cosine_similarity(vectors[0:1], vectors[1:]).flatten()
        top_job = jobs.iloc[similarities.argmax()]
        response = f"Job: {top_job['Title']}, {top_job['Pay']}, {top_job['Location']}. Reply 'apply 1'."
    else:
        response = "Text 'jobs [skill] [location]' to find jobs."
    return str(MessagingResponse().message(response))

# Apply Job (Mock for tracking)
@app.route('/apply_job', methods=['POST'])
def apply_job():
    data = request.json
    global users
    if not users.empty:
        users.iloc[0]['jobsApplied'] = users.iloc[0].get('jobsApplied', 0) + 1
        users.to_csv('users.csv', index=False)
        return jsonify({'message': 'Job applied', 'jobsApplied': users.iloc[0]['jobsApplied']})
    return jsonify({'error': 'No user found'}), 404

# Enroll Course (Mock for tracking)
@app.route('/enroll_course', methods=['POST'])
def enroll_course():
    data = request.json
    global users
    if not users.empty:
        users.iloc[0]['coursesCompleted'] = users.iloc[0].get('coursesCompleted', 0) + 1
        users.to_csv('users.csv', index=False)
        return jsonify({'message': 'Course enrolled', 'coursesCompleted': users.iloc[0]['coursesCompleted']})
    return jsonify({'error': 'No user found'}), 404

if __name__ == '__main__':
    app.run(debug=True)