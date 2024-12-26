import React, { useState } from "react";
import "../styles/auth.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";

const Register = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [studentnumber, setStudentNumber] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [faculty, setFaculty] = useState("");
  const [department, setDepartment] = useState("");

  // Example faculty and department options
  const facultyOptions = [
    "Science",
    "Engineering",
    "Arts",
    "Business",
    "Medical",
  ];
  const departmentOptions = {
    Science: ["Biology", "Chemistry", "Physics", "software engineering"],
    Engineering: [
      "Computer Science",
      "Mechanical Engineering",
      "Electrical Engineering",
    ],
    Arts: ["History", "Literature", "Philosophy"],
    Business: ["Accounting", "Marketing", "Finance"],
    Medical: ["medicine", "dental", "veterinary"],
  };

  const validatePhoneNumber = (number) => {
    // Example regex for phone numbers (this may vary based on the country/format you want to support)
    const phoneRegex = /^[0-9]{10}$/; // This regex checks for exactly 10 digits
    return phoneRegex.test(number);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validatePhoneNumber(phone)) {
      toast.error("Invalid phone number. Please enter a valid 10-digit phone number.", {
        icon: "❌",
        style: {
          border: "1px solid #ff4d4f",
          padding: "16px",
          color: "#ff4d4f",
        },
      });
      return;
    }

    try {
      const response = await axios.post(
        "/register/studentRegister",
        {
          username,
          studentnumber,
          email,
          password,
          phone,
          faculty,
          department,
        }
      );
      if (response && response.data.success) {
        toast.success("Registered successfully", {
          icon: "👏",
          style: {
            border: "1px solid #4caf50",
            padding: "16px",
            color: "#4caf50",
          },
        });
        navigate("/");
      } else {
        toast.error("Registration failed. Please try again.", {
          icon: "❌",
          style: {
            border: "1px solid #ff4d4f",
            padding: "16px",
            color: "#ff4d4f",
          },
        });
      }
    } catch (error) {
      if (error.response) {
        if (error.response.status === 409) {
          toast.error("Email already exists. Please use a different email.", {
            icon: "⚠️",
            style: {
              border: "1px solid #ffa726",
              padding: "16px",
              color: "#ffa726",
            },
          });
        } else if (error.response.status === 400) {
          toast.error("Bad Request. Please check your input values.", {
            icon: "⚠️",
            style: {
              border: "1px solid #ffa726",
              padding: "16px",
              color: "#ffa726",
            },
          });
        } else if (error.response.status === 500) {
          toast.error("Internal Server Error. Please try again later.", {
            icon: "❌",
            style: {
              border: "1px solid #ff4d4f",
              padding: "16px",
              color: "#ff4d4f",
            },
          });
        } else {
          toast.error(`Unexpected error: ${error.response.status}`, {
            icon: "❌",
            style: {
              border: "1px solid #ff4d4f",
              padding: "16px",
              color: "#ff4d4f",
            },
          });
        }
      } else if (error.request) {
        toast.error(
          "No response from server. Please check your network connection.",
          {
            icon: "🌐",
            style: {
              border: "1px solid #ff9800",
              padding: "16px",
              color: "#ff9800",
            },
          }
        );
      } else {
        toast.error(`Error in setting up the request: ${error.message}`, {
          icon: "❌",
          style: {
            border: "1px solid #ff4d4f",
            padding: "16px",
            color: "#ff4d4f",
          },
        });
      }
    }
  };

  return (
    <div className="container">
      <Toaster position="top-right" />
      <div className="main_container">
        <form className="form_lr" onSubmit={handleSubmit}>
          <h2 className="title">Register As A Student</h2>
          <input
            className="input-field"
            type="text"
            name="studentnumber"
            placeholder="Student Number"
            value={studentnumber}
            onChange={(e) => setStudentNumber(e.target.value)}
            required
          />
          <input
            className="input-field"
            type="text"
            name="username"
            placeholder="Name"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
          <input
            className="input-field"
            type="email"
            name="email"
            placeholder="University Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            className="input-field"
            type="password"
            name="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            required
          />
          <input
            className="input-field"
            type="text"
            name="phone"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="Phone Number"
            required
          />
          <select
            className="input-field_select"
            name="faculty"
            value={faculty}
            onChange={(e) => setFaculty(e.target.value)}
            required
          >
            <option value="" disabled>
              Select Faculty
            </option>
            {facultyOptions.map((facultyOption) => (
              <option key={facultyOption} value={facultyOption}>
                {facultyOption}
              </option>
            ))}
          </select>
          <select
            className="input-field_select"
            name="department"
            value={department}
            onChange={(e) => setDepartment(e.target.value)}
            required
          >
            <option value="" disabled>
              Select Department
            </option>
            {faculty &&
              departmentOptions[faculty].map((departmentOption) => (
                <option key={departmentOption} value={departmentOption}>
                  {departmentOption}
                </option>
              ))}
          </select>
          <button type="submit" className="submit-btn">
            Sign Up
          </button>
          <div className="link">
            Already have an account? <a href="/">Login</a>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Register;
