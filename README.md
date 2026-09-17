# Employee Management System

A simple CRUD-based Employee Management System built using Django, SQLite, HTML, CSS and JavaScript.

## Features
- Add employee
- View employees
- Edit employee
- Delete employee
- Search employees
- Client-side and server-side validation
- SQLite database
- Django REST-style JSON API endpoints

## Setup

1. Install Python 3.10+.
2. Open a terminal inside this project folder.
3. Create a virtual environment:
   `python -m venv venv`
4. Activate it on Windows:
   `venv\Scripts\activate`
5. Install dependencies:
   `pip install -r requirements.txt`
6. Create the database:
   `python manage.py makemigrations`
   `python manage.py migrate`
7. Start the server:
   `python manage.py runserver`
8. Open:
   http://127.0.0.1:8000/

## API Endpoints

GET    /api/employees/
POST   /api/employees/
GET    /api/employees/<id>/
PUT    /api/employees/<id>/
DELETE /api/employees/<id>/

## Main Technologies
Frontend: HTML, CSS, JavaScript
Backend: Django
Database: SQLite
