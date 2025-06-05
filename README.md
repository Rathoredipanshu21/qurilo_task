"# qurilo_task" 
# React Course Management System

This is a single-page React application designed to demonstrate a course management system where an administrator can manage courses and lessons, and users can enroll in and learn from these courses. Data is stored in the browser's `localStorage` to simulate a backend, making it a fully client-side application.

## 🚀 Features

### Admin Dashboard
The admin panel provides comprehensive control over courses and lessons.

* **Course Management:**
    * **Add New Courses:** Administrators can add new courses by providing a title, description, thumbnail image URL, and initial status (draft or published). [cite: 1, 6, 7]
    * **Edit Courses:** Existing courses can be edited to update their title, description, thumbnail, or status. [cite: 1, 8, 9]
    * **Delete Courses:** Administrators have the ability to delete courses, which also removes all associated lessons. [cite: 1, 10]
* **Lesson Management:**
    * **Add Lessons:** For each course, administrators can add new lessons, including a title, a video URL (e.g., YouTube link), and accompanying content/notes. [cite: 1, 12, 13]
    * **Edit Lessons:** Existing lessons can be modified to update their details. [cite: 1, 14, 15]
    * **Delete Lessons:** Lessons can be removed from a course. [cite: 1, 14]
* **Enrolled Users Overview:**
    * The admin dashboard displays a list of all users who have logged into the system, showing their username, full name, role, and last login timestamp. This table is responsive for various screen sizes, including phone screens.

### User Dashboard
The user dashboard allows learners to explore and interact with published courses.

* **Course Browse:**
    * Users can view all published courses available in the system.
    * A search bar allows users to filter courses by title.
* **Lesson Viewing:**
    * Clicking on a course opens a modal displaying all its lessons.
    * Users can watch lessons directly via the provided video URLs (e.g., YouTube links).
* **Lesson Completion Tracking:**
    * Users can mark individual lessons as "completed" using a checkbox, and the completion status is saved.
* **New Course Notifications:**
    * Users are notified when new courses are added to the system since their last visit.

## ⚙️ Technologies Used

The project is built using modern web technologies:

* **ReactJS:** The core JavaScript library for building user interfaces. [cite: 16]
* **localStorage:** Used for client-side data storage, simulating a backend database. [cite: 2, 3, 4, 16]
* **AOS (Animate On Scroll):** For smooth scroll animations, enhancing the user experience. [cite: 16]
* **Bootstrap:** Provides responsive design and pre-built UI components. [cite: 16]
* **Custom CSS:** For specific styling and UI refinements. [cite: 16]
* **Font Awesome:** For scalable vector icons. [cite: 16]

## 💾 Data Storage

All course, lesson, and user data is stored directly in the browser's `localStorage` as JSON strings. Changes made (adding, editing, deleting) are immediately saved back to `localStorage` using JavaScript's `localStorage` API. [cite: 2, 3, 4]

## 🔑 Login System

The login functionality is mocked for demonstration purposes. When a user enters credentials, the application validates them against a hardcoded user (e.g., `admin`/`admin` for admin access, `user`/`user` for user access) or a mock authentication logic, granting access to the respective dashboard. [cite: 5]

## 📦 Deployment

The application can be built for deployment using `npm run build`. The compiled HTML, CSS, and JavaScript files from the `build/` folder can then be deployed to platforms like Netlify Drop. [cite: 17]

## 🚧 Limitations

This system is designed primarily for demonstration. Due to its reliance on `localStorage` for data persistence:

* Data will reset if the browser's `localStorage` is cleared. [cite: 18]
* Data is specific to the device and browser being used and will not be accessible from other devices. [cite: 18]

For real-world applications requiring persistent data and robust authentication, a proper backend with a database and secure authentication mechanisms should be integrated. [cite: 19]

## 🚀 Getting Started

To run this project locally, follow these steps:

1.  **Clone the repository:**
    ```bash
    git clone <your-repository-url>
    cd react-course-management-system
    ```
2.  **Install dependencies:**
    ```bash
    npm install
    ```
3.  **Ensure Font Awesome CDN:**
    Add the following line to the `<head>` section of your `public/index.html` file to include Font Awesome icons:
    ```html
    <link rel="stylesheet" href="[https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css](https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css)" integrity="sha512-Fo3rlrZj/k7ujTnHg4CGR2D7kSs0x0ug1PyzGvGqS1n4z1z/4S/k1S5TfQ8Y+1z4g1/Q0/J5t5+5+7O5r7+7g==" crossorigin="anonymous" referrerpolicy="no-referrer" />
    ```
4.  **Start the development server:**
    ```bash
    npm start
    ```
    The application will open in your browser, usually at `http://localhost:3000`.

### Demo Credentials:

* **Admin:** `username: admin`, `password: admin`
* **User:** `username: user`, `password: user`
