# StashIt - Inventory Management System

### Overview

StashIt is a comprehensive **inventory management system** designed as part of a software engineering project. It provides seamless tools for managing products, locations, and brands, making it easier for organizations to maintain stock and track inventory. The project emphasizes scalability, clean architecture, and role-based access, demonstrating best practices in modern web development.

---

## Features

- **Inventory Management**: Add, update, delete, and view products, brands, and locations.
- **Role-Based Access Control**: Access restricted functionalities based on user roles.
- **User Authentication**: Secure login and password reset workflows.
- **Responsive Dashboard**: Intuitive and responsive user interface for effective management.
- **Data Persistence**: Real-time updates with MongoDB as the database.

---

## Installation and Setup

### Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v16 or higher)
- **npm** or **yarn**
- **MongoDB** (local or remote)

---

### Backend Setup

1. **Clone the Repository**

```bash
git clone https://github.com/Gamin8ing/StashIt.git
cd stashit
```

2. **Navigate to the Backend Directory**

   ```bash
   cd Backend
   npm i
   ```

3. **Install Backend Dependencies**

   Make sure proxy is configured for npm, if on proxy.

   ```bash
   npm install
   ```

4. **Set Up Environment Variables**  
   Create a `.env` file in the `server` directory and add the following variables:

   ```env
   MONGODB_URI=you_mongodb_uri
   PORT=5000
   MONGO_URI=your_mongodb_connection_string
   USER_EMAIL=your_email@example.com
   USER_PASS=your_email_password
   ```

5. **Connect your google appID**
   the `USER_EMAIL` and `USER_PASS` is the application ID to user google mail service, create your now and enter it.

6. **Start the Backend Server**
   ```bash
   npm run dev
   ```
   The server will run on `http://localhost:5000`.

---

### Frontend Setup

1. **Navigate to the Frontend Directory**

   ```bash
   cd ../Frontend
   ```

2. **Install Frontend Dependencies**

   ```bash
   npm install
   ```

3. **Set Up Environment Variables**  
    Create a `.env` file in the `client` directory and add the following:

   ```env
   VITE_SERVER=http://localhost:3000
   VITE_MODE=PROD
   VITE_LOCAL=http://localhost:3000
   ```

4. **Start the Frontend**
   ```bash
   npm run dev
   ```
   The app will run on `http://localhost:3000`.

---

### Database Setup

1. **Start MongoDB**  
   Ensure MongoDB is running on your local machine or connect to a remote MongoDB cluster.

2. **Connecting to backend**
   Now enter the mongodb uri in `.env` of backend

---

## Usage

- Navigate to `http://localhost:3000` in your browser.
- Register or log in to access the dashboard.
- Manage products, brands, and locations with CRUD operations.
- Use the admin account for role-based access to advanced features.

---

## Tech Stack

- **Frontend**: React.js, Vite, Tailwind CSS
- **Backend**: Node.js, Express
- **Database**: MongoDB (Mongoose)
- **Others**: bcrypt for secure password handling, Nodemailer for email workflows

---

## Future Enhancements

- Integration with third-party APIs for analytics.
- Advanced search and filter functionalities.

---

Enjoy using **StashIt**! 🎉
