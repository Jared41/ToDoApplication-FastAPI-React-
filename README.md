# fs-take-home-test

Fullstack CRUD application with FastAPI, React, and PostgreSQL.

## Features

- **Backend**: FastAPI with SQLAlchemy ORM
- **Frontend**: React application
- **Database**: PostgreSQL
- **Containerization**: Docker Compose

## User Management

A user has the following attributes:
- firstname
- lastname
- age
- date of birth

## API Endpoints

- `GET /users` - Returns a list of all users
- `POST /users/create` - Creates a user record in the database
- `DELETE /user` - Deletes a user from the database

## Quick Start

1. Clone the repository
2. Run the application:
   ```bash
   docker compose up -d
   ```
3. Access the application:
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:8000
   - API Documentation: http://localhost:8000/docs

## Usage

Once the application is running, you can:
- Add a user through the web interface
- View a list of all users
- Delete users from the list

## Architecture

- **Frontend**: React app running on port 3000
- **Backend**: FastAPI server running on port 8000
- **Database**: PostgreSQL running on port 5432
