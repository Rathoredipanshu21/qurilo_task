import React, { useState, useEffect, useMemo, useCallback } from 'react';
import AOS from 'aos';
import 'aos/dist/aos.css';
import 'bootstrap/dist/css/bootstrap.min.css';

// Helper function to extract YouTube video ID and construct thumbnail URL
const getYoutubeThumbnailUrl = (url) => {
  if (!url) return null;

  let videoId = '';
  const youtubeRegex = /(?:https?:\/\/)?(?:www\.)?(?:m\.)?(?:youtube\.com|youtu\.be)\/(?:watch\?v=|embed\/|v\/|)([\w-]{11})(?:\S+)?/;
  const match = url.match(youtubeRegex);

  if (match && match[1]) {
    videoId = match[1];
  }

  if (videoId) {
    return `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
  }
  return null;
};

function UserDashboard() {
  const [courses, setCourses] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCourse, setSelectedCourse] = useState(null); // Course whose lessons are being viewed
  const [completedLessons, setCompletedLessons] = useState({}); // Stores { courseId: [lessonId1, lessonId2], ... }

  useEffect(() => {
    AOS.init({
      duration: 1000,
      once: true,
      mirror: false,
    });

    // Load courses from localStorage
    const savedCourses = JSON.parse(localStorage.getItem('courses')) || [];
    // Ensure all loaded courses have a 'lessons' array for consistency
    const initializedCourses = savedCourses.map(course => ({
      ...course,
      lessons: course.lessons || []
    }));
    setCourses(initializedCourses);

    // Load completed lessons from localStorage
    const savedCompletedLessons = JSON.parse(localStorage.getItem('completedLessons')) || {};
    setCompletedLessons(savedCompletedLessons);
  }, []);

  // Update completed lessons in localStorage
  const updateCompletedLessons = useCallback((newCompletedLessons) => {
    setCompletedLessons(newCompletedLessons);
    localStorage.setItem('completedLessons', JSON.stringify(newCompletedLessons));
  }, []);

  // Filter courses based on search term and status
  const filteredCourses = useMemo(() => {
    return courses.filter(course =>
      course.status === 'published' &&
      course.title.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [courses, searchTerm]);

  // Handle marking a lesson as done/undone
  const handleToggleLessonComplete = (courseId, lessonId) => {
    setCompletedLessons(prevCompleted => {
      const courseCompletedLessons = new Set(prevCompleted[courseId] || []);
      if (courseCompletedLessons.has(lessonId)) {
        courseCompletedLessons.delete(lessonId); // Mark as undone
      } else {
        courseCompletedLessons.add(lessonId); // Mark as done
      }
      const newCompleted = {
        ...prevCompleted,
        [courseId]: Array.from(courseCompletedLessons)
      };
      updateCompletedLessons(newCompleted); // Save to localStorage
      return newCompleted;
    });
  };

  // Check if a lesson is completed
  const isLessonCompleted = (courseId, lessonId) => {
    return completedLessons[courseId]?.includes(lessonId);
  };

  return (
    <div className="min-vh-100 py-5" style={{ backgroundColor: '#FFF7F9', fontFamily: 'Montserrat, sans-serif' }}>
      <style>
        {`
        @import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@300;400;500;600;700&display=swap');
        .search-input-container {
            position: relative;
        }
        .search-input-container .form-control {
            padding-left: 3rem; /* Space for the icon */
            border-radius: 50px;
            box-shadow: 0 4px 10px rgba(0, 0, 0, 0.08);
            border: none;
        }
        .search-input-container .input-icon {
            position: absolute;
            left: 1rem;
            top: 50%;
            transform: translateY(-50%);
            color: #6c757d;
            font-size: 1.2rem;
            z-index: 2;
        }
        .card {
            transition: transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out;
            border: none;
            cursor: pointer; /* Indicate clickable cards */
        }
        .card:hover {
            transform: translateY(-5px);
            box-shadow: 0 0.8rem 1.5rem rgba(0, 0, 0, 0.1) !important;
        }
        .course-card-img {
            height: 200px;
            object-fit: cover;
            border-top-left-radius: 0.75rem;
            border-top-right-radius: 0.75rem;
        }
        .lesson-thumbnail-preview {
            width: 120px;
            height: 70px;
            object-fit: cover;
            border-radius: 0.5rem;
            box-shadow: 0 2px 5px rgba(0,0,0,0.1);
            margin-right: 15px;
            flex-shrink: 0;
        }
        .lesson-list-item-thumbnail {
            width: 90px;
            height: 55px;
            object-fit: cover;
            border-radius: 0.3rem;
            box-shadow: 0 1px 3px rgba(0,0,0,0.1);
            margin-right: 15px;
            flex-shrink: 0;
        }
        .lesson-completed {
            background-color: #E6F7ED !important; /* Light green */
            border-left: 5px solid #28a745; /* Green border */
        }
        .lesson-checkbox {
            transform: scale(1.3); /* Make checkbox larger */
            cursor: pointer;
        }
        .modal-content {
            border-radius: 1rem !important;
        }
        .modal-header {
            border-bottom: none;
            padding-bottom: 0;
        }
        .modal-body {
            padding-top: 0;
        }
        `}
      </style>
      <div className="container py-5 text-center">
        {/* Header and Search Bar */}
        <div className="row justify-content-center mb-5" data-aos="fade-down">
          <div className="col-12 col-md-8 col-lg-6">
            <h2 className="mb-4 text-dark"><i className="fas fa-book-reader me-2 text-info"></i>Explore Our Courses</h2>
            <div className="search-input-container">
              <i className="fas fa-search input-icon"></i>
              <input
                type="text"
                className="form-control form-control-lg"
                placeholder="Search courses by title..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* Course Cards Display */}
        <div className="row" data-aos="fade-up">
          {filteredCourses.length === 0 ? (
            <div className="col-12 text-center text-muted py-5">
              <i className="fas fa-exclamation-circle fa-3x mb-3"></i>
              <h3>No published courses found matching your search.</h3>
            </div>
          ) : (
            filteredCourses.map((course) => (
              <div key={course.id} className="col-12 col-md-6 col-lg-4 mb-4" data-aos="zoom-in" data-aos-delay="100">
                <div
                  className="card h-100 shadow rounded-4 overflow-hidden"
                  onClick={() => setSelectedCourse(course)}
                >
                  <img
                    src={course.thumbnail}
                    className="card-img-top course-card-img"
                    alt={course.title}
                    onError={(e) => { e.target.onerror = null; e.target.src = 'https://via.placeholder.com/400x200?text=Course+Image'; }}
                  />
                  <div className="card-body text-start d-flex flex-column">
                    <h5 className="card-title text-primary fw-bold mb-2">
                      <i className="fas fa-tag me-2"></i>
                      {course.title}
                    </h5>
                    <p className="card-text text-muted flex-grow-1" style={{ minHeight: '60px' }}>{course.description}</p>
                    <div className="d-flex justify-content-between align-items-center mt-3">
                      <span className="badge bg-success p-2 rounded-pill">
                        <i className="fas fa-check-circle me-1"></i>Published
                      </span>
                      <span className="text-info fw-bold">
                        <i className="fas fa-play-circle me-1"></i>
                        {course.lessons ? course.lessons.length : 0} Lessons
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Lessons Modal */}
        {selectedCourse && (
          <div className="modal d-block bg-dark bg-opacity-50" tabIndex="-1" data-aos="zoom-in">
            <div className="modal-dialog modal-dialog-centered modal-xl">
              <div className="modal-content rounded-4 p-4 shadow-lg">
                <div className="modal-header border-0 pb-0">
                  <h5 className="modal-title text-info fw-bold">
                    <i className="fas fa-list-alt me-2"></i>Lessons for: {selectedCourse.title}
                  </h5>
                  <button type="button" className="btn-close" onClick={() => setSelectedCourse(null)}></button>
                </div>
                <div className="modal-body pt-3">
                  {selectedCourse.lessons && selectedCourse.lessons.length === 0 ? (
                    <div className="text-center text-muted py-5">
                      <i className="fas fa-exclamation-triangle fa-3x mb-3"></i>
                      <h3>No lessons available for this course yet.</h3>
                      <p>Please check back later!</p>
                    </div>
                  ) : (
                    <ul className="list-group rounded-3 shadow-sm">
                      {selectedCourse.lessons && selectedCourse.lessons.map((lesson, index) => (
                        <li
                          className={`list-group-item d-flex flex-column flex-sm-row justify-content-between align-items-sm-center py-3 ${isLessonCompleted(selectedCourse.id, lesson.id) ? 'lesson-completed' : ''}`}
                          key={lesson.id}
                          data-aos="fade-up"
                          data-aos-delay={index * 50}
                        >
                          <div className="d-flex align-items-center text-start flex-grow-1 mb-2 mb-sm-0">
                            <input
                              type="checkbox"
                              className="form-check-input lesson-checkbox me-3"
                              checked={isLessonCompleted(selectedCourse.id, lesson.id)}
                              onChange={() => handleToggleLessonComplete(selectedCourse.id, lesson.id)}
                            />
                            {getYoutubeThumbnailUrl(lesson.videoUrl) && (
                              <img
                                src={getYoutubeThumbnailUrl(lesson.videoUrl)}
                                alt="YouTube Thumbnail"
                                className="lesson-list-item-thumbnail"
                                onError={(e) => { e.target.onerror = null; e.target.src = 'https://via.placeholder.com/90x55?text=No+Thumb'; }}
                              />
                            )}
                            <div className="flex-grow-1">
                              <h6 className="mb-1 text-dark fw-bold">
                                <span className="badge bg-secondary me-2">{index + 1}</span> {lesson.title}
                              </h6>
                              <small className="text-muted d-block text-truncate" style={{maxWidth: '250px'}}>
                                <i className="fas fa-link me-1"></i>{lesson.videoUrl}
                              </small>
                              <small className="text-muted d-block text-truncate" style={{maxWidth: '250px'}}>
                                <i className="fas fa-info-circle me-1"></i>{lesson.content}
                              </small>
                            </div>
                          </div>
                          <a
                            href={lesson.videoUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="btn btn-outline-primary btn-sm rounded-pill px-3 ms-0 ms-sm-3"
                            title="Watch Lesson"
                          >
                            <i className="fas fa-play me-1"></i> Watch
                          </a>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
                <div className="modal-footer border-0 pt-0">
                  <button className="btn btn-secondary rounded-pill px-4" onClick={() => setSelectedCourse(null)}>
                    <i className="fas fa-times-circle me-1"></i> Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default UserDashboard;