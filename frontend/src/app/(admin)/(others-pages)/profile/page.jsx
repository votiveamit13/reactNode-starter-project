"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

// ─── helpers ──────────────────────────────────────────────────────────────────

const formatDate = (dateString) => {
  if (!dateString) return "-";
  return new Date(dateString).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
};

const formatPhone = (phone) => {
  if (!phone) return "-";
  return phone.replace(/(\d{5})(\d{5})/, "$1 $2");
};

const getFileUrl = (filePath) => {
  if (!filePath) return null;

  const UPLOAD_URL = process.env.NEXT_PUBLIC_UPLOAD_URL;

  return `${UPLOAD_URL}${filePath}`;
};

// ─── main page ─────────────────────────────────────────────────────────────────

export default function Profile() {
  const API_URL = process.env.NEXT_PUBLIC_API_URL;
  const router = useRouter();

  const [employeeId, setEmployeeId] = useState(null);
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(true);
  const [employeeData, setEmployeeData] = useState(null);

  const [employee, setEmployee] = useState({});
  const [employment, setEmployment] = useState({});
  const [documents, setDocuments] = useState({});
  const [educations, setEducations] = useState([]);
  const [certifications, setCertifications] = useState([]);
  const [technicalSkills, setTechnicalSkills] = useState([]);
  const [compensation, setCompensation] = useState({
    monthly_salary: "",
    daily_salary: "",
    yearly_salary: "",
  });
  const [languagesInput, setLanguagesInput] = useState("");
  const [trainingText, setTrainingText] = useState("");
  const [profilePhoto, setProfilePhoto] = useState(null);

  // ─── fetch logged in user ───────────────────────────────────────────────────

  const fetchProfile = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${API_URL}/auth/profile`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data?.user?.employee_id) {
        setEmployeeId(data.user.employee_id);
      }
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  // ─── fetch employee details ─────────────────────────────────────────────────

  useEffect(() => {
    if (employeeId) {
      fetchEmployeeDetails();
    }
  }, [employeeId]);

  const fetchEmployeeDetails = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const res = await fetch(`${API_URL}/employees/${employeeId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();

      if (!res.ok) {
        toast.error(data.msg || "Failed to fetch employee details");
        return;
      }

      const emp = data.data;
      setEmployeeData(emp);

      setEmployee({
        first_name: emp.first_name,
        last_name: emp.last_name,
        gender: emp.gender,
        dob: emp.dob,
        marital_status: emp.marital_status,
        blood_group: emp.blood_group,
        nationality: emp.nationality,
        aadhaar_number: emp.aadhaar_number,
        pan_number: emp.pan_number,
        passport_number: emp.passport_number,
        personal_email: emp.personal_email,
        personal_phone: emp.personal_phone,
        employee_code: emp.employee_code,
      });

      setEmployment(emp.employment || {});
      setDocuments(emp.documents || {});
      setEducations(emp.educations || []);
      setCertifications(emp.certifications || []);
      setTechnicalSkills(emp.technicalSkills || []);
      setLanguagesInput((emp.languages || []).join(", "));
      setTrainingText(emp.training || "");

      if (emp.profile_photo) {
        setProfilePhoto(getFileUrl(emp.profile_photo));
      }

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
      toast.error("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const goToStep = (target) => setStep(target);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-500"></div>
      </div>
    );
  }

  if (!employeeData) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">Employee not found</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div className="bg-white p-5 rounded-2xl shadow flex justify-between items-center flex-wrap gap-4">
        <div>
          <h2 className="text-xl font-semibold">View Profile</h2>
          <p className="text-gray-500 text-sm mt-1">
            Employee Code: {employeeData.employee_code}
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => router.push(`/edit-profile`)}
            className="px-4 py-2 bg-brand-500 text-white rounded-lg hover:bg-brand-600 transition"
          >
            Edit Profile
          </button>
        </div>
      </div>

      {/* STEP NAV */}
      <div className="flex gap-2 width-100 overflow-auto">
        {["Basic", "Employment", "Documents", "Education", "Skills", "Compensation"].map(
          (label, i) => {
            const target = i + 1;
            const isActive = step === target;
            return (
              <button
                key={i}
                onClick={() => goToStep(target)}
                className={`px-4 py-2 rounded-lg text-sm flex items-center gap-1 ${
                  isActive
                    ? "bg-brand-500 text-white"
                    : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                }`}
              >
                {label}
              </button>
            );
          }
        )}
      </div>

      {/* FORM CARD */}
      <div className="bg-white p-6 rounded-2xl shadow">
        {/* Profile Photo */}
        <div className="flex justify-center mb-6">
          <div className="relative">
            {profilePhoto ? (
              <img
                src={profilePhoto}
                alt="Profile"
                className="w-24 h-24 rounded-full object-cover border-4 border-brand-100"
              />
            ) : (
              <div className="w-24 h-24 rounded-full bg-gradient-to-br from-brand-400 to-brand-600 flex items-center justify-center text-white text-3xl font-bold">
                {employee.first_name?.[0]}
                {employee.last_name?.[0]}
              </div>
            )}
          </div>
        </div>

        {/* ================= STEP 1 — BASIC ================= */}
        {step === 1 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            <div>
              <Label>First Name <span className="text-red-500">*</span></Label>
              <Input value={employee.first_name || "-"} disabled />
            </div>
            <div>
              <Label>Last Name <span className="text-red-500">*</span></Label>
              <Input value={employee.last_name || "-"} disabled />
            </div>
            <div>
              <Label>Full Name</Label>
              <Input
                value={`${employee.first_name || ""} ${employee.last_name || ""}`.trim() || "-"}
                disabled
              />
            </div>
            <div>
              <Label>Gender <span className="text-red-500">*</span></Label>
              <Input value={employee.gender || "-"} disabled />
            </div>
            <div>
              <Label>DOB <span className="text-red-500">*</span></Label>
              <Input value={formatDate(employee.dob)} disabled />
            </div>
            <div>
              <Label>Profile Photo</Label>
              {profilePhoto ? (
                <a href={profilePhoto} target="_blank" rel="noopener noreferrer" className="text-brand-500 text-sm">
                  View Photo →
                </a>
              ) : (
                <Input value="No photo uploaded" disabled />
              )}
            </div>
            <div>
              <Label>Marital Status</Label>
              <Input value={employee.marital_status || "-"} disabled />
            </div>
            <div>
              <Label>Blood Group</Label>
              <Input value={employee.blood_group || "-"} disabled />
            </div>
            <div>
              <Label>Nationality</Label>
              <Input value={employee.nationality || "-"} disabled />
            </div>
            <div>
              <Label>Aadhaar</Label>
              <Input value={employee.aadhaar_number || "-"} disabled />
            </div>
            <div>
              <Label>PAN</Label>
              <Input value={employee.pan_number || "-"} disabled />
            </div>
            <div>
              <Label>Passport</Label>
              <Input value={employee.passport_number || "-"} disabled />
            </div>
            <div>
              <Label>Email <span className="text-red-500">*</span></Label>
              <Input value={employee.personal_email || "-"} disabled />
            </div>
            <div>
              <Label>Phone <span className="text-red-500">*</span></Label>
              <Input value={formatPhone(employee.personal_phone)} disabled />
            </div>
          </div>
        )}

        {/* ================= STEP 2 — EMPLOYMENT ================= */}
        {step === 2 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            <div>
              <Label>Employee Code</Label>
              <Input value={employee.employee_code || "-"} disabled />
            </div>
            <div>
              <Label>Employment Type</Label>
              <Input value={employment.employment_type || "-"} disabled />
            </div>
            <div>
              <Label>Department</Label>
              <Input value={employment.department || "-"} disabled />
            </div>
            <div>
              <Label>Designation</Label>
              <Input value={employment.designation || "-"} disabled />
            </div>
            <div>
              <Label>Role Level</Label>
              <Input value={employment.role_level || "-"} disabled />
            </div>
            <div>
              <Label>Reporting Manager</Label>
              <Input value={employment.reporting_manager_id || "-"} disabled />
            </div>
            <div>
              <Label>Work Location</Label>
              <Input value={employment.work_location || "-"} disabled />
            </div>
            <div>
              <Label>Office Branch</Label>
              <Input value={employment.office_branch || "-"} disabled />
            </div>
            <div>
              <Label>Joining Date</Label>
              <Input value={formatDate(employment.joining_date)} disabled />
            </div>
            <div>
              <Label>Probation End Date</Label>
              <Input value={formatDate(employment.probation_end_date)} disabled />
            </div>
            <div>
              <Label>Confirmation Date</Label>
              <Input value={formatDate(employment.confirmation_date)} disabled />
            </div>
            <div>
              <Label>Employment Status</Label>
              <Input value={employment.employment_status || "-"} disabled />
            </div>
            <div>
              <Label>Exit Date</Label>
              <Input value={formatDate(employment.exit_date)} disabled />
            </div>
            <div>
              <Label>Exit Reason</Label>
              <Input value={employment.exit_reason || "-"} disabled />
            </div>
          </div>
        )}

        {/* ================= STEP 3 — DOCUMENTS ================= */}
        {step === 3 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
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
                {documents[key] ? (
                  <div className="flex items-center gap-3 mt-1">
                    <a
                      href={getFileUrl(documents[key])}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-brand-500 text-sm"
                    >
                      View →
                    </a>
                    <a
                      href={getFileUrl(documents[key])}
                      download
                      className="text-green-600 text-sm"
                    >
                      Download
                    </a>
                  </div>
                ) : (
                  <Input value="No file uploaded" disabled />
                )}
              </div>
            ))}
            <div>
              <Label>NDA Signed</Label>
              <Input value={documents.nda_signed ? "Yes" : "No"} disabled />
            </div>
          </div>
        )}

        {/* ================= STEP 4 — EDUCATION ================= */}
        {step === 4 && (
          <div className="space-y-6">
            <div>
              <Label>Education</Label>
              {educations.length === 0 ? (
                <p className="text-gray-400 text-sm">No education records.</p>
              ) : (
                educations.map((edu, i) => (
                  <div key={i} className="grid grid-cols-3 gap-4 mb-3 border p-3 rounded">
                    <Input value={edu.qualification || "-"} disabled />
                    <Input value={edu.university || "-"} disabled />
                    <Input value={edu.year || "-"} disabled />
                  </div>
                ))
              )}
            </div>
            <div>
              <Label>Certifications</Label>
              {certifications.length === 0 ? (
                <p className="text-gray-400 text-sm">No certifications.</p>
              ) : (
                certifications.map((cert, i) => (
                  <div key={i} className="grid grid-cols-3 gap-4 mb-3 border p-3 rounded">
                    <Input value={cert.name || "-"} disabled />
                    <Input value={formatDate(cert.start_date)} disabled />
                    <Input value={formatDate(cert.end_date)} disabled />
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* ================= STEP 5 — SKILLS ================= */}
        {step === 5 && (
          <div className="space-y-6">
            <div>
              <Label>Technical Skills</Label>
              {technicalSkills.length === 0 ? (
                <p className="text-gray-400 text-sm">No skills added.</p>
              ) : (
                technicalSkills.map((item, i) => (
                  <div key={i} className="grid grid-cols-2 gap-4 mb-3 border p-3 rounded">
                    <Input value={item.skill || "-"} disabled />
                    <Input value={item.level || "-"} disabled />
                  </div>
                ))
              )}
            </div>
            <div>
              <Label>Languages Known</Label>
              <Input value={languagesInput || "-"} disabled />
            </div>
            <div>
              <Label>Training History</Label>
              <textarea
                className="w-full border rounded-lg p-3 bg-gray-50 text-gray-600"
                rows={4}
                value={trainingText || "-"}
                disabled
              />
            </div>
          </div>
        )}

        {/* ================= STEP 6 — COMPENSATION ================= */}
        {step === 6 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            <div>
              <Label>Monthly Salary</Label>
              <Input value={compensation.monthly_salary || "-"} disabled />
            </div>
            <div>
              <Label>Daily Salary</Label>
              <Input value={compensation.daily_salary || "-"} disabled />
            </div>
            <div>
              <Label>Yearly Salary</Label>
              <Input value={compensation.yearly_salary || "-"} disabled />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── reusable components ──────────────────────────────────────────────────────

const Label = ({ children }) => (
  <label className="block text-sm font-medium text-gray-700 mb-1">
    {children}
  </label>
);

const Input = ({
  value,
  onChange,
  type = "text",
  placeholder,
  disabled,
  className = "",
}) => (
  <input
    type={type}
    value={value || ""}
    onChange={onChange}
    placeholder={placeholder}
    disabled={disabled}
    className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500 ${
      disabled ? "bg-gray-50 text-gray-600" : ""
    } ${className}`}
  />
);