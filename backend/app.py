from flask import Flask, request, jsonify
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
from models import db, User, PasswordEntry
from config import Config
from cryptography.fernet import Fernet
from flask_jwt_extended import JWTManager, create_access_token, jwt_required, get_jwt_identity, unset_jwt_cookies
import os
import random
import string
import re

app = Flask(__name__)
app.config.from_object(Config)
CORS(app, supports_credentials=True)

db.init_app(app)

# Load key from environment variable or file
key = os.environ.get('ENCRYPTION_KEY', Fernet.generate_key().decode())
fernet = Fernet(key.encode())

jwt = JWTManager(app)

@app.route('/register', methods=['POST'])
def register():
    data = request.get_json()
    print("Received data for registration:", data)  # Debugging line
    if not data:
        return jsonify({'message': 'No input data provided'}), 400
    if 'username' not in data or 'password' not in data:
        return jsonify({'message': 'Username and password are required'}), 400
    
    if not re.match("^[A-Za-z0-9]+$", data['username']):
        return jsonify({'message': 'Username cannot contain special characters'}), 400

    hashed_password = fernet.encrypt(data['password'].encode()).decode()
    new_user = User(username=data['username'], password=hashed_password)
    db.session.add(new_user)
    db.session.commit()
    return jsonify({'message': 'User registered successfully'}), 201

@app.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    user = User.query.filter_by(username=data['username']).first()
    if user and fernet.decrypt(user.password.encode()).decode() == data['password']:
        access_token = create_access_token(identity={'username': user.username})
        return jsonify(access_token=access_token), 200
    return jsonify({'message': 'Invalid credentials'}), 401

@app.route('/logout', methods=['POST'])
def logout():
    response = jsonify({"msg": "logout successful"})
    unset_jwt_cookies(response)
    return response, 200

@app.route('/passwords', methods=['POST'])
@jwt_required()
def add_password():
    data = request.get_json()
    if 'site' not in data or 'email' not in data or 'password' not in data:
        return jsonify({'message': 'Site, email, and password are required'}), 400

    current_user = get_jwt_identity()
    user = User.query.filter_by(username=current_user['username']).first()
    entry = PasswordEntry(site=data['site'], email=data['email'], user_id=user.id)
    entry.set_password(data['password'], fernet)
    db.session.add(entry)
    db.session.commit()
    return jsonify({'message': 'Password added successfully'}), 201

@app.route('/passwords', methods=['GET'])
@jwt_required()
def get_passwords():
    current_user = get_jwt_identity()
    user = User.query.filter_by(username=current_user['username']).first()
    passwords = PasswordEntry.query.filter_by(user_id=user.id).all()
    return jsonify([{'id': p.id, 'site': p.site, 'email': p.email, 'password': fernet.decrypt(p.password).decode()} for p in passwords]), 200

@app.route('/passwords/<int:id>', methods=['GET'])
@jwt_required()
def get_password(id):
    current_user = get_jwt_identity()
    user = User.query.filter_by(username=current_user['username']).first()
    entry = PasswordEntry.query.filter_by(id=id, user_id=user.id).first_or_404()
    decrypted_password = entry.get_password(fernet)
    return jsonify({'site': entry.site, 'email': entry.email, 'password': decrypted_password}), 200

@app.route('/generate-password', methods=['GET'])
def generate_password():
    length = request.args.get('length', default=12, type=int)
    characters = string.ascii_letters + string.digits + string.punctuation
    password = ''.join(random.choice(characters) for _ in range(length))
    return jsonify({'password': password}), 200

if __name__ == '__main__':
    app.run(debug=True)
