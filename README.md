# EduQuiz - AI-Powered Learning Assessment Platform

![Project Status](https://img.shields.io/badge/status-active-success.svg)
![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Next.js](https://img.shields.io/badge/Next.js-15.0-black)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)

## 📖 Introduction

**EduQuiz** is a comprehensive, smart assessment platform designed to revolutionize how quizzes are generated and taken. Built with **Next.js**, it leverages **Artificial Intelligence** to generate questions dynamically from course materials (such as PDFs), streamlining the workflow for teachers and enhancing the learning experience for students.

This application features a robust role-based system catering to Administrators, Teachers, and Students, ensuring a secure and tailored experience for every user type.

## ✨ Key Features

-   **🤖 AI-Powered Quiz Generation**: Utilize Google's GenAI and LangChain to automatically generate quiz questions from uploaded PDF documents.
-   **👥 Role-Based Access Control (RBAC)**: Distinct dashboards and permissions for:
    -   **Admins**: System oversight and user management.
    -   **Teachers**: Class management, quiz creation, and student performance tracking.
    -   **Students**: Participating in quizzes and viewing progress.
-   **📄 Document Processing**: Seamless integration with PDF parsing to extract content for assessment.
-   **📚 Swagger API Documentation**: Fully documented API endpoints for easy integration and testing.
-   **🔐 Secure Authentication**: Robust user authentication using JSON Web Tokens (JWT) and Bcrypt.
-   **🎨 Modern UI/UX**: Responsive and accessible design built with Tailwind CSS and Radix UI.

## 🛠️ Technology Stack

-   **Frontend**: Next.js (App Router), React, Tailwind CSS, Radix UI
-   **Backend**: Next.js API Routes
-   **Database**: MongoDB (via Mongoose)
-   **AI & ML**: LangChain, Google GenAI
-   **Authentication**: JWT, Bcrypt
-   **Documentation**: Swagger UI
-   **Utilities**: PDF Parse, Zod (Validation), Date-fns

## 📸 Screenshots & Demo

<!-- Add your screenshots or video links here -->

| Dashboard View | Quiz Interface |
|:---:|:---:|
| ![Dashboard](https://via.placeholder.com/600x400?text=Upload+Dashboard+Screenshot) | ![Quiz](https://via.placeholder.com/600x400?text=Upload+Quiz+Screenshot) |

> *Check out our [Demo Video](#) to see the app in action.*

## 🚀 Getting Started

Follow these steps to set up the project locally.

### Prerequisites

-   **Node.js** (v18 or higher)
-   **npm** or **yarn**
-   **MongoDB** connection string

### Installation

1.  **Clone the repository**
    ```bash
    git clone https://github.com/yourusername/eduquiz-v2.git
    cd eduquiz-v2
    ```

2.  **Install dependencies**
    ```bash
    npm install
    ```

3.  **Environment Configuration**
    Create a `.env` file in the root directory based on `.env.example`. Add your configuration:
    ```env
    MONGO_URI=your_mongodb_connection_string
    JWT_SECRET=your_jwt_secret
    GOOGLE_API_KEY=your_google_ai_key
    # Add other necessary variables
    ```

4.  **Run the application**
    ```bash
    npm run dev
    ```

5.  **Access the App**
    Open [http://localhost:3000](http://localhost:3000) in your browser.

    -   **API Documentation**: [http://localhost:3000/api-docs](http://localhost:3000/api-docs)

## 📂 Project Structure

```bash
├── app/                  # Next.js App Router pages and API routes
│   ├── api/              # Backend API endpoints
│   ├── admin/            # Admin dashboard pages
│   ├── student/          # Student dashboard pages
│   └── teacher/          # Teacher dashboard pages
├── components/           # Reusable React components
├── lib/                  # Utility functions (DB connection, AI logic)
├── models/               # Mongoose database models
├── public/               # Static assets
└── ...
```

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1.  Fork the project.
2.  Create your feature branch (`git checkout -b feature/AmazingFeature`).
3.  Commit your changes (`git commit -m 'Add some AmazingFeature'`).
4.  Push to the branch (`git push origin feature/AmazingFeature`).
5.  Open a Pull Request.

## 📜 License

This project is licensed under the **MIT License**.

---

Designed & Developed by **Atullya Maharjan**
