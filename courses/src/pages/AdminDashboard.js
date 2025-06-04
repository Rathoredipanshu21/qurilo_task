import React, { useState, useEffect, useCallback } from 'react';
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
    // You can choose different qualities: default.jpg, mqdefault.jpg, hqdefault.jpg, sddefault.jpg, maxresdefault.jpg
    return `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
  }
  return null;
};

function AdminDashboard() {
  const [courses, setCourses] = useState([]);
  const [courseForm, setCourseForm] = useState({ title: '', description: '', thumbnail: '', status: 'draft' });
  const [editingCourse, setEditingCourse] = useState(null);
  const [showAddCourseModal, setShowAddCourseModal] = useState(false);

  const [selectedCourseForLessons, setSelectedCourseForLessons] = useState(null);
  const [lessonForm, setLessonForm] = useState({ title: '', videoUrl: '', content: '' });
  const [editingLesson, setEditingLesson] = useState(null);

  useEffect(() => {
    AOS.init({
      duration: 1000,
      once: true,
      mirror: false,
    });

    const savedCourses = JSON.parse(localStorage.getItem('courses')) || [];

    // IMPORTANT FIX: Ensure all loaded courses have a 'lessons' array
    const initializedCourses = savedCourses.map(course => ({
      ...course,
      lessons: course.lessons || [] // If 'lessons' exists, use it; otherwise, initialize as empty array
    }));

    setCourses(initializedCourses);
  }, []);

  // Helper function to update courses in state and localStorage
  const updateCourses = useCallback((newCourses) => {
    setCourses(newCourses);
    localStorage.setItem('courses', JSON.stringify(newCourses));
  }, []);

  // --- Course Management Handlers ---
  const handleAddCourse = () => {
    if (!courseForm.title || !courseForm.description || !courseForm.thumbnail) {
      alert('All course fields are required!');
      return;
    }

    const newCourse = { ...courseForm, id: Date.now().toString(), lessons: [] }; // Ensure new courses have lessons array
    const updatedCourses = [...courses, newCourse];
    updateCourses(updatedCourses);
    setCourseForm({ title: '', description: '', thumbnail: '', status: 'draft' }); // Reset form
    setShowAddCourseModal(false); // Close the modal
  };

  const handleEditCourseSave = () => {
    const updatedCourses = courses.map((course) =>
      course.id === editingCourse.id ? editingCourse : course
    );
    updateCourses(updatedCourses);
    setEditingCourse(null); // Close the edit modal
  };

  const handleDeleteCourse = (id) => {
    if (window.confirm('Are you sure you want to delete this course and all its lessons?')) {
      const updatedCourses = courses.filter((course) => course.id !== id);
      updateCourses(updatedCourses);
    }
  };

  // --- Lesson Management Handlers ---
  const handleAddLesson = () => {
    if (!lessonForm.title || !lessonForm.videoUrl || !lessonForm.content) {
      alert('All lesson fields are required!');
      return;
    }

    const newLesson = { ...lessonForm, id: Date.now().toString() };
    const updatedCourses = courses.map(course =>
      course.id === selectedCourseForLessons.id
        ? { ...course, lessons: [...(course.lessons || []), newLesson] } // Ensure lessons array exists even if missing
        : course
    );
    updateCourses(updatedCourses);
    // Find the updated selectedCourseForLessons object from the new state
    setSelectedCourseForLessons(updatedCourses.find(c => c.id === selectedCourseForLessons.id));
    setLessonForm({ title: '', videoUrl: '', content: '' });
  };

  const handleEditLessonSave = () => {
    const updatedCourses = courses.map(course => {
      if (course.id === selectedCourseForLessons.id) {
        return {
          ...course,
          lessons: (course.lessons || []).map(lesson => // Ensure lessons array exists
            lesson.id === editingLesson.id ? editingLesson : lesson
          )
        };
      }
      return course;
    });
    updateCourses(updatedCourses);
    setSelectedCourseForLessons(updatedCourses.find(c => c.id === selectedCourseForLessons.id));
    setEditingLesson(null);
  };

  const handleDeleteLesson = (lessonId) => {
    if (window.confirm('Are you sure you want to delete this lesson?')) {
      const updatedCourses = courses.map(course => {
        if (course.id === selectedCourseForLessons.id) {
          return {
            ...course,
            lessons: (course.lessons || []).filter(lesson => lesson.id !== lessonId) // Ensure lessons array exists
          };
        }
        return course;
      });
      updateCourses(updatedCourses);
      setSelectedCourseForLessons(updatedCourses.find(c => c.id === selectedCourseForLessons.id));
    }
  };

  // Get thumbnail URL for preview in add/edit forms
  const currentLessonThumbnailUrl = getYoutubeThumbnailUrl(lessonForm.videoUrl);
  const editingLessonThumbnailUrl = editingLesson ? getYoutubeThumbnailUrl(editingLesson.videoUrl) : null;


  return (
    <div className="min-vh-100 py-5" style={{ backgroundColor: '#FFF7F9', fontFamily: 'Montserrat, sans-serif' }}>
      <style>
        {`
        @import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@300;400;500;600;700&display=swap');
        .form-icon-input {
            position: relative;
        }
        .form-icon-input .form-control,
        .form-icon-input .form-select {
            padding-left: 2.5rem; /* Space for the icon */
        }
        .form-icon-input .input-icon {
            position: absolute;
            left: 0.75rem;
            top: 50%;
            transform: translateY(-50%);
            color: #6c757d;
            z-index: 2; /* Ensure icon is above input */
        }
        .card {
            transition: transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out;
            border: none; /* Remove default bootstrap card border */
        }
        .card:hover {
            transform: translateY(-5px);
            box-shadow: 0 0.5rem 1rem rgba(0, 0, 0, 0.15) !important;
        }
        .btn-fancy-add {
            background: linear-gradient(45deg, #6B8E23, #A2B963); /* Olive green shades */
            border: none;
            color: white;
            font-weight: 600;
            padding: 0.75rem 1.5rem;
            border-radius: 50px;
            box-shadow: 0 4px 10px rgba(107, 142, 35, 0.3);
            transition: all 0.3s ease;
        }
        .btn-fancy-add:hover {
            transform: translateY(-2px);
            box-shadow: 0 6px 15px rgba(107, 142, 35, 0.5);
            color: white; /* Ensure text remains white on hover */
        }
        .modal-content {
            border-radius: 1rem !important; /* Larger border-radius for modals */
        }
        .lesson-thumbnail-preview {
            width: 100px;
            height: 60px;
            object-fit: cover;
            border-radius: 0.5rem;
            box-shadow: 0 2px 5px rgba(0,0,0,0.1);
            margin-right: 15px;
            flex-shrink: 0; /* Prevent it from shrinking */
        }
        .lesson-list-item-thumbnail {
            width: 80px; /* Smaller thumbnail in list */
            height: 45px;
            object-fit: cover;
            border-radius: 0.3rem;
            box-shadow: 0 1px 3px rgba(0,0,0,0.1);
            margin-right: 10px;
            flex-shrink: 0;
        }
        `}
      </style>
      <div className="container py-5 text-center">
        {/* Header and Add Course Button */}
        <div className="d-flex flex-column flex-md-row justify-content-between align-items-center mb-5" data-aos="fade-down">
          <h2 className="mb-3 mb-md-0 text-dark text-center text-md-start">
            <i className="fas fa-tools me-2 text-primary"></i>Admin Panel: Course & Lesson Manager
          </h2>
          <button className="btn btn-fancy-add" onClick={() => setShowAddCourseModal(true)}>
            <i className="fas fa-folder-plus me-2"></i>Add New Course
          </button>
        </div>

        {/* Course Cards Display */}
        <div className="row" data-aos="fade-up">
          {courses.length === 0 ? (
            <div className="col-12 text-center text-muted py-5">
              <i className="fas fa-info-circle fa-3x mb-3"></i>
              <h3>No courses added yet. Click "Add New Course" to get started!</h3>
            </div>
          ) : (
            courses.map((course) => (
              <div key={course.id} className="col-12 col-md-6 col-lg-4 mb-4" data-aos="zoom-in" data-aos-delay="100">
                <div className="card h-100 shadow rounded-4 overflow-hidden">
                  <img
                    src={course.thumbnail}
                    className="card-img-top"
                    style={{ height: '180px', objectFit: 'cover' }}
                    alt={course.title}
                    onError={(e) => { e.target.onerror = null; e.target.src = 'https://via.placeholder.com/400x180?text=Course+Image'; }} // Fallback for broken images
                  />
                  <div className="card-body text-start d-flex flex-column">
                    <h5 className="card-title text-primary fw-bold mb-2">
                      <i className="fas fa-book me-2"></i>
                      {course.title}
                    </h5>
                    <p className="card-text text-muted flex-grow-1" style={{ minHeight: '60px' }}>{course.description}</p>
                    <div className="d-flex flex-column flex-sm-row justify-content-between align-items-center mt-3">
                      <span
                        className={`badge p-2 rounded-pill mb-2 mb-sm-0 ${course.status === 'published' ? 'bg-success' : 'bg-warning text-dark'}`}
                      >
                        {course.status.charAt(0).toUpperCase() + course.status.slice(1)}
                      </span>
                      <div className="d-flex flex-wrap justify-content-center justify-content-sm-end">
                        <button
                          className="btn btn-outline-info btn-sm me-2 mb-2 mb-sm-0 rounded-pill px-3"
                          onClick={() => setSelectedCourseForLessons(course)} // Open lesson manager
                        >
                          <i className="fas fa-list-ul me-1"></i> Lessons ({course.lessons ? course.lessons.length : 0})
                        </button>
                        <button
                          className="btn btn-outline-primary btn-sm me-2 mb-2 mb-sm-0 rounded-pill px-3"
                          onClick={() => setEditingCourse(course)}
                        >
                          <i className="fas fa-edit me-1"></i> Edit
                        </button>
                        <button
                          className="btn btn-outline-danger btn-sm rounded-pill px-3"
                          onClick={() => handleDeleteCourse(course.id)}
                        >
                          <i className="fas fa-trash-alt me-1"></i> Delete
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Add Course Modal */}
        {showAddCourseModal && (
          <div className="modal d-block bg-dark bg-opacity-50" tabIndex="-1" data-aos="zoom-in">
            <div className="modal-dialog modal-dialog-centered modal-lg">
              <div className="modal-content rounded-4 p-4 shadow-lg">
                <div className="modal-header border-0 pb-0">
                  <h5 className="modal-title text-primary fw-bold"><i className="fas fa-folder-plus me-2"></i>Add New Course</h5>
                  <button type="button" className="btn-close" onClick={() => setShowAddCourseModal(false)}></button>
                </div>
                <div className="modal-body pt-3">
                  <div className="form-group mb-3 form-icon-input">
                    <i className="fas fa-signature input-icon"></i>
                    <input
                      type="text"
                      placeholder="Course Title"
                      className="form-control rounded-pill"
                      value={courseForm.title}
                      onChange={(e) => setCourseForm({ ...courseForm, title: e.target.value })}
                    />
                  </div>
                  <div className="form-group mb-3 form-icon-input">
                    <i className="fas fa-align-left input-icon"></i>
                    <textarea
                      placeholder="Short Description"
                      className="form-control rounded-3"
                      value={courseForm.description}
                      onChange={(e) => setCourseForm({ ...courseForm, description: e.target.value })}
                      rows="3"
                    />
                  </div>
                  <div className="form-group mb-3 form-icon-input">
                    <i className="fas fa-image input-icon"></i>
                    <input
                      type="text"
                      placeholder="Thumbnail Image URL (e.g., https://example.com/image.jpg)"
                      className="form-control rounded-pill"
                      value={courseForm.thumbnail}
                      onChange={(e) => setCourseForm({ ...courseForm, thumbnail: e.target.value })}
                    />
                  </div>
                  <div className="form-group mb-3 form-icon-input">
                    <i className="fas fa-toggle-on input-icon"></i>
                    <select
                      className="form-select rounded-pill"
                      value={courseForm.status}
                      onChange={(e) => setCourseForm({ ...courseForm, status: e.target.value })}
                    >
                      <option value="draft">Draft</option>
                      <option value="published">Published</option>
                    </select>
                  </div>
                </div>
                <div className="modal-footer border-0 pt-0">
                  <button className="btn btn-secondary rounded-pill px-4" onClick={() => setShowAddCourseModal(false)}>Cancel</button>
                  <button className="btn btn-primary rounded-pill px-4" onClick={handleAddCourse}>
                    <i className="fas fa-check-circle me-1"></i> Add Course
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Edit Course Modal */}
        {editingCourse && (
          <div className="modal d-block bg-dark bg-opacity-50" tabIndex="-1" data-aos="zoom-in">
            <div className="modal-dialog modal-dialog-centered modal-lg">
              <div className="modal-content rounded-4 p-4 shadow-lg">
                <div className="modal-header border-0 pb-0">
                  <h5 className="modal-title text-primary fw-bold"><i className="fas fa-pen-square me-2"></i>Edit Course</h5>
                  <button type="button" className="btn-close" onClick={() => setEditingCourse(null)}></button>
                </div>
                <div className="modal-body pt-3">
                  <div className="form-group mb-3 form-icon-input">
                    <i className="fas fa-signature input-icon"></i>
                    <input
                      type="text"
                      className="form-control rounded-pill"
                      value={editingCourse.title}
                      onChange={(e) => setEditingCourse({ ...editingCourse, title: e.target.value })}
                    />
                  </div>
                  <div className="form-group mb-3 form-icon-input">
                    <i className="fas fa-align-left input-icon"></i>
                    <textarea
                      className="form-control rounded-3"
                      value={editingCourse.description}
                      onChange={(e) => setEditingCourse({ ...editingCourse, description: e.target.value })}
                      rows="3"
                    />
                  </div>
                  <div className="form-group mb-3 form-icon-input">
                    <i className="fas fa-image input-icon"></i>
                    <input
                      type="text"
                      className="form-control rounded-pill"
                      value={editingCourse.thumbnail}
                      onChange={(e) => setEditingCourse({ ...editingCourse, thumbnail: e.target.value })}
                    />
                  </div>
                  <div className="form-group mb-3 form-icon-input">
                    <i className="fas fa-toggle-on input-icon"></i>
                    <select
                      className="form-select rounded-pill"
                      value={editingCourse.status}
                      onChange={(e) => setEditingCourse({ ...editingCourse, status: e.target.value })}
                    >
                      <option value="draft">Draft</option>
                      <option value="published">Published</option>
                    </select>
                  </div>
                </div>
                <div className="modal-footer border-0 pt-0">
                  <button className="btn btn-secondary rounded-pill px-4" onClick={() => setEditingCourse(null)}>Cancel</button>
                  <button className="btn btn-success rounded-pill px-4" onClick={handleEditCourseSave}>
                    <i className="fas fa-save me-1"></i> Save Changes
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Lesson Manager Modal */}
        {selectedCourseForLessons && (
          <div className="modal d-block bg-dark bg-opacity-50" tabIndex="-1" data-aos="zoom-in">
            <div className="modal-dialog modal-dialog-centered modal-xl"> {/* Larger modal for lessons */}
              <div className="modal-content rounded-4 p-4 shadow-lg">
                <div className="modal-header border-0 pb-0">
                  <h5 className="modal-title text-success fw-bold">
                    <i className="fas fa-graduation-cap me-2"></i>Lessons for: {selectedCourseForLessons.title}
                  </h5>
                  <button type="button" className="btn-close" onClick={() => {
                    setSelectedCourseForLessons(null);
                    setLessonForm({ title: '', videoUrl: '', content: '' }); // Reset lesson form
                  }}></button>
                </div>
                <div className="modal-body pt-3">
                  {/* Add Lesson Form */}
                  <div className="card shadow-sm mb-4 rounded-3 border-0" data-aos="fade-up">
                    <div className="card-body">
                      <h6 className="card-title text-secondary mb-3"><i className="fas fa-plus-circle me-2"></i>Add New Lesson</h6>
                      <div className="row align-items-center"> {/* Added align-items-center for vertical alignment */}
                        <div className="col-12 col-md-4 mb-3">
                          <div className="form-group form-icon-input">
                            <i className="fas fa-file-alt input-icon"></i>
                            <input
                              type="text"
                              placeholder="Lesson Title"
                              className="form-control rounded-pill"
                              value={lessonForm.title}
                              onChange={(e) => setLessonForm({ ...lessonForm, title: e.target.value })}
                            />
                          </div>
                        </div>
                        <div className="col-12 col-md-5 mb-3"> {/* Increased width for video URL + thumbnail preview */}
                          <div className="form-group form-icon-input d-flex align-items-center">
                            <i className="fas fa-video input-icon"></i>
                            <input
                              type="text"
                              placeholder="Video URL (e.g., YouTube link)"
                              className="form-control rounded-pill me-2" // Added margin-right
                              value={lessonForm.videoUrl}
                              onChange={(e) => setLessonForm({ ...lessonForm, videoUrl: e.target.value })}
                            />
                            {currentLessonThumbnailUrl && (
                                <img
                                  src={currentLessonThumbnailUrl}
                                  alt="YouTube Thumbnail"
                                  className="lesson-thumbnail-preview"
                                  onError={(e) => { e.target.onerror = null; e.target.src = 'https://via.placeholder.com/100x60?text=Invalid+URL'; }} // Fallback
                                />
                            )}
                          </div>
                        </div>
                        <div className="col-12 col-md-3 mb-3">
                          <div className="form-group form-icon-input">
                            <i className="fas fa-text-width input-icon"></i>
                            <textarea
                              placeholder="Lesson Content (e.g., notes, summary)"
                              className="form-control rounded-3"
                              value={lessonForm.content}
                              onChange={(e) => setLessonForm({ ...lessonForm, content: e.target.value })}
                              rows="1"
                            />
                          </div>
                        </div>
                        <div className="col-12 text-end">
                          <button className="btn btn-success rounded-pill px-4" onClick={handleAddLesson}>
                            <i className="fas fa-plus me-1"></i> Add Lesson
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Lessons List */}
                  <h6 className="text-secondary mb-3 mt-4"><i className="fas fa-list-ol me-2"></i>Existing Lessons</h6>
                  {selectedCourseForLessons.lessons && selectedCourseForLessons.lessons.length === 0 ? (
                    <div className="text-center text-muted py-3">
                      <i className="fas fa-exclamation-circle fa-2x mb-2"></i>
                      <p>No lessons added for this course yet.</p>
                    </div>
                  ) : (
                    <ul className="list-group rounded-3 shadow-sm">
                      {selectedCourseForLessons.lessons && selectedCourseForLessons.lessons.map((lesson, index) => (
                        <li className="list-group-item d-flex flex-column flex-sm-row justify-content-between align-items-sm-center py-3" key={lesson.id} data-aos="fade-up" data-aos-delay={index * 50}>
                          <div className="d-flex align-items-center text-start flex-grow-1 mb-2 mb-sm-0"> {/* Added d-flex and align-items-center */}
                            {getYoutubeThumbnailUrl(lesson.videoUrl) && (
                              <img
                                src={getYoutubeThumbnailUrl(lesson.videoUrl)}
                                alt="YouTube Thumbnail"
                                className="lesson-list-item-thumbnail"
                                onError={(e) => { e.target.onerror = null; e.target.src = 'https://via.placeholder.com/80x45?text=No+Thumb'; }} // Fallback
                              />
                            )}
                            <div>
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
                          <div className="d-flex flex-wrap justify-content-center justify-content-sm-end">
                            <button
                              className="btn btn-outline-primary btn-sm me-2 mb-2 mb-sm-0 rounded-pill px-3"
                              onClick={() => setEditingLesson(lesson)}
                            >
                              <i className="fas fa-edit me-1"></i> Edit
                            </button>
                            <button
                              className="btn btn-outline-danger btn-sm rounded-pill px-3"
                              onClick={() => handleDeleteLesson(lesson.id)}
                            >
                              <i className="fas fa-trash-alt me-1"></i> Delete
                            </button>
                          </div>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
                <div className="modal-footer border-0 pt-0">
                  <button className="btn btn-secondary rounded-pill px-4" onClick={() => {
                    setSelectedCourseForLessons(null);
                    setLessonForm({ title: '', videoUrl: '', content: '' }); // Reset lesson form on close
                  }}>
                    <i className="fas fa-times-circle me-1"></i> Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Edit Lesson Modal */}
        {editingLesson && (
          <div className="modal d-block bg-dark bg-opacity-50" tabIndex="-1" data-aos="zoom-in">
            <div className="modal-dialog modal-dialog-centered modal-lg"> {/* Adjusted size for edit modal */}
              <div className="modal-content rounded-4 p-4 shadow-lg">
                <div className="modal-header border-0 pb-0">
                  <h5 className="modal-title text-primary fw-bold"><i className="fas fa-pen-square me-2"></i>Edit Lesson</h5>
                  <button type="button" className="btn-close" onClick={() => setEditingLesson(null)}></button>
                </div>
                <div className="modal-body pt-3">
                  <div className="form-group mb-3 form-icon-input">
                    <i className="fas fa-file-alt input-icon"></i>
                    <input
                      type="text"
                      className="form-control rounded-pill"
                      value={editingLesson.title}
                      onChange={(e) => setEditingLesson({ ...editingLesson, title: e.target.value })}
                    />
                  </div>
                  <div className="form-group mb-3 form-icon-input d-flex align-items-center"> {/* Added d-flex and align-items-center */}
                    <i className="fas fa-video input-icon"></i>
                    <input
                      type="text"
                      className="form-control rounded-pill me-2" // Added margin-right
                      value={editingLesson.videoUrl}
                      onChange={(e) => setEditingLesson({ ...editingLesson, videoUrl: e.target.value })}
                    />
                    {editingLessonThumbnailUrl && (
                        <img
                          src={editingLessonThumbnailUrl}
                          alt="YouTube Thumbnail"
                          className="lesson-thumbnail-preview"
                          onError={(e) => { e.target.onerror = null; e.target.src = 'https://via.placeholder.com/100x60?text=Invalid+URL'; }} // Fallback
                        />
                    )}
                  </div>
                  <div className="form-group mb-3 form-icon-input">
                    <i className="fas fa-text-width input-icon"></i>
                    <textarea
                      className="form-control rounded-3"
                      value={editingLesson.content}
                      onChange={(e) => setEditingLesson({ ...editingLesson, content: e.target.value })}
                      rows="3"
                    />
                  </div>
                </div>
                <div className="modal-footer border-0 pt-0">
                  <button className="btn btn-secondary rounded-pill px-4" onClick={() => setEditingLesson(null)}>Cancel</button>
                  <button className="btn btn-success rounded-pill px-4" onClick={handleEditLessonSave}>
                    <i className="fas fa-save me-1"></i> Save Changes
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

export default AdminDashboard;