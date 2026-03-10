import { useEffect, useState } from "react";
import "./bgvRequestForm.css";
import axiosInstance from "../../api/axiosInstance";
import { useNavigate } from "react-router-dom";
import { AuthContext } from '../../context/AuthContext';

function BgvRequestForm({ setRequests }) {

  const [step, setStep] = useState(1);

  const [form, setForm] = useState({
    full_name: "",
    phone: "",
    email: "",
    designation: "",
    department: "",

    id_type: "",
    id_number: "",

    current_address: "",
    current_landmark: "",
    current_residency: "",
    current_duration: "",

    permanent_address: "",
    permanent_landmark: "",
    permanent_residency: "",
    permanent_duration: "",

    father_name: "",
    mother_name: "",
    gender: "",
    dob: "",

    company_name: "",
    employee_id: "",
    employment_start: "",
    employment_end: "",
    job_title: "",
    leaving_reason: "",

    institute_name: "",
    university: "",
    education_start: "",
    education_end: "",
    roll_number: "",
    degree_completed: "",
    qualification: "",
    specialization: "",
    passing_year: "",
    service: []
  });
  const [services, setServices] = useState([]);
  const [selectedService, setSelectedService] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const next = () => setStep(step + 1);
  const back = () => setStep(step - 1);
  const navigate = useNavigate();
  const submitForm = () => {
    const newRequest = {
      id: Date.now(),
      createdAt: new Date(),
      status: "Pending",
      ...form
    };

    setRequests(prev => [...prev, newRequest]);
    navigate('/bgv/list')
  };

  console.log(AuthContext);

  //file validate 
  const validateFile = (file) => {

    const allowedTypes = [
      "application/pdf",
      "image/jpeg",
      "image/jpg",
      "image/png"
    ];

    const maxSize = 5 * 1024 * 1024; // 5MB

    if (!allowedTypes.includes(file.type)) {
      alert("Only PDF, JPG, JPEG, PNG files are allowed");
      return false;
    }

    if (file.size > maxSize) {
      alert("File size must be less than 5MB");
      return false;
    }

    return true;
  };

  //call client service
  useEffect(() => {
    fetchServices();
  }, []);


  const fetchServices = async () => {
    try {
          let user = JSON.parse(localStorage.getItem('user'));
      // console.log("user:",user);
      let userDetails = await axiosInstance.get(`/auth/user/get/${user.id}`);
      const res = await axiosInstance.get(`/client-service/getby/${userDetails?.data?.data?.client}`);
      console.log('res:',res.data.data);

      // example response
      // [{id:1,name:"Employment Check"},{id:2,name:"Education Check"}]

      setServices(res.data?.data);
    } catch (error) {
      console.error("Service fetch error", error);
    }
  };

  const handleServiceNext = () => {

    if (!selectedService) {
      alert("Please select a service");
      return;
    }

    setFormData((prev) => ({
      ...prev,
      service: [...new Set([...prev.service, Number(selectedService)])]
    }));

    setActiveTab("review");
  };

  return (
    <div className="bgv-overlay">

      <div className="bgv-modal">

        <div className="bgv-header">
          <h3>BGV Submission Form</h3>
          <button onClick={() => (navigate('/bgv/list'))}>✕</button>
        </div>

        <div className="bgv-steps">
          <span className={step >= 1 ? "active" : ""}>Personal</span>
          <span className={step >= 2 ? "active" : ""}>Identity</span>
          <span className={step >= 3 ? "active" : ""}>Address</span>
          <span className={step >= 4 ? "active" : ""}>Criminal</span>
          <span className={step >= 5 ? "active" : ""}>Employment</span>
          <span className={step >= 6 ? "active" : ""}>Education</span>
          <span className={step >= 7 ? "active" : ""}>Service</span>
          <span className={step >= 8 ? "active" : ""}>Review</span>
        </div>

        {/* PERSONAL DETAILS */}

        {step === 1 && (
          <div className="form-section">

            <h4>Personal Details</h4>

            <div className="form-grid">
              <input name="full_name" placeholder="Full Name" onChange={handleChange} />
              <input name="phone" placeholder="Phone Number" onChange={handleChange} />
              <input name="email" placeholder="Email" onChange={handleChange} />
              <input name="designation" placeholder="Designation" onChange={handleChange} />
              <input name="department" placeholder="Department" onChange={handleChange} />
            </div>

            <div className="form-footer">
              <button onClick={next}>Next</button>
            </div>

          </div>
        )}

        {/* IDENTITY */}

        {step === 2 && (
          <div className="form-section">

            <h4>Identity Check</h4>

            <div className="form-grid">
              <input name="id_type" placeholder="ID Type (Aadhar/PAN)" onChange={handleChange} />
              <input name="id_number" placeholder="ID Number" onChange={handleChange} />
              <input
                type="file"
                name="id_doc"
                accept=".pdf,.jpg,.jpeg,.png"
                onChange={(e) => {

                  const file = e.target.files[0];
                  if (!file) return;

                  if (validateFile(file)) {
                    setForm({ ...form, id_doc: file });
                  } else {
                    e.target.value = "";
                  }

                }}
              />
            </div>

            <div className="form-footer">
              <button onClick={back}>Back</button>
              <button onClick={next}>Next</button>
            </div>

          </div>
        )}

        {/* ADDRESS */}

        {step === 3 && (
          <div className="form-section">

            <h4>Current Address</h4>

            <div className="form-grid">
              <input name="current_address" placeholder="Address" />
              <input name="current_landmark" placeholder="Landmark" />
              <input name="current_residency" placeholder="Residency Status" />
              <input name="current_duration" placeholder="Duration of Stay" />
            </div>

            <h4>Permanent Address</h4>

            <div className="form-grid">
              <input name="permanent_address" placeholder="Address" />
              <input name="permanent_landmark" placeholder="Landmark" />
              <input name="permanent_residency" placeholder="Residency Status" />
              <input name="permanent_duration" placeholder="Duration of Stay" />
            </div>

            <div className="form-footer">
              <button onClick={back}>Back</button>
              <button onClick={next}>Next</button>
            </div>

          </div>
        )}

        {/* CRIMINAL */}

        {step === 4 && (
          <div className="form-section">

            <h4>Criminal Check</h4>

            <div className="form-grid">
              <input name="father_name" placeholder="Father Name" />
              <input name="mother_name" placeholder="Mother Name" />
              <input name="gender" placeholder="Gender" />
              <input type="date" name="dob" />
            </div>

            <div className="form-footer">
              <button onClick={back}>Back</button>
              <button onClick={next}>Next</button>
            </div>

          </div>
        )}

        {/* EMPLOYMENT */}

        {step === 5 && (
          <div className="form-section">

            <h4>Employment Check</h4>

            <div className="form-grid">
              <input name="company_name" placeholder="Company Name" />
              <input name="employee_id" placeholder="Employee ID" />
              <input type="date" name="employment_start" />
              <input type="date" name="employment_end" />
              <input name="job_title" placeholder="Job Title" />
              <input name="leaving_reason" placeholder="Reason for Leaving" />
              <input
                type="file"
                name="job_doc"
                accept=".pdf,.jpg,.jpeg,.png"
                onChange={(e) => {

                  const file = e.target.files[0];
                  if (!file) return;

                  if (validateFile(file)) {
                    setForm({ ...form, job_doc: file });
                  } else {
                    e.target.value = "";
                  }

                }}
              />
            </div>

            <div className="form-footer">
              <button onClick={back}>Back</button>
              <button onClick={next}>Next</button>
            </div>

          </div>
        )}

        {/* EDUCATION */}

        {step === 6 && (
          <div className="form-section">

            <h4>Education Check</h4>

            <div className="form-grid">
              <input name="institute_name" placeholder="Institution Name" />
              <input name="university" placeholder="University" />
              <input type="date" name="education_start" />
              <input type="date" name="education_end" />
              <input name="roll_number" placeholder="Roll Number" />
              <input name="qualification" placeholder="Qualification" />
              <input name="specialization" placeholder="Specialization" />
              <input name="passing_year" placeholder="Passing Year" />
              <input
                type="file"
                name="edu_doc"
                accept=".pdf,.jpg,.jpeg,.png"
                onChange={(e) => {

                  const file = e.target.files[0];
                  if (!file) return;

                  if (validateFile(file)) {
                    setForm({ ...form, edu_doc: file });
                  } else {
                    e.target.value = "";
                  }

                }}
              />
            </div>

            <div className="form-footer">
              <button onClick={back}>Back</button>
              <button onClick={next}>Next</button>
            </div>

          </div>
        )}
        {/* service */}
        {step === 7 && (
          <div className="tab-section">

            <h4>Select Service</h4>

            <select
              className="form-control"
              value={selectedService}
              onChange={(e) => setSelectedService(e.target.value)}
            >
              <option value="">Select Service</option>

              {services.map((service) => (
                <option key={service.service.id} value={service.service.id}>
                  {service.service.name}
                </option>
              ))}
            </select>
            <div className="form-footer">

              <button
                type="button"
                onClick={back}
              >
                Back
              </button>

              <button
                type="button"
                onClick={handleServiceNext}
              >
                Next
              </button>

            </div>
          </div>
        )}

        {/* REVIEW */}

        {step === 8 && (
          <div className="form-section">

            <h4>Review</h4>

            <div className="review-box">
              <p><b>Name:</b> {form.full_name}</p>
              <p><b>Email:</b> {form.email}</p>
              <p><b>Phone:</b> {form.phone}</p>
              <p><b>Company:</b> {form.company_name}</p>
            </div>

            <div className="form-footer">
              <button onClick={back}>Back</button>
              <button className="submit-btn" onClick={submitForm}>Submit</button>
            </div>

          </div>
        )}

      </div>
    </div>
  );
}

export default BgvRequestForm;