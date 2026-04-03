import React, { useEffect, useState } from "react";
import "./bgvViewEditFoem.css";
import { useLocation, useNavigate } from "react-router-dom";
import axiosInstance from "../../api/axiosInstance";
import toast from "react-hot-toast";

const BGVViewEditRequestForm = () => {

    const location = useLocation();
    const data = location.state?.data;
    const mode = location.state?.mode || "edit";
    const role = location.state?.role || "admin";
    const [step, setStep] = useState(mode === "view" ? 8 : 1);

    const [formData, setFormData] = useState(data);
    const navigate = useNavigate();
    const base_url = import.meta.env.VITE_BASE_URL;
    // console.log("base_url:--------->",base_url);


    const handleChange = (e) => {
        const { name, value } = e.target;

        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const next = () => setStep(step + 1);
    const prev = () => setStep(step - 1);


    // Employeement changes
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
    const [removedEmployments, setRemovedEmployments] = useState([]);


    // const handleEmploymentChange = (index, e) => {
    //     const { name, value, type, checked } = e.target;

    //     const updated = [...formData.employments];

    //     updated[index][name] = type === "checkbox" ? checked : value;

    //     // if current job checked -> remove end date
    //     if (name === "isCurrent" && checked) {
    //         updated[index].employment_end = "";
    //     }

    //     setFormData({
    //         ...formData,
    //         employments: updated
    //     });
    // };

    const handleEmploymentChange = (index, e) => {
        const { name, value, type, checked } = e.target;

        const updated = [...formData.employments];

        if (name === "isCurrent") {
            // ❗ make all unchecked first
            updated.forEach((emp, i) => {
                updated[i].isCurrent = false;
            });

            // ✅ set only selected one
            updated[index].isCurrent = checked;

            // if checked → clear end date
            if (checked) {
                updated[index].employment_end = "";
            }

        } else {
            updated[index][name] = type === "checkbox" ? checked : value;
        }

        setFormData({
            ...formData,
            employments: updated
        });
    };
    const handleEmploymentFile = (index, e) => {
        const file = e.target.files[0];

        if (!file) return;

        const updated = [...formData.employments];
        updated[index].job_doc = file;

        setFormData({
            ...formData,
            employments: updated
        });
    };
    const addEmployment = () => {
        const newEmployment = {
            id: null,
            company_name: "",
            employee_id: "",
            employment_start: "",
            employment_end: "",
            job_title: "",
            leaving_reason: "",
            isCurrent: false,
            job_doc: null
        };

        setFormData({
            ...formData,
            employments: [...formData.employments, newEmployment]
        });
    };
    const removeEmployment = (index) => {

        const employment = formData.employments[index];

        if (employment.id) {
            setRemovedEmployments((prev) => [...prev, employment.id]);
        }

        const updated = formData.employments.filter((_, i) => i !== index);

        setFormData({
            ...formData,
            employments: updated
        });
    };

    // service section
    const [services, setServices] = useState([]);
    // const [selectedServices, setSelectedServices] = useState(
    //     formData.bgvReqestService.map((s) => s.serviceId)
    // );
    const [selectedServices, setSelectedServices] = useState([]);
    const [originalServices, setOriginalServices] = useState([]);
    const [removedServices, setRemovedServices] = useState([]);
    const [serviceRequest, setServiceRequest] = useState([...data.bgvReqestService]);


    const fetchServices = async () => {
        try {

            // const user = JSON.parse(localStorage.getItem("user"));
            if (mode === 'edit') {

                const userDetails = await axiosInstance.get(`/auth/user/get/${data.submittedBy}`);

                const res = await axiosInstance.get(
                    `/client-service/getby/${userDetails?.data?.data?.client}`
                );
                const onlyservices = await res.data?.data.map((data) => data.service);
                setServices(onlyservices);
                // console.log('client services :', onlyservices);
            }
            // else if (mode === 'edit' && ['admin','superadmin'].includes(role)){
            //     setServiceRequest(data.)
            //     console.log('request services :', data.bgvReqestService);

            // }
            else {
                const onlyservices = data.bgvReqestService?.map((data) => data.services);
                // console.log('client services :',  data.bgvReqestService); 
                setServices(onlyservices);
                // setServices(data.bgvReqestService);
            }

        } catch (error) {
            console.error("Service fetch error", error);
        }
    };

    useEffect(() => {
        console.log('render data');
        // fetchSingleService();
        fetchServices();
        console.log("data:", data);
        const initial = formData.bgvReqestService.map((s) => s.serviceId);

        setSelectedServices(initial);
        setOriginalServices(initial);
    }, []);

    // const handleServiceChange = (serviceId) => {
    //     if (selectedServices.includes(serviceId)) {
    //         setSelectedServices(
    //             selectedServices.filter((id) => id !== serviceId)
    //         );

    //     } else {
    //         setSelectedServices([...selectedServices, serviceId]);
    //     }

    // };
    const handleServiceChange = (serviceId) => {
        if (selectedServices.includes(serviceId)) {
            // ❌ removing
            setSelectedServices(prev => prev.filter(id => id !== serviceId));

            // ✅ track removed ONLY if it was originally present
            if (originalServices.includes(serviceId)) {
                setRemovedServices(prev => [...new Set([...prev, serviceId])]);
            }

        } else {
            // ✅ adding
            setSelectedServices(prev => [...prev, serviceId]);

            // ❌ if re-added, remove from removedServices
            setRemovedServices(prev => prev.filter(id => id !== serviceId));
        }
    };
    console.log('formData:', formData);
    //Edit form submit section
    const submitForm = async () => {
        try {
            const fd = new FormData();

            // ✅ Append normal fields
            Object.keys(formData).forEach((key) => {
                if (
                    key !== "employments" &&
                    key !== "id_doc" &&
                    key !== "edu_doc"
                ) {
                    fd.append(key, formData[key] ?? "");
                }
            });

            fd.delete('clientId');
            fd.delete('submittedBy');
            fd.delete('updatedBy');
            fd.delete('createdAt');
            fd.delete('updatedAt');
            fd.delete('client');
            fd.delete('bgvReqestService');
            fd.delete('deletedAt');
            fd.delete('status');



            // ✅ Append single files (ONLY if new file selected)
            if (formData.id_doc instanceof File) {
                fd.append("id_doc", formData.id_doc);
            }

            if (formData.edu_doc instanceof File) {
                fd.append("edu_doc", formData.edu_doc);
            }

            // ✅ Append employments (JSON)
            const empWithoutFiles = formData.employments.map((emp) => ({
                id: emp.id,
                company_name: emp.company_name,
                employee_id: emp.employee_id,
                employment_start: emp.employment_start,
                employment_end: emp.employment_end,
                job_title: emp.job_title,
                leaving_reason: emp.leaving_reason,
                isCurrent: emp.isCurrent
            }));

            fd.append("bgvEmployments", JSON.stringify(empWithoutFiles));

            // ✅ Append employment files separately
            formData.employments.forEach((emp, index) => {
                if (emp.job_doc instanceof File) {
                    // if (key === "job_doc") {
                    // }
                    fd.append(`bgvEmployments[${index}][job_doc]`, emp.job_doc);
                    // fd.append(`job_doc_${index}`, emp.job_doc);
                }
            });
            // formData.employments.forEach((emp, index) => {

            //     Object.entries(emp).forEach(([key, value]) => {

            //         if (value === "" || value === null) return;

            //         if (key === "job_doc") {
            //             formData.append(`bgvEmployments[${index}][job_doc]`, value);
            //         }
            //         else {
            //             formData.append(`bgvEmployments[${index}][${key}]`, value);
            //         }

            //     })

            // });

            // ✅ removed employments
            fd.append("removeEmployments", JSON.stringify(removedEmployments));

            // ✅ services
            fd.append("addservice", JSON.stringify(
                selectedServices.filter(id => !originalServices.includes(id))
            ));

            fd.append("removeService", JSON.stringify(removedServices));
            for (let [key, value] of fd.entries()) {
                console.log(key, value);
            }
            // API call
            await axiosInstance.put("/bgvrequest/update", fd, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });

            // console.log("updated data:",fd);

            toast.success("Updated successfully");
        } catch (err) {
            console.error(err);
            toast.error("Update failed");
        }
    };




    // console.log('request services :', data.bgvReqestService);
    return (
        <div>
            <div className="form-container">
                <h2>BGV Request</h2>

                {/* Step Indicator */}
                {mode === "edit" && <div className="stepper">
                    <span className={step >= 1 ? "active" : ""}>Personal</span>
                    <span className={step >= 2 ? "active" : ""}>Identity</span>
                    <span className={step >= 3 ? "active" : ""}>Address</span>
                    <span className={step >= 4 ? "active" : ""}>Criminal Check</span>
                    <span className={step >= 5 ? "active" : ""}>Employment</span>
                    <span className={step >= 6 ? "active" : ""}>Education</span>
                    <span className={step >= 7 ? "active" : ""}>Service</span>
                    <span className={step >= 8 ? "active" : ""}>Review</span>
                </div>}

                {/* STEP 1 */}
                {step === 1 && (
                    <div className="form-step">
                        <h3>Personal Details</h3>

                        <input
                            type="text"
                            name="candidate_name"
                            value={formData.candidate_name || ""}
                            onChange={handleChange}
                            placeholder="Candidate Name"
                        />

                        <input
                            type="email"
                            name="candidate_email"
                            value={formData.candidate_email || ""}
                            onChange={handleChange}
                            placeholder="Email"
                        />

                        <input
                            type="text"
                            name="candidate_phone"
                            value={formData.candidate_phone || ""}
                            onChange={handleChange}
                            placeholder="Phone"
                        />

                        <input
                            type="text"
                            name="designation"
                            value={formData.designation || ""}
                            onChange={handleChange}
                            placeholder="Designation"
                        />

                        <input
                            name="department"
                            value={formData.department || ""}
                            placeholder="Department"
                            onChange={handleChange}
                        />

                    </div>
                )}

                {/* STEP 2 */}
                {step === 2 && (
                    <div className="form-step">

                        <h4>Identity Check</h4>

                        {/* <div className="form-grid"> */}
                        <input
                            name="id_type"
                            placeholder="ID Type"
                            value={formData.id_type || ""}
                            onChange={handleChange} />
                        <input
                            name="id_number"
                            placeholder="ID Number"
                            value={formData.id_number || ""}
                            onChange={handleChange}
                        />
                        <input type="file" name="id_doc" onChange={(e) =>
                            setFormData({
                                ...formData,
                                id_doc: e.target.files[0],
                            })
                        } />
                        {/* </div> */}
                        {formData.id_doc && (
                            typeof formData.id_doc === "string" ? (
                                <a
                                    href={`${base_url}/${formData.id_doc.replace(/\\/g, "/")}`}
                                    download
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="download-link"
                                >
                                    <span className="file-name">
                                        {formData.id_doc.split(/[\\/]/).pop()}
                                    </span>
                                </a>
                            ) : (
                                <span className="file-name">
                                    {formData.id_doc.name}
                                </span>
                            )
                        )}
                    </div>
                )}

                {step === 3 && (
                    <div className="form-step">
                        <h3>Address Details</h3>
                        <div className="address-card">

                            <h4>Current Address</h4>
                            <input
                                name="current_address"
                                value={formData.current_address || ""}
                                onChange={handleChange}
                                placeholder="Current Address"
                            />
                            <input name="current_landmark" placeholder="Landmark" value={formData.current_landmark || ""} onChange={handleChange} />
                            <input name="current_residency" placeholder="Residency Status" value={formData.current_residency || ""} onChange={handleChange} />
                            <input name="current_duration" placeholder="Duration of Stay" value={formData.current_duration || ""} onChange={handleChange} />

                            <h4>Permanent Address</h4>
                            <input
                                name="permanent_address"
                                value={formData.permanent_address || ""}
                                onChange={handleChange}
                                placeholder="Permanent Address"
                            />
                            <input name="permanent_landmark" placeholder="Landmark" value={formData.permanent_landmark || ""} onChange={handleChange} />
                            <input name="permanent_residency" placeholder="Residency Status" value={formData.permanent_residency || ""} onChange={handleChange} />
                            <input name="permanent_duration" placeholder="Duration of Stay" value={formData.permanent_duration || ""} onChange={handleChange} />
                        </div>

                    </div>
                )}
                {/* CRIMINAL */}
                {step === 4 && (
                    <div className="form-step">

                        <h4>Criminal Check</h4>

                        {/* <div className="form-grid"> */}
                        <input
                            name="father_name"
                            placeholder="Father Name"
                            value={formData.father_name || ""}
                            onChange={handleChange}
                        />
                        <input name="mother_name"
                            placeholder="Mother Name"
                            value={formData.mother_name || ""}
                            onChange={handleChange}
                        />
                        <input
                            name="gender"
                            placeholder="Gender"
                            value={formData.gender || ""}
                            onChange={handleChange}
                        />
                        <div htmlFor="" className="form-label">Date of birth</div>
                        <input
                            type="date"
                            // placeholder="Date of birth"
                            name="dob"
                            value={formData.dob || ""}
                            onChange={handleChange}
                        />
                        {/* </div> */}

                    </div>
                )}
                {/* STEP 5 */}
                {step === 5 && (
                    <div className="form-step">

                        <h3>Employment History</h3>

                        {formData.employments.map((emp, index) => (

                            <div key={index} className="employment-box">

                                <h4>Employment {index + 1}</h4>

                                <input
                                    name="company_name"
                                    value={emp.company_name || ""}
                                    onChange={(e) => handleEmploymentChange(index, e)}
                                    placeholder="Company Name"
                                />

                                <input
                                    name="employee_id"
                                    value={emp.employee_id || ""}
                                    onChange={(e) => handleEmploymentChange(index, e)}
                                    placeholder="Employee ID"
                                />

                                <input
                                    name="job_title"
                                    value={emp.job_title || ""}
                                    onChange={(e) => handleEmploymentChange(index, e)}
                                    placeholder="Job Title"
                                />
                                <div htmlFor="" className="form-label">Start Date</div>
                                <input
                                    type="date"
                                    name="employment_start"
                                    value={emp.employment_start || ""}
                                    onChange={(e) => handleEmploymentChange(index, e)}
                                />

                                {!emp.isCurrent && (
                                <div htmlFor="" className="form-label">End Date
                                    <input
                                        type="date"
                                        name="employment_end"
                                        min={emp.employment_start || ""}
                                        value={emp.employment_end || ""}
                                        onChange={(e) => handleEmploymentChange(index, e)}
                                    />
                                    </div>
                                )}

                                <input
                                    name="leaving_reason"
                                    value={emp.leaving_reason || ""}
                                    onChange={(e) => handleEmploymentChange(index, e)}
                                    placeholder="Reason for Leaving"
                                />

                        
                                <div htmlFor="" className="form-label">Payslip / Relieving letter</div>
                                <input
                                    type="file"
                                    onChange={(e) => handleEmploymentFile(index, e)}
                                />

                                {emp.job_doc && typeof emp.job_doc === "string" && (
                                    <a
                                        href={`${base_url}/${emp.job_doc.replace(/\\/g, "/")}`}
                                        download
                                        className="download-link"
                                    >
                                        {emp.job_doc.split(/[\\/]/).pop()}
                                    </a>
                                )}

                                <div className="current-check">
                                    <label>
                                        Currently work here
                                    </label>

                                    <div className="checkbox-box">
                                        <input
                                            type="checkbox"
                                            name="isCurrent"
                                            checked={emp.isCurrent || false}
                                            onChange={(e) => handleEmploymentChange(index, e)}
                                        />
                                    </div>
                                </div>


                                <div style={{
                                    display: 'flex',
                                    justifyContent: 'flex-end'
                                }}>
                                    <button
                                        type="button"
                                        className="remove-btn"
                                        onClick={() => removeEmployment(index)}
                                    >
                                        Remove
                                    </button>
                                </div>
                            </div>


                        ))}

                        <a
                            type="button"
                            className="add-emp"
                            onClick={addEmployment}
                        >
                            + Add Employment
                        </a>

                    </div>
                )}

                {/* STEP 6 */}
                {step === 6 && (
                    <div className="form-step">
                        <h3>Education</h3>

                        <input
                            name="institute_name"
                            value={formData.institute_name || ""}
                            onChange={handleChange}
                            placeholder="Institute"
                        />

                        <input
                            name="university"
                            value={formData.university || ""}
                            onChange={handleChange}
                            placeholder="University"
                        />

                        <input
                            name="qualification"
                            value={formData.qualification || ""}
                            onChange={handleChange}
                            placeholder="Qualification"
                        />

                        <input
                            name="specialization"
                            value={formData.specialization || ""}
                            onChange={handleChange}
                            placeholder="Specialization"
                        />
                        <div htmlFor="" className="form-label">Education Certificate</div>
                        <input
                            type="file"
                            name="edu_doc"
                            onChange={(e) =>
                                setFormData({
                                    ...formData,
                                    edu_doc: e.target.files[0],
                                })
                            }
                        />
                    </div>
                )}



                {/* STEP 7 */}
                {step === 7 && (
                    <div className="form-step">

                        <h3>Select Services</h3>

                        <div className="services-grid">

                            {services.map((service) => (

                                <label key={service.id} className="service-item">

                                    <input
                                        type="checkbox"
                                        checked={selectedServices.includes(service.id)}
                                        onChange={() => handleServiceChange(service.id)}
                                    />

                                    {service.name}

                                </label>

                            ))}

                        </div>

                    </div>
                )}
                {step === 8 && (
                    <div className="form-section">

                        <h3>Review Details</h3>

                        {/* PERSONAL */}
                        <div className="review-card">
                            <h4>Personal Details</h4>
                            <p><b>Name:</b> {formData.candidate_name}</p>
                            <p><b>Email:</b> {formData.candidate_email}</p>
                            <p><b>Phone:</b> {formData.candidate_phone}</p>
                            <p><b>Designation:</b> {formData.designation}</p>
                            <p><b>Department:</b> {formData.department}</p>
                        </div>

                        {/* IDENTITY */}
                        <div className="review-card">
                            <h4>Identity</h4>
                            <p><b>ID Type:</b> {formData.id_type}</p>
                            <p><b>ID Number:</b> {formData.id_number}</p>

                            {formData.id_doc && (
                                typeof formData.job_doc === "string" ? (
                                    <a
                                        href={`${base_url}/${formData.id_doc.replace(/\\/g, "/")}`}
                                        download
                                        className="download-link"
                                    >
                                        {formData.id_doc.split(/[\\/]/).pop()}
                                    </a>) : (
                                    <span className="file-name">
                                        {formData.id_doc.name}
                                    </span>
                                )

                            )}
                        </div>

                        {/* ADDRESS */}
                        <div className="review-card">
                            <h4>Address</h4>

                            <p><b>Current Address:</b> {formData.current_address}</p>
                            <p><b>Current Landmark:</b> {formData.current_landmark}</p>

                            <p><b>Permanent Address:</b> {formData.permanent_address}</p>
                            <p><b>Permanent Landmark:</b> {formData.permanent_landmark}</p>
                        </div>

                        {/* CRIMINAL */}
                        <div className="review-card">
                            <h4>Criminal Check</h4>
                            <p><b>Father Name:</b> {formData.father_name}</p>
                            <p><b>Mother Name:</b> {formData.mother_name}</p>
                            <p><b>Gender:</b> {formData.gender}</p>
                            <p><b>DOB:</b> {formData.dob}</p>
                        </div>

                        {/* EMPLOYMENT */}
                        <div className="review-card">
                            <h4>Employment History</h4>

                            {formData.employments.map((emp, index) => (
                                <div key={index} className="review-employment">

                                    <p><b>Company:</b> {emp.company_name}</p>
                                    <p><b>Employee ID:</b> {emp.employee_id}</p>
                                    <p><b>Job Title:</b> {emp.job_title}</p>
                                    <p><b>Start:</b> {emp.employment_start}</p>

                                    {emp.isCurrent ? (
                                        <p><b>Status:</b> Currently Working</p>
                                    ) : (
                                        <p><b>End:</b> {emp.employment_end}</p>
                                    )}

                                    <p><b>Reason:</b> {emp.leaving_reason}</p>
                                    {emp.job_doc && (
                                        typeof emp.job_doc === "string" ? (
                                            <a
                                                href={`${base_url}/${emp.job_doc.replace(/\\/g, "/")}`}
                                                download
                                                className="download-link"
                                            >
                                                {emp.job_doc.split(/[\\/]/).pop()}
                                            </a>
                                        ) : (
                                            <span className="file-name">
                                                {emp.job_doc.name}
                                            </span>
                                        )
                                    )}

                                </div>
                            ))}

                        </div>

                        {/* EDUCATION */}
                        <div className="review-card">
                            <h4>Education</h4>
                            <p><b>Institute:</b> {formData.institute_name}</p>
                            <p><b>University:</b> {formData.university}</p>
                            <p><b>Qualification:</b> {formData.qualification}</p>
                            <p><b>Specialization:</b> {formData.specialization}</p>
                            {formData.edu_doc && (
                                typeof formData.edu_doc === "string" ? (
                                    <a
                                        href={`${base_url}/${formData.edu_doc.replace(/\\/g, "/")}`}
                                        download
                                        className="download-link"
                                    >
                                        {formData.edu_doc.split(/[\\/]/).pop()}
                                    </a>) : (
                                    <span className="file-name">
                                        {formData.edu_doc.name}
                                    </span>
                                )

                            )}
                        </div>

                        {/* SERVICES */}
                        <div className="review-card">
                            <h4>Selected Services</h4>

                            {services
                                .filter((s) => selectedServices.includes(s.id))
                                .map((s) => (
                                    <p key={s.id}>✔ {s.name}</p>
                                ))}

                        </div>
                    </div>
                )}

                {/* Buttons */}
                <div className="btn-group">
                    {<button onClick={() => navigate('/bgv/list')}>back</button>}
                    {mode === 'edit' && (

                        <div className="right-btn">
                            {step > 1 && <button className="prev-btn" onClick={prev}>Previous</button>}
                            {step < 8 && <button className="next-btn" onClick={next}>Next</button>}
                            {step === 8 && <button className="update-btn" onClick={submitForm}>Update</button>}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default BGVViewEditRequestForm;