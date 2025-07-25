# Job Tracker Application

A modern web application built with React, TypeScript, and Supabase to help users manage their job search journey. Users can track job applications, manage related tasks, and view insightful analytics to optimize their job search strategy.

## Screenshot Preview

<p align="center"> <strong> Job Tracker Application </strong></p>

![Job Tracker Dashboard Preview](./public/image.png)


| Tracking Jobs | Manage Tasks|
|:-------------------------:|:-------------------:|
| ![Job Tracking](./public/image2.png) | ![Task Management](./public/image1.png) |


## Mobile View

<p align="center"> <strong> Mobile Experience </strong></p>

![Job Tracker Mobile View](./public/image3.png)

## Features

- **Authentication**
  - Sign up, log in, and log out functionality using Supabase Auth
  - Google and Facebook OAuth for quick sign-in/sign-up
  - Protected routes to ensure only authenticated users can access their data

- **Job Application Management**
  - Create, read, update, and delete job applications
  - Track essential job information (company, role, date applied, location, link, status)
  - Sort and filter job applications

- **Task Management**
  - Create and manage job search-related tasks with due dates
  - Track task status (pending, completed)
  - Filter tasks by status, due date, and more
  - Get alerts for overdue tasks

- **Analytics Dashboard**
  - Visual representation of application status distribution
  - Job search insights and trends
  - Response rate tracking
  - Average response time metrics

- **Data Export**
  - Export job application data in multiple formats (JSON, CSV, XML, PDF)
  - Filter exports by date range, status, company, and more
  - Include notes and tasks in exports
  - Schedule automated exports (daily, weekly, or monthly)
  - Instantly download data or receive scheduled exports

- **Modern UI**
  - Sleek, responsive interface built with Tailwind CSS and shadcn/ui components
  - Enhanced with smooth animations and interactive elements using Framer Motion
  - Dark/light theme toggle
  - Modal forms and popovers for interactive content
  - Status indicators with color coding
  - Beautiful and accessible UI components
  
- **Privacy, Terms, and Support**
  - Detailed Privacy Policy page with comprehensive information on data handling and user rights
  - Terms of Service page outlining user responsibilities and application usage policies
  - Contact page with form submission functionality for user inquiries and support
  - FAQ section addressing common questions about the application
  - Clear information about the application's free usage with no subscription plans

## Tech Stack

- **Frontend**: React + TypeScript
- **Backend/Auth**: Supabase (Auth and Postgres database)
- **Styling**: Tailwind CSS + shadcn/ui (built on Radix UI)
- **Animation**: Framer Motion
- **Additional Libraries**: React Router DOM, React Hook Form, Lucide React (icons)

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
3. Create a `.env` file in the root directory with your Supabase credentials (use the values provided to you by your team and never commit this file to version control):
   ```
   REACT_APP_SUPABASE_URL=your_supabase_url
   REACT_APP_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

### Supabase Setup

1. Create a new Supabase project
2. Enable Email authentication in the Authentication settings.
3. Enable Google and Facebook (or other desired) OAuth providers in the Authentication > Providers section. You will need to configure the Client ID and Client Secret for each provider, which you can obtain from the respective developer consoles (Google Cloud Console, Facebook for Developers).
4. Open the SQL editor in your Supabase dashboard
5. Copy and paste the entire contents of the `migration.sql` file in this project into the SQL editor
6. Run the SQL script to create all necessary tables, indexes, triggers, and RLS policies
7. All database tables will be created with proper Row Level Security (RLS) policies to ensure users can only access their own data

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

## License

This project is licensed under the terms outlined in the [License](LICENSE.md).