import React, { useState, useEffect } from "react";
import { TextField } from "@mui/material";
import { FaPlus, FaTimes } from "react-icons/fa";
import "../css/Course.css";

/*  Issue with logic: courseDetails contains duplicated entries of added courses (? unsure why this happens)
    Resolved: only display (index % 2 === 0) even index when added (line 80) and removed (index + 1) as well when removed (line 69)
*/

function AddCourse() {
  const [showForm, setShowForm] = useState(false);
  const [courseName, setCourseName] = useState("");
  const [courseDetails, setCourseDetails] = useState([]);
  const [courseNotFound, setCourseNotFound] = useState(false);

  useEffect(() => {
    setShowForm(false);
  }, [courseDetails]);

  const handleAddClick = () => {
    setShowForm(true);
    setCourseNotFound(false);
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (courseName.trim() !== "") {
      try {
        const response = await fetch(`http://localhost:5050/catalog/search?courseName=${courseName}`);
        const data = await response.json();

        if (data && data.length === 0) {
          setCourseNotFound(true);
        } else {
          if (!courseDetails.some(detail => detail.courseName === courseName)) {
            setCourseDetails((prevDetails) => [...prevDetails, { courseName, details: data }]);
          }
          setCourseName("");
          setShowForm(false);
        }
      } catch (error) {
        console.error('Error searching for courses:', error);
      }
    }
  };

  const handleSearch = async () => {
    try {
      const response = await fetch(`http://localhost:5050/catalog/search?courseName=${courseName}`);
      const data = await response.json();

      if (data && data.length === 0) {
        setCourseNotFound(true);
      } else {
        if (!courseDetails.some(detail => detail.courseName === courseName)) {
          setCourseDetails((prevDetails) => [...prevDetails, { courseName, details: data }]);
        }
        setShowForm(false);
      }
    } catch (error) {
      console.error('Error searching for courses:', error);
    }
  };

  const handleRemoveCourse = (index) => {
    setCourseDetails((prevDetails) => {
      const updatedDetails = [...prevDetails];
      updatedDetails.splice(index, 1);
      if (index < updatedDetails.length) {
        updatedDetails.splice(index, 1);
      }
      return updatedDetails;
    });
  };

  return (
    <div className="course-content">
      <div>
        {courseDetails.map((detail, index) => (
          index % 2 === 0 && (
            <button key={index} className="grid-course-button" style={{ marginTop: "10px" }}>
              <span style={{ color: "#5aac44" }}><strong>{detail.courseName}</strong></span>
              <span style={{ color: "#747474", paddingLeft: "10px" }}>{(detail.details.length > 0 ? detail.details[0].CourseName : 'Course description')}
              </span>
              <FaTimes onClick={() => handleRemoveCourse(index)} style={{ float: "right", paddingRight: "20px", marginTop: "5px", color: "#e9e9e9" }} />
            </button>
          )
        ))}
      </div>
      <div className="grid-course" style={{}}>
        {showForm ? (
          <button className="grid-course-button" style={{ marginTop: "10px", height: courseNotFound ? "110px" : "80px" }}>
            <form onSubmit={handleFormSubmit}>
              <div className="grid-add-course">
                <div className="item" style={{ paddingTop: "5px",  }}>
                  <TextField
                    label="Course"
                    variant="outlined"
                    value={courseName}
                    onChange={(e) => setCourseName(e.target.value)}
                    placeholder="Enter course name"
                    style={{border: "1px solid #fff", width: "200px" }}
                    inputProps={{ style: { backgroundColor: "#fff", color: "#747474", fontFamily: 'Segoe UI', fontSize: "15px" }, notchedOutline: { borderColor: "#747474" } }}
                    InputLabelProps={{ style: { fontFamily: "Segoe UI", color: "#747474" } }}
                  />
                </div>
                <div className="item" style={{ paddingTop: "13px", paddingLeft: "5px" }}>
                  <button type="submit" onClick={handleSearch}
                    style={{ width: "80px", height: "40px", backgroundColor: "#5aac44", border: "1px #5aac44", color: "#fff", borderRadius: "5px" }}>
                    <FaPlus style={{ paddingRight: "10px", color: "#fff" }} /><strong>Add</strong>
                  </button>
                </div>
              </div>
            </form>
            {courseNotFound && (
              <div style={{ color: "#747474", paddingLeft: "10px" }}><i>Course not found, please try again.</i></div>
            )}
          </button>

        ) : (
          <button className="grid-course-button" style={{ marginTop: "10px" }} onClick={handleAddClick}>
            <FaPlus style={{ paddingRight: "20px", color: "#747474" }} /> Add course
          </button>
        )}
      </div>
    </div>
  );
}

export default AddCourse;
