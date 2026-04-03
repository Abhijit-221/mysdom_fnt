import { useEffect, useState } from "react";
import "./bgvRequestForm.css";
import axiosInstance from "../../api/axiosInstance";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

function BgvRequestForm() {

  const navigate = useNavigate();

  const [step, setStep] = useState(1);

  const [form, setForm] = useState({
    clientId: "",
    candidate_name: "",
    candidate_phone: "",
    candidate_email: "",
    designation: "",
    department: "",

    id_type: "",
    id_number: "",
    id_doc: null,

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

    // company_name: "",
    // employee_id: "",
    // employment_start: "",
    // employment_end: "",
    // job_title: "",
    // leaving_reason: "",
    // job_doc: null,

    institute_name: "",
    university: "",
    education_start: "",
    education_end: "",
    roll_number: "",
    qualification: "",
    specialization: "",
    passing_year: "",
    edu_doc: null,
    assignedTo: "",
    service: []
  });

  /* ============================
     EMPLOYMENT MULTIPLE STATE
  ============================ */

  const [employments, setEmployments] = useState([
    {
      company_name: "",
      employee_id: "",
      employment_start: "",
      employment_end: "",
      job_title: "",
      leaving_reason: "",
      job_doc: null
    }
  ]);

  const [services, setServices] = useState([]);
  // const [selectedService, setSelectedService] = useState("");
  const [selectedServices, setSelectedServices] = useState([]);
  const next = () => setStep(prev => prev + 1);
  const back = () => setStep(prev => prev - 1);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const validateFile = (file) => {

    const allowedTypes = [
      "application/pdf",
      "image/jpeg",
      "image/jpg",
      "image/png"
    ];

    const maxSize = 5 * 1024 * 1024;

    if (!allowedTypes.includes(file.type)) {
      alert("Only PDF, JPG, JPEG, PNG allowed");
      return false;
    }

    if (file.size > maxSize) {
      alert("File must be under 5MB");
      return false;
    }

    return true;
  };

  const handleFile = (e) => {

    const file = e.target.files[0];
    const name = e.target.name;

    if (!file) return;

    if (validateFile(file)) {
      setForm({ ...form, [name]: file });
    } else {
      e.target.value = "";
    }
  };

  /* ============================
      EMPLOYMENT HANDLERS
  ============================ */

  const handleEmploymentChange = (index, e) => {

    const { name, value, type, checked } = e.target;

    let updated = [...employments];

    if (type === "checkbox") {

      updated[index][name] = checked;

      if (checked) {
        updated[index].employment_end = "";
      }

    } else {

      updated[index][name] = value;

    }

    setEmployments(updated);
  };

  const handleEmploymentFile = (index, e) => {

    const file = e.target.files[0];

    if (!file) return;

    if (!validateFile(file)) {
      e.target.value = "";
      return;
    }

    const updated = [...employments];
    updated[index].job_doc = file;

    setEmployments(updated);
  };

  const addEmployment = () => {
    setEmployments([
      ...employments,
      {
        company_name: "",
        employee_id: "",
        employment_start: "",
        employment_end: "",
        job_title: "",
        leaving_reason: "",
        isCurrent: false,
        job_doc: null
      }
    ])
  }
  const removeEmployment = (index) => {
    const updated = employments.filter((_, i) => i !== index);
    setEmployments(updated);
  }
  const isLastEmploymentFilled = () => {

    const last = employments[employments.length - 1];

    if (
      !last.company_name ||
      !last.employee_id ||
      !last.employment_start ||
      !last.job_title
    ) {
      return false;
    }

    return true;
  };


  useEffect(() => {
    fetchServices();
    fetchUser();
  }, []);

  const fetchServices = async () => {
    try {

      const user = JSON.parse(localStorage.getItem("user"));

      const userDetails = await axiosInstance.get(`/auth/user/get/${user.id}`);

      const res = await axiosInstance.get(
        `/client-service/getby/${userDetails?.data?.data?.client}`
      );

      setServices(res.data?.data);

    } catch (error) {
      console.error("Service fetch error", error);
    }
  };



  // handle service toggle
  const handleServiceToggle = (serviceId) => {

    setSelectedServices((prev) => {

      if (prev.includes(serviceId)) {
        return prev.filter(id => id !== serviceId);
      }

      return [...prev, serviceId];
    });

  };

  const [asignTouser, setAsignTouser] = useState("");
  const [clientId, setClientId] = useState("");

  const fetchUser = async () => {
    try {

      const user = JSON.parse(localStorage.getItem("user"));

      const respUser = await axiosInstance.get("/auth/users/get");

      const users = respUser.data.data;

      users.forEach((u) => {

        if (u.role === "superadmin") {
          setAsignTouser(u.id);
        }

        if (user.id === u.id) {
          // console.log(user.id,'--',u.id,u.client);
          setClientId(u.client);
        }

      });
      // setForm({ ...form, assignedTo:asignTouser ,clientId:clientId });
      console.log("form:", asignTouser);

    } catch (error) {
      console.error(error);
    }
  };

  const submitForm = async () => {
    try {

      const formData = new FormData();

      Object.entries(form).forEach(([key, value]) => {

        if (value === "" || value === null) return;

        // ❗ skip service because we will append it separately
        if (key === "service") return;

        formData.append(key, value);
      });

      /* EMPLOYMENT ARRAY */

      employments.forEach((emp, index) => {

        Object.entries(emp).forEach(([key, value]) => {

          if (value === "" || value === null) return;

          if (key === "job_doc") {
            formData.append(`bgvEmployments[${index}][job_doc]`, value);
          }
          else {
            formData.append(`bgvEmployments[${index}][${key}]`, value);
          }

        })

      });

      formData.append("clientId", clientId);
      formData.append("assignedTo", asignTouser);

      // ✅ append services as array
      selectedServices.forEach((serviceId) => {
        formData.append("service", serviceId);
      });

      const res = await axiosInstance.post("/bgvrequest/apply", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      navigate("/bgv/list");

    } catch (error) {
      console.log(error);

      let message = "Failed to submit form";

      // backend error
      if (error.response) {
        message = error.response?.data?.message || `Error ${error.response.status}`;
      }
      // request sent but no response
      else if (error.request) {
        message = "Server not responding. Please try again.";
      }
      // axios or other error
      else {
        message = error.message;
      }

      toast.error(message);
    }
  };

  return (
    <div className="bgv-overlay">

      <div className="bgv-modal">

        <div className="bgv-header">
          <h3>BGV Submission Form</h3>
          <button onClick={() => navigate("/bgv/list")}>✕</button>
        </div>

        {/* STEPS */}

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

        {/* PERSONAL */}

        {step === 1 && (
          <div className="form-section">

            <h4>Personal Details</h4>

            <div className="form-grid">

              <input name="candidate_name" placeholder="Full Name *" value={form.candidate_name || ""} onChange={handleChange} />

              <input name="candidate_phone" placeholder="Phone Number *" value={form.candidate_phone || ""} onChange={handleChange} />

              <input name="candidate_email" placeholder="Email *" value={form.candidate_email || ""} onChange={handleChange} />

              <input name="designation" placeholder="Designation" onChange={handleChange} />

              <input name="department" placeholder="Department" onChange={handleChange} />

            </div>

            <div className="form-footer">
              <button
                onClick={() => {

                  if (!form.candidate_name?.trim() || !form.candidate_phone?.trim() || !form.candidate_email?.trim()) {
                    alert("Fields marked with * are mandatory");
                    return;
                  }

                  next();

                }}
              >
                Next
              </button>
            </div>

          </div>
        )}

        {/* IDENTITY */}

        {step === 2 && (
          <div className="form-section">

            <h4>Identity Check</h4>

            <div className="form-grid">
              <input name="id_type" placeholder="ID Type" onChange={handleChange} />
              <input name="id_number" placeholder="ID Number" onChange={handleChange} />
              <input type="file" name="id_doc" onChange={handleFile} />
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
              <input name="current_address" placeholder="Address" onChange={handleChange} />
              <input name="current_landmark" placeholder="Landmark" onChange={handleChange} />
              <input name="current_residency" placeholder="Residency Status" onChange={handleChange} />
              <input name="current_duration" placeholder="Duration of Stay" onChange={handleChange} />
            </div>

            <h4>Permanent Address</h4>

            <div className="form-grid">
              <input name="permanent_address" placeholder="Address" onChange={handleChange} />
              <input name="permanent_landmark" placeholder="Landmark" onChange={handleChange} />
              <input name="permanent_residency" placeholder="Residency Status" onChange={handleChange} />
              <input name="permanent_duration" placeholder="Duration of Stay" onChange={handleChange} />
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
              <input name="father_name" placeholder="Father Name" onChange={handleChange} />
              <input name="mother_name" placeholder="Mother Name" onChange={handleChange} />
              <input name="gender" placeholder="Gender" onChange={handleChange} />
              <input type="date" name="dob" onChange={handleChange} />
            </div>

            <div className="form-footer">
              <button onClick={back}>Back</button>
              <button onClick={next}>Next</button>
            </div>

          </div>
        )}

        {/* EMPLOYMENT */}

        {/* ============================
      EMPLOYMENT STEP
============================ */}

        {step === 5 && (

          <div className="form-section">

            <h4>Employment Check</h4>

            {employments.map((emp, index) => (

              <div key={index} className="employment-card">

                <h5>Organization {index + 1}</h5>

                <div className="form-grid">

                  <input
                    name="company_name"
                    placeholder="Company Name"
                    value={emp.company_name}
                    onChange={(e) => handleEmploymentChange(index, e)}
                  />

                  <input
                    name="employee_id"
                    placeholder="Employee ID"
                    value={emp.employee_id}
                    onChange={(e) => handleEmploymentChange(index, e)}
                  />

                  <input
                    type="date"
                    name="employment_start"
                    value={emp.employment_start}
                    onChange={(e) => handleEmploymentChange(index, e)}
                  />
                  <label className="current-check">

                    <input
                      type="checkbox"
                      name="is_current"
                      checked={emp.is_current}
                      disabled={
                        employments.some((e, i) => e.is_current && i !== index)
                      }
                      onChange={(e) => handleEmploymentChange(index, e)}
                    />

                    Currently work here

                  </label>
                  {!emp.is_current && (
                    <input
                      type="date"
                      name="employment_end"
                      value={emp.employment_end}
                      onChange={(e) => handleEmploymentChange(index, e)}
                    />
                  )}

                  <input
                    name="job_title"
                    placeholder="Job Title"
                    value={emp.job_title}
                    onChange={(e) => handleEmploymentChange(index, e)}
                  />

                  <input
                    name="leaving_reason"
                    placeholder="Reason for Leaving"
                    value={emp.leaving_reason}
                    onChange={(e) => handleEmploymentChange(index, e)}
                  />

                  <input
                    type="file"
                    onChange={(e) => handleEmploymentFile(index, e)}
                  />

                </div>

                {employments.length > 1 && (

                  <button
                    className="remove-btn"
                    onClick={() => removeEmployment(index)}
                  >
                    Remove
                  </button>

                )}

              </div>

            ))}

            <button
              className="ad-btn"
              onClick={addEmployment}
              disabled={!isLastEmploymentFilled()}
            >
              + Add Organization
            </button>

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
              <input name="institute_name" placeholder="Institute Name" onChange={handleChange} />
              <input name="university" placeholder="University" onChange={handleChange} />
              <input type="date" name="education_start" onChange={handleChange} />
              <input type="date" name="education_end" onChange={handleChange} />
              <input name="roll_number" placeholder="Roll Number" onChange={handleChange} />
              <input name="qualification" placeholder="Qualification" onChange={handleChange} />
              <input name="specialization" placeholder="Specialization" onChange={handleChange} />
              <input name="passing_year" placeholder="Passing Year" onChange={handleChange} />
              <input type="file" name="edu_doc" onChange={handleFile} />
            </div>

            <div className="form-footer">
              <button onClick={back}>Back</button>
              <button onClick={next}>Next</button>
            </div>

          </div>
        )}


        {/* SERVICE */}

        {step === 7 && (
          <div className="form-section">

            <h4>Select Services</h4>

            <div className="service-list">

              {services.map((service) => (
                <label key={service.service.id} className="service-card">

                  <input
                    type="checkbox"
                    checked={selectedServices.includes(service.service.id)}
                    onChange={() => handleServiceToggle(service.service.id)}
                  />

                  <span>{service.service.name}</span>

                </label>
              ))}

            </div>

            <div className="form-footer">

              <button onClick={back}>Back</button>

              <button
                onClick={() => {

                  if (selectedServices.length === 0) {
                    alert("Please select at least one service");
                    return;
                  }

                  setForm(prev => ({
                    ...prev,
                    service: selectedServices
                  }));

                  next();

                }}
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
              <p><b>Name:</b> {form.candidate_name}</p>
              <p><b>Email:</b> {form.candidate_email}</p>
              <p><b>Phone:</b> {form.candidate_phone}</p>
            </div>

            <div className="form-footer">
              <button onClick={back}>Back</button>
              <button className="submit-btn" onClick={submitForm}>
                Submit
              </button>
            </div>

          </div>
        )}

      </div>

    </div>
  );
}

export default BgvRequestForm;