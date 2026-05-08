"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import DatePicker from "@/components/form/date-picker";

const Label = ({ children }) => (
    <label className="block text-sm font-medium text-gray-700 mb-1">{children}</label>
);

const Input = ({ value, onChange, type = "text", placeholder, disabled, maxLength }) => (
    <input
        type={type}
        value={value || ""}
        onChange={onChange}
        placeholder={placeholder}
        disabled={disabled}
        maxLength={maxLength}
        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent disabled:bg-gray-100 disabled:text-gray-500"
    />
);

const Select = ({ value, options, onChange }) => (
    <select
        value={value || ""}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent"
    >
        <option value="">Select</option>
        {options.map((opt) => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
        ))}
    </select>
);

const getFileUrl = (filePath) => {
  if (!filePath) return null;

  const UPLOAD_URL = process.env.NEXT_PUBLIC_UPLOAD_URL;

  return `${UPLOAD_URL}${filePath}`;
};

export default function EditProfile() {
    const API_URL = process.env.NEXT_PUBLIC_API_URL;
    const router = useRouter();

    const [employeeId, setEmployeeId] = useState(null);
    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [photoUploading, setPhotoUploading] = useState(false);

    const photoInputRef = useRef(null);

    const [documents, setDocuments] = useState({});
    const [files, setFiles] = useState({
        resume: null, offer_letter: null, appointment_letter: null,
        nda_file: null, id_proof: null, address_proof: null,
    });

    const [employee, setEmployee] = useState({
        first_name: "", last_name: "", gender: "", dob: "",
        marital_status: "", blood_group: "", nationality: "",
        aadhaar_number: "", pan_number: "", passport_number: "",
        personal_email: "", personal_phone: "", employee_code: "",
        profile_photo: "",
    });

    const [employment, setEmployment] = useState({
        employment_type: "", department: "", designation: "", role_level: "",
        reporting_manager_id: "", work_location: "", office_branch: "",
        joining_date: "", probation_end_date: "", confirmation_date: "",
        employment_status: "", exit_date: "", exit_reason: "",
    });

    const [educations, setEducations] = useState([]);
    const [certifications, setCertifications] = useState([]);
    const [technicalSkills, setTechnicalSkills] = useState([]);
    const [compensation, setCompensation] = useState({ monthly_salary: "", daily_salary: "", yearly_salary: "" });
    const [languagesInput, setLanguagesInput] = useState("");
    const [trainingText, setTrainingText] = useState("");

    // Live preview of profile photo (local file blob or server URL)
    const [photoPreview, setPhotoPreview] = useState(null);

    // ─── fetch logged in user ───────────────────────────────────────────────────

    const fetchProfile = async () => {
        try {
            const token = localStorage.getItem("token");
            const res = await fetch(`${API_URL}/auth/profile`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            const data = await res.json();
            if (data?.user?.employee_id) setEmployeeId(data.user.employee_id);
        } catch (err) {
            console.log(err);
        }
    };

    useEffect(() => { fetchProfile(); }, []);

    // ─── fetch employee details ─────────────────────────────────────────────────

    useEffect(() => {
        if (!employeeId) return;

        const fetchEmployee = async () => {
            try {
                setLoading(true);
                const res = await fetch(`${API_URL}/employees/${employeeId}`, {
                    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
                });
                const responseData = await res.json();

                if (!responseData.success || !responseData.data) {
                    throw new Error(responseData.msg || "No employee data received");
                }

                const emp = responseData.data;

                setEmployee({
                    first_name: emp.first_name || "",
                    last_name: emp.last_name || "",
                    gender: emp.gender || "",
                    dob: emp.dob ? emp.dob.split("T")[0] : "",
                    profile_photo: emp.profile_photo || "",
                    marital_status: emp.marital_status || "",
                    blood_group: emp.blood_group || "",
                    nationality: emp.nationality || "",
                    aadhaar_number: emp.aadhaar_number || "",
                    pan_number: emp.pan_number || "",
                    passport_number: emp.passport_number || "",
                    personal_email: emp.personal_email || "",
                    personal_phone: emp.personal_phone || "",
                    employee_code: emp.employee_code || "",
                });

                // Set photo preview from server
                if (emp.profile_photo) {
                    setPhotoPreview(getFileUrl(emp.profile_photo));
                }

                if (emp.employment) {
                    setEmployment({
                        employment_type: emp.employment.employment_type || "",
                        department: emp.employment.department || "",
                        designation: emp.employment.designation || "",
                        role_level: emp.employment.role_level || "",
                        reporting_manager_id: emp.employment.reporting_manager_id?.toString() || "",
                        work_location: emp.employment.work_location || "",
                        office_branch: emp.employment.office_branch || "",
                        joining_date: emp.employment.joining_date ? emp.employment.joining_date.split("T")[0] : "",
                        probation_end_date: emp.employment.probation_end_date ? emp.employment.probation_end_date.split("T")[0] : "",
                        confirmation_date: emp.employment.confirmation_date ? emp.employment.confirmation_date.split("T")[0] : "",
                        employment_status: emp.employment.employment_status || "",
                        exit_date: emp.employment.exit_date ? emp.employment.exit_date.split("T")[0] : "",
                        exit_reason: emp.employment.exit_reason || "",
                    });
                }

                setEducations(emp.educations || []);
                setCertifications(
                    (emp.certifications || []).map((cert) => ({
                        ...cert,
                        start_date: cert.start_date ? cert.start_date.split("T")[0] : "",
                        end_date: cert.end_date ? cert.end_date.split("T")[0] : "",
                    }))
                );
                setTechnicalSkills(emp.technicalSkills || []);
                if (emp.languages?.length) setLanguagesInput(emp.languages.join(", "));
                setTrainingText(emp.training || "");
                setDocuments(emp.documents || {});

                const monthly = emp.salary ?? null;
                if (monthly !== null && monthly !== undefined && monthly !== "") {
                    const m = Number(monthly);
                    if (!isNaN(m)) {
                        setCompensation({
                            monthly_salary: String(m),
                            daily_salary: (m / 30).toFixed(2),
                            yearly_salary: (m * 12).toFixed(2),
                        });
                    }
                } else {
                    setCompensation({ monthly_salary: "", daily_salary: "", yearly_salary: "" });
                }
            } catch (err) {
                console.error("Error fetching employee:", err);
                toast.error("Failed to load employee data: " + err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchEmployee();
    }, [employeeId, API_URL]);

    const updateEmployeeField = (field, value) =>
        setEmployee((prev) => ({ ...prev, [field]: value }));

    // ─── dedicated photo upload ─────────────────────────────────────────────────

    const handlePhotoChange = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        // Show local preview immediately
        setPhotoPreview(URL.createObjectURL(file));

        // Upload to server right away
        handlePhotoUpload(file);
    };

    const handlePhotoUpload = async (file) => {
        try {
            setPhotoUploading(true);
            const formData = new FormData();
            formData.append("profile_photo", file);

            const res = await fetch(`${API_URL}/employees/photo/${employeeId}`, {
                method: "PUT",
                headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
                body: formData,
            });

            const data = await res.json();

            if (!res.ok) {
                toast.error(data.msg || "Photo upload failed");
                return;
            }

            // Update the stored path so the main submit also sends the right value
            setEmployee((prev) => ({ ...prev, profile_photo: data.profile_photo }));
            toast.success("Profile photo updated!");
        } catch (err) {
            toast.error("Network error uploading photo");
        } finally {
            setPhotoUploading(false);
        }
    };

    // ─── main submit ────────────────────────────────────────────────────────────

    const handleSubmit = async () => {
        setSubmitting(true);
        try {
            const bodyData = {
                employee: {
                    ...employee,
                    full_name: `${employee.first_name || ""} ${employee.last_name || ""}`.trim(),
                },
                dob: employee.dob ? new Date(employee.dob).toISOString().split("T")[0] : null,
                documents: {
                    nda_signed: documents.nda_signed,
                    resume: documents.resume || null,
                    offer_letter: documents.offer_letter || null,
                    appointment_letter: documents.appointment_letter || null,
                    nda_file: documents.nda_file || null,
                    id_proof: documents.id_proof || null,
                    address_proof: documents.address_proof || null,
                },
                employment,
                educations: educations.filter((e) => e.qualification),
                certifications: certifications.filter((c) => c.name),
                technicalSkills: technicalSkills.filter((s) => s.skill),
                salary: {
                    basic_salary: compensation.monthly_salary
                        ? Number(String(compensation.monthly_salary).replace(/,/g, ""))
                        : null,
                },
                languages: languagesInput.split(",").map((l) => l.trim()).filter(Boolean),
                training: trainingText,
            };

            const formData = new FormData();
            formData.append("data", JSON.stringify(bodyData));
            Object.entries(files).forEach(([key, file]) => {
                if (file) formData.append(key, file);
            });

            const res = await fetch(`${API_URL}/employees/update/${employeeId}`, {
                method: "PUT",
                headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
                body: formData,
            });

            const data = await res.json();
            if (!res.ok) {
                toast.error(data.msg || "Something went wrong");
                return;
            }

            toast.success("Updated Successfully");
            router.push("/profile");
        } catch (err) {
            toast.error("Network error. Please try again.");
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-[400px]">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-500"></div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="bg-white p-5 rounded-2xl shadow flex justify-between align-center">
                <div>
                    <h2 className="text-xl font-semibold">Edit Employee</h2>
                    <p className="text-sm text-gray-500 mt-1">
                        Editing: {employee.first_name} {employee.last_name} ({employee.employee_code})
                    </p>
                </div>
                <div>
                    <button
                        onClick={() => router.push(`/profile`)}
                        className="px-4 py-2 bg-brand-500 text-white rounded-lg hover:bg-brand-600 transition"
                    >
                        Back
                    </button>
                </div>
            </div>

            {/* Step Navigation */}
            <div className="flex gap-2 overflow-auto">
                {["Basic", "Employment", "Documents", "Education", "Skills", "Compensation"].map((label, i) => {
                    const target = i + 1;
                    const isActive = step === target;
                    return (
                        <button
                            key={i}
                            onClick={() => setStep(target)}
                            className={`px-4 py-2 rounded-lg text-sm whitespace-nowrap ${isActive ? "bg-brand-500 text-white" : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                                }`}
                        >
                            {label}
                        </button>
                    );
                })}
            </div>

            {/* Form Card */}
            <div className="bg-white p-6 rounded-2xl shadow">

                {/* ── Profile Photo Avatar (always visible) ── */}
                <div className="flex justify-center mb-8">
                    <div className="relative group">
                        {/* Avatar / Photo */}
                        {photoPreview ? (
                            <img
                                src={photoPreview}
                                alt="Profile"
                                className="w-24 h-24 rounded-full object-cover border-4 border-brand-100 shadow"
                            />
                        ) : (
                            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-brand-400 to-brand-600 flex items-center justify-center text-white text-3xl font-bold shadow">
                                {employee.first_name?.[0]}
                                {employee.last_name?.[0]}
                            </div>
                        )}

                        {/* Overlay edit button */}
                        <button
                            type="button"
                            onClick={() => photoInputRef.current?.click()}
                            disabled={photoUploading}
                            className="absolute inset-0 rounded-full flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                        >
                            {photoUploading ? (
                                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white" />
                            ) : (
                                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                        d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                        d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                                </svg>
                            )}
                        </button>

                        {/* Hidden file input */}
                        <input
                            ref={photoInputRef}
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={handlePhotoChange}
                        />
                    </div>

                    {/* Helper text */}
                    <div className="ml-4 flex flex-col justify-center">
                        <p className="text-sm font-medium text-gray-700">
                            {employee.first_name} {employee.last_name}
                        </p>
                        <button
                            type="button"
                            onClick={() => photoInputRef.current?.click()}
                            disabled={photoUploading}
                            className="text-xs text-brand-500 hover:underline mt-1 text-left"
                        >
                            {photoUploading ? "Uploading..." : "Change photo"}
                        </button>
                    </div>
                </div>

                {/* ================= STEP 1 — BASIC ================= */}
                {step === 1 && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        <div>
                            <Label>First Name *</Label>
                            <Input value={employee.first_name} onChange={(e) => updateEmployeeField("first_name", e.target.value)} />
                        </div>
                        <div>
                            <Label>Last Name *</Label>
                            <Input value={employee.last_name} onChange={(e) => updateEmployeeField("last_name", e.target.value)} />
                        </div>
                        <div>
                            <Label>Full Name</Label>
                            <Input value={`${employee.first_name || ""} ${employee.last_name || ""}`.trim()} disabled />
                        </div>
                        <div>
                            <Label>Gender *</Label>
                            <Select
                                value={employee.gender}
                                options={[
                                    { label: "Male", value: "Male" },
                                    { label: "Female", value: "Female" },
                                    { label: "Other", value: "Other" },
                                ]}
                                onChange={(v) => updateEmployeeField("gender", v)}
                            />
                        </div>
                        <div>
                            <Label>Date of Birth *</Label>
                            <DatePicker
                                key={employee.dob}
                                value={employee.dob}
                                onChange={(v) => updateEmployeeField("dob", v)}
                            />
                        </div>
                        <div>
                            <Label>Email *</Label>
                            <Input type="email" value={employee.personal_email} disabled />
                        </div>
                        <div>
                            <Label>Phone *</Label>
                            <Input
                                value={employee.personal_phone}
                                maxLength={10}
                                onChange={(e) => updateEmployeeField("personal_phone", e.target.value)}
                            />
                        </div>
                        <div>
                            <Label>Marital Status</Label>
                            <Select
                                value={employee.marital_status || ""}
                                options={[
                                    { label: "Single", value: "Single" },
                                    { label: "Married", value: "Married" },
                                    { label: "Divorced", value: "Divorced" },
                                    { label: "Widowed", value: "Widowed" },
                                ]}
                                onChange={(v) => updateEmployeeField("marital_status", v)}
                            />
                        </div>
                        <div>
                            <Label>Blood Group</Label>
                            <Input value={employee.blood_group} onChange={(e) => updateEmployeeField("blood_group", e.target.value)} />
                        </div>
                        <div>
                            <Label>Nationality</Label>
                            <Input value={employee.nationality} onChange={(e) => updateEmployeeField("nationality", e.target.value)} />
                        </div>
                        <div>
                            <Label>Aadhaar Number</Label>
                            <Input value={employee.aadhaar_number} maxLength={12} onChange={(e) => updateEmployeeField("aadhaar_number", e.target.value)} />
                        </div>
                        <div>
                            <Label>PAN Number</Label>
                            <Input
                                value={employee.pan_number}
                                maxLength={10}
                                onChange={(e) => updateEmployeeField("pan_number", e.target.value.toUpperCase())}
                            />
                        </div>
                        <div>
                            <Label>Passport Number</Label>
                            <Input value={employee.passport_number} onChange={(e) => updateEmployeeField("passport_number", e.target.value)} />
                        </div>
                    </div>
                )}

                {/* ================= STEP 2 — EMPLOYMENT ================= */}
                {step === 2 && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        <div><Label>Employee Code *</Label><Input value={employee.employee_code} disabled /></div>
                        <div><Label>Employment Type *</Label><Input value={employment.employment_type} disabled /></div>
                        <div><Label>Department *</Label><Input value={employment.department} disabled /></div>
                        <div><Label>Designation *</Label><Input value={employment.designation} disabled /></div>
                        <div><Label>Role Level</Label><Input value={employment.role_level} disabled /></div>
                        <div><Label>Reporting Manager</Label><Input value={employment.reporting_manager_id} disabled /></div>
                        <div><Label>Work Location *</Label><Input value={employment.work_location} disabled /></div>
                        <div><Label>Office Branch</Label><Input value={employment.office_branch} disabled /></div>
                        <div><Label>Joining Date *</Label><Input value={employment.joining_date} disabled /></div>
                        <div><Label>Probation End Date</Label><Input value={employment.probation_end_date} disabled /></div>
                        <div><Label>Confirmation Date</Label><Input value={employment.confirmation_date} disabled /></div>
                        <div><Label>Employment Status *</Label><Input value={employment.employment_status} disabled /></div>
                        <div><Label>Exit Date</Label><Input value={employment.exit_date} disabled /></div>
                        <div><Label>Exit Reason</Label><Input value={employment.exit_reason} disabled /></div>
                    </div>
                )}

                {/* ================= STEP 3 — DOCUMENTS ================= */}
                {step === 3 && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {[
                            { label: "Resume", key: "resume" },
                            { label: "Offer Letter", key: "offer_letter" },
                            { label: "Appointment Letter", key: "appointment_letter" },
                            { label: "NDA File", key: "nda_file" },
                            { label: "ID Proof", key: "id_proof" },
                            { label: "Address Proof", key: "address_proof" },
                        ].map(({ label, key }) => (
                            <div key={key}>
                                <Label>{label}</Label>
                                {documents[key] && (
                                    <div className="flex items-center gap-3 mb-2">
                                        <a href={getFileUrl(documents[key])} target="_blank" rel="noopener noreferrer" className="text-brand-500 text-xs">
                                            View existing →
                                        </a>
                                    </div>
                                )}
                                <input
                                    type="file"
                                    accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                                    onChange={(e) => {
                                        const file = e.target.files[0];
                                        if (file) setFiles((prev) => ({ ...prev, [key]: file }));
                                    }}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                                />
                                {files[key] && <p className="text-xs text-green-600 mt-1">✓ {files[key].name}</p>}
                            </div>
                        ))}
                        <div>
                            <Label>NDA Signed</Label>
                            <Select
                                value={documents.nda_signed ? "true" : "false"}
                                options={[
                                    { label: "Yes", value: "true" },
                                    { label: "No", value: "false" },
                                ]}
                                onChange={(v) => setDocuments((prev) => ({ ...prev, nda_signed: v === "true" }))}
                            />
                        </div>
                    </div>
                )}

                {/* ================= STEP 4 — EDUCATION ================= */}
                {step === 4 && (
                    <div className="space-y-6">
                        <div>
                            <div className="flex justify-between items-center mb-2">
                                <Label>Education</Label>
                                <button
                                    onClick={() => setEducations([...educations, { qualification: "", university: "", year: "" }])}
                                    className="text-sm text-blue-600"
                                >+ Add Education</button>
                            </div>
                            {educations.length === 0 && <p className="text-gray-400 text-sm">No education records.</p>}
                            {educations.map((edu, index) => (
                                <div key={index} className="grid grid-cols-3 gap-4 mb-3 border p-3 rounded">
                                    <Input placeholder="Qualification" value={edu.qualification || ""} onChange={(e) => { const c = [...educations]; c[index].qualification = e.target.value; setEducations(c); }} />
                                    <Input placeholder="University" value={edu.university || ""} onChange={(e) => { const c = [...educations]; c[index].university = e.target.value; setEducations(c); }} />
                                    <div className="flex gap-2">
                                        <Input placeholder="Year" value={edu.year || ""} maxLength={4} onChange={(e) => { const val = e.target.value.replace(/\D/g, "").slice(0, 4); const c = [...educations]; c[index].year = val; setEducations(c); }} />
                                        <button onClick={() => setEducations(educations.filter((_, i) => i !== index))} className="text-red-500">✕</button>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div>
                            <div className="flex justify-between items-center mb-2">
                                <Label>Certifications</Label>
                                <button onClick={() => setCertifications([...certifications, { name: "", start_date: "", end_date: "" }])} className="text-sm text-blue-600">+ Add Certification</button>
                            </div>
                            {certifications.length === 0 && <p className="text-gray-400 text-sm">No certifications.</p>}
                            {certifications.map((cert, index) => (
                                <div key={index} className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-3 border p-3 rounded">
                                    <Input placeholder="Certification Name" value={cert.name || ""} onChange={(e) => { const c = [...certifications]; c[index].name = e.target.value; setCertifications(c); }} />
                                    <DatePicker value={cert.start_date || ""} onChange={(val) => { const c = [...certifications]; c[index].start_date = val; setCertifications(c); }} />
                                    <div className="flex gap-2">
                                        <div className="flex-1">
                                            <DatePicker value={cert.end_date || ""} onChange={(val) => { const c = [...certifications]; c[index].end_date = val; setCertifications(c); }} />
                                        </div>
                                        <button onClick={() => setCertifications(certifications.filter((_, i) => i !== index))} className="text-red-500">✕</button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* ================= STEP 5 — SKILLS ================= */}
                {step === 5 && (
                    <div className="space-y-6">
                        <div>
                            <div className="flex justify-between items-center mb-2">
                                <Label>Technical Skills</Label>
                                <button onClick={() => setTechnicalSkills([...technicalSkills, { skill: "", level: "" }])} className="text-sm text-blue-600">+ Add Skill</button>
                            </div>
                            {technicalSkills.length === 0 && <p className="text-gray-400 text-sm">No skills.</p>}
                            {technicalSkills.map((item, index) => (
                                <div key={index} className="grid grid-cols-2 gap-4 mb-3 border p-3 rounded">
                                    <Input placeholder="Skill (e.g. React)" value={item.skill || ""} onChange={(e) => { const c = [...technicalSkills]; c[index].skill = e.target.value; setTechnicalSkills(c); }} />
                                    <div className="flex gap-2">
                                        <div className="flex-1">
                                            <Select
                                                value={item.level || ""}
                                                options={[
                                                    { label: "Beginner", value: "Beginner" },
                                                    { label: "Intermediate", value: "Intermediate" },
                                                    { label: "Expert", value: "Expert" },
                                                ]}
                                                onChange={(val) => { const c = [...technicalSkills]; c[index].level = val; setTechnicalSkills(c); }}
                                            />
                                        </div>
                                        <button onClick={() => setTechnicalSkills(technicalSkills.filter((_, i) => i !== index))} className="text-red-500">✕</button>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div>
                            <Label>Languages Known (comma separated)</Label>
                            <Input placeholder="e.g. English, Hindi" value={languagesInput} onChange={(e) => setLanguagesInput(e.target.value)} />
                        </div>
                        <div>
                            <Label>Training History</Label>
                            <textarea
                                className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-brand-500"
                                rows={4}
                                placeholder="Describe trainings..."
                                value={trainingText}
                                onChange={(e) => setTrainingText(e.target.value)}
                            />
                        </div>
                    </div>
                )}

                {/* ================= STEP 6 — COMPENSATION ================= */}
                {step === 6 && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        <div><Label>Monthly Salary</Label><Input value={compensation.monthly_salary || "-"} disabled /></div>
                        <div><Label>Daily Salary</Label><Input value={compensation.daily_salary || "-"} disabled /></div>
                        <div><Label>Yearly Salary</Label><Input value={compensation.yearly_salary || "-"} disabled /></div>
                    </div>
                )}

                {/* Navigation Buttons */}
                <div className="flex justify-between mt-6">
                    {step > 1 && (
                        <button onClick={() => setStep(step - 1)} className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300">
                            Back
                        </button>
                    )}
                    {step < 6 ? (
                        <button onClick={() => setStep(step + 1)} className="ml-auto px-4 py-2 bg-brand-500 text-white rounded-lg hover:bg-brand-600">
                            Next
                        </button>
                    ) : (
                        <button
                            onClick={handleSubmit}
                            disabled={submitting}
                            className="ml-auto px-4 py-2 bg-brand-500 text-white rounded-lg hover:bg-brand-600 disabled:opacity-50"
                        >
                            {submitting ? "Updating..." : "Update Employee"}
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}