# Job Tracker Application

A web application built with React, TypeScript, and Supabase to help users manage their job applications. Users can track job applications with details like company, role, date applied, location, link, and status.

## Features

- **Authentication**
  - Sign up, log in, and log out functionality using Supabase Auth
  - Protected routes to ensure only authenticated users can access their data

- **Job Application Management**
  - Create, read, update, and delete job applications
  - Track essential job information (company, role, date applied, location, link, status)
  - Sort and filter job applications

- **Modern UI**
  - Clean, responsive interface built with Tailwind CSS
  - Modal forms for adding and editing job entries
  - Status indicators with color coding

## Tech Stack

- **Frontend**: React + TypeScript
- **Backend/Auth**: Supabase (Auth and Postgres database)
- **Styling**: Tailwind CSS
- **Additional Libraries**: React Router DOM, React Hook Form, Headless UI

## Setup Instructions

### Prerequisites

- Node.js and npm
- Supabase account with a new project

### Installation

1. Clone the repository
2. Install dependencies:
   ```
   npm install
   ```
3. Create a `.env` file in the root directory with your Supabase credentials:
   ```
   REACT_APP_SUPABASE_URL=your_supabase_url
   REACT_APP_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

### Supabase Setup

1. Create a new Supabase project
2. Enable Email authentication in the Authentication settings
3. Create a new table called `jobs` with the following columns:
   - `id`: uuid (primary key)
   - `user_id`: uuid (foreign key to auth.users)
   - `company`: text
   - `role`: text
   - `date_applied`: date
   - `location`: text
   - `link`: text
   - `status`: text
   - `created_at`: timestamp
4. Set up Row Level Security (RLS) policies to ensure users can only access their own data

### Running the Application

```
npm start
```

The application will be available at http://localhost:3000

## Development

### Available Scripts

- `npm start`: Run the app in development mode
- `npm test`: Launch the test runner
- `npm run build`: Build the app for production