import React, { useEffect, useState } from "react";
import api from "../../Config/Axios";
import { toast } from "react-hot-toast";
import { FaCalendarAlt } from "react-icons/fa";
import ConfirmationPopup from "../../component/CommonPages/ConfirmationPopup";

const AppointmentTable = () => {
  const [doctorId, setDoctorId] = useState(null);
  const [userData, setUserData] = useState(null);
  const [getPatientApp, setGetPatientApp] = useState([]);
  const [appointmentDataById, setAppointmentDataById] = useState(null);
  const [showPrescriptionForm, setShowPrescriptionForm] = useState(false);
  const [errors, setErrors] = useState({});
  const [showActionPopup, setShowActionPopup] = useState(false);
  const [actionId, setActionId] = useState(null);
  const [selectedAction, setSelectedAction] = useState(null);
  const [currentAction, setCurrentAction] = useState(null);
  const [loadingId,setLoadingId] = useState(null);

  const [formData, setFormData] = useState({
    firstName: "",
    gender: "",
    age: "",
    mobNumber: "",
    healthIssue: "",
    address: "",
    appDate: "",
    time: "",
    roomNum: "",
    doctorNote: "",
    followUp: "",
    medicines: [{ name: "", dosage: "" }],
  });

  useEffect(() => {
    fetchUser();
  }, []);

  useEffect(() => {
    if (doctorId) fetchAppointment();
  }, [doctorId]);

  const fetchUser = async () => {
    try {
      const response = await api.get("/api/auth/getMyProfile");
      setDoctorId(response.data.data._id);
      setUserData(response.data.data);
    } catch (error) {
      toast.error("Something went wrong");
    }
  };

  const fetchAppointment = async () => {
    try {
      const response = await api.get(
        `/api/doctorAppointment/getAppointmentByDoctor/${doctorId}`,
      );
      console.log("88989",response.data);
      setGetPatientApp(response.data);
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong");
    }
  };

  const fetchAppointmentById = async (id) => {
    if (!id) return;
    try {
      const res = await api.get(
        `/api/appointmentPatient/getAppointmentById/${id}`,
      );
      const data = res.data.data;
      setAppointmentDataById(data);
      setFormData({
        firstName: data.firstName || "",
        gender: data.gender || "",
        age: data.age || "",
        mobNumber: data.mobNumber || "",
        healthIssue: data.healthIssue || "",
        address: data.address || "",
        appDate: data.appDate?.split("T")[0] || "",
        time: data.time || "",
        roomNum: data.roomNum || "",
        doctorNote: "",
        followUp: "",
        medicines: [{ name: "", dosage: "" }],
      });
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong!");
    }
  };

  const handleAction = (id, actionType) => {
    setActionId(id);
    setSelectedAction(actionType);
    setCurrentAction(actionType);

    if (actionType === "accepted") {
      const item = getPatientApp.find((a) => a._id === id);
      fetchAppointmentById(id);
      setShowPrescriptionForm(true);
    } else {
      setShowActionPopup(true);
    }
  };

  const handleActionConfirm = async () => {
    try {
      setLoadingId(actionId);
      await api.put(
        `/api/doctorAppointment/toggleAppointmentStatus/${actionId}`,
        { bookingStatus: selectedAction },
      );
      toast.success(`Appointment ${selectedAction} successfully`);
      fetchAppointment();
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong");
    }
    setLoadingId(null);
    setShowActionPopup(false);
  };

  const handleActionCancel = () => setShowActionPopup(false);
  const handleActionCross = () => setShowActionPopup(false);

  // Label for popup heading
  const nextAction = currentAction === "accepted" ? "Accept" : "Reject";

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleAddMedicine = () => {
    setFormData((prev) => ({
      ...prev,
      medicines: [...prev.medicines, { name: "", dosage: "" }],
    }));
  };

  const handleRemoveMedicine = (index) => {
    if (formData.medicines.length === 1) return;
    setFormData((prev) => ({
      ...prev,
      medicines: prev.medicines.filter((_, i) => i !== index),
    }));
  };

  const handleMedicineChange = (index, field, value) => {
    const updated = [...formData.medicines];
    updated[index][field] = value;
    setFormData((prev) => ({ ...prev, medicines: updated }));
    setErrors((prev) => ({ ...prev, medicines: "" }));
  };

  const handleSubmitPrescription = async () => {
    let newErrors = {};
    if (!formData.doctorNote.trim())
      newErrors.doctorNote = "Please enter doctor's note";
    if (formData.medicines.some((m) => !m.name.trim() || !m.dosage.trim()))
      newErrors.medicines = "Please fill all medicine name and dosage fields";
    if (!formData.followUp.trim())
      newErrors.followUp = "Please enter follow up";

    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;

    try {
      await api.put(
        `/api/doctorAppointment/submitPrescription/${appointmentDataById._id}`,
        {
          doctorNote: formData.doctorNote,
          medicines: formData.medicines,
          followUp: formData.followUp,
          bookingStatus: "accepted",
        },
      );
      toast.success("Prescription submitted successfully");
      setShowPrescriptionForm(false);
      fetchAppointment();
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong");
    }
  };

const handleGenerateReport = async (id) => {
  try {
    setLoadingId(id);
    await api.post(`/api/doctorAppointment/generateReport/${id}`);

    toast.success("Report sent to patient email");
    fetchAppointment();
  } catch (error) {
    toast.error("Failed to send report");
  } finally {
    setLoadingId(null); 
  }
};


  return (
    <div className="min-h-screen">
      {showActionPopup && (
        <ConfirmationPopup
          heading={`Confirm ${nextAction} Appointment`}
          handleCancel={handleActionCancel}
          handleConfirm={handleActionConfirm}
          handleCross={handleActionCross}
          currentAction={currentAction}
          message={`Are you sure you want to ${nextAction} this appointment?`}
          loading={loadingId}
        />
      )}

      <div className="mb-10 text-left">
        <h2 className="text-2xl font-semibold bg-gradient-to-r from-[#00304e] to-[#005f73] bg-clip-text text-transparent">
          Patient Appointments
        </h2>
        <p className="text-gray-600 mt-1 text-md">
          View and manage scheduled patient appointments.
        </p>
      </div>

     
      <div className="overflow-x-auto rounded-md border border-gray-200">
        <table className="min-w-[750px] w-full border-collapse text-sm">
          <thead className="bg-[#00304e] text-white">
            <tr>
              <th className="px-3 py-3 text-left">Department</th>
              <th className="px-3 py-3 text-left">Patient Name</th>
              <th className="px-3 py-3 text-left">DOB</th>
              <th className="px-3 py-3 text-left">Gender</th>
              <th className="px-3 py-3 text-left">Time</th>
              <th className="px-3 py-3 text-left">Date</th>
              <th className="px-3 py-3 text-left">Health Issue</th>
              <th className="px-3 py-3 text-left">Status</th>
              <th className="px-3 py-3 text-left">Action</th>
            </tr>
          </thead>

          {getPatientApp.length !== 0 ? (
            <tbody>
              {getPatientApp.map((item, index) => (
                <tr key={index} className="border-t hover:bg-gray-50">
                  <td className="px-3 py-3">{item.department?.department}</td>
                  <td className="px-3 py-3">{item.firstName}</td>
                  <td className="px-3 py-3">{item.dob.substring(0, 10)}</td>
                  <td className="px-3 py-3">{item.gender}</td>
                  <td className="px-3 py-3">{item.time}</td>
                  <td className="px-3 py-3">{item.appDate.substring(0, 10)}</td>
                  <td className="px-3 py-3">{item.healthIssue}</td>

                  <td className="px-3 py-3">
                    {item.bookingStatus === "pending" && (
                      <span className="px-2 py-1 text-xs bg-yellow-100 text-yellow-700 rounded">
                        Pending
                      </span>
                    )}
                    {item.bookingStatus === "accepted" && (
                      <span className="px-2 py-1 text-xs bg-green-100 text-green-700 rounded">
                        Accepted
                      </span>
                    )}
                    {item.bookingStatus === "rejected" && (
                      <span className="px-2 py-1 text-xs bg-red-100 text-red-700 rounded">
                        Rejected
                      </span>
                    )}
                  </td>

                 <td className="px-3 py-3">
  {item.bookingStatus === "accepted" ? (
    <div className="flex gap-2">
      <button className="px-3 py-1.5 text-xs bg-green-500 text-white rounded-lg opacity-70 cursor-not-allowed">
        Accepted
      </button>

     <button
  onClick={() => handleGenerateReport(item._id)}
  disabled={item.reportSent || loadingId === item._id}
  className={`px-3 py-1.5 text-xs text-white rounded-lg 
    ${item.reportSent || loadingId === item._id
      ? "bg-gray-400 cursor-not-allowed"
      : "bg-blue-500 hover:bg-blue-600"}
  `}
>
  {loadingId === item._id
    ? "Sending..."
    : item.reportSent
    ? "Report Sent"
    : "Generate Report"}
</button>
    </div>
  ) : item.bookingStatus === "rejected" ? (
    <button className="px-4 py-1.5 text-xs bg-red-500 text-white rounded-lg opacity-70 cursor-not-allowed">
      Rejected
    </button>
  ) : (
    <div className="flex gap-2">
      <button
        onClick={() => handleAction(item._id, "accepted")}
        className="px-3 py-1.5 text-xs bg-green-500 text-white rounded-lg hover:bg-green-600"
      >
        Accept
      </button>
      <button
        onClick={() => handleAction(item._id, "rejected")}
        className="px-3 py-1.5 text-xs bg-red-500 text-white rounded-lg hover:bg-red-600"
      >
        Reject
      </button>
    </div>
  )}
</td>
                </tr>
              ))}
            </tbody>
          ) : (
            <tbody>
              <tr>
                <td colSpan="9" className="py-10 text-center">
                  <div className="flex flex-col items-center justify-center">
                    <div className="bg-gray-100 p-4 rounded-full mb-4">
                      <FaCalendarAlt className="text-3xl text-gray-400" />
                    </div>
                    <p className="text-gray-500 text-sm">
                      No appointments scheduled yet.
                    </p>
                  </div>
                </td>
              </tr>
            </tbody>
          )}
        </table>
      </div>

      {showPrescriptionForm && appointmentDataById && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm z-1999 flex items-center justify-center px-4">
          <div className="bg-white rounded-2xl w-full max-w-md shadow-xl overflow-hidden">
            <div className="bg-gradient-to-r from-[#00304e] to-[#005f73] px-5 py-4 flex items-center justify-between">
              <div>
                <h2 className="text-white font-medium text-base">
                  Write Prescription
                </h2>
                <p className="text-white/50 text-[11px] mt-0.5">
                  Patient: {formData.firstName} &nbsp;·&nbsp;{" "}
                  {appointmentDataById.department?.department}
                </p>
              </div>
              <button
                onClick={() => setShowPrescriptionForm(false)}
                className="text-white/60 hover:text-white text-xl cursor-pointer leading-none"
              >
                ×
              </button>
            </div>

            <div className="p-5 space-y-5 max-h-[85vh] overflow-y-auto">
              <div>
                <p className="text-[10px] text-gray-400 uppercase tracking-widest mb-2">
                  Patient Info
                </p>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    ["Patient Name", "firstName"],
                    ["Gender", "gender"],
                    ["Age", "age"],
                    ["Mobile", "mobNumber"],
                    ["Health Issue", "healthIssue"],
                    ["Address", "address"],
                  ].map(([label, key]) => (
                    <div key={key} className="flex flex-col gap-1">
                      <label className="text-[10px] text-gray-400 uppercase tracking-wide px-1">
                        {label}
                      </label>
                      <input
                        readOnly
                        value={formData[key]}
                        className="w-full text-xs text-gray-700 font-medium bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 focus:outline-none cursor-default"
                      />
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <p className="text-[10px] text-gray-400 uppercase tracking-widest mb-2">
                  Appointment Info
                </p>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    ["Date", "appDate"],
                    ["Time", "time"],
                    ["Room", "roomNum"],
                  ].map(([label, key]) => (
                    <div key={key} className="flex flex-col gap-1">
                      <label className="text-[10px] text-gray-400 uppercase tracking-wide px-1">
                        {label}
                      </label>
                      <input
                        readOnly
                        value={formData[key]}
                        className="w-full text-xs text-[#00304e] font-medium bg-[#00304e]/5 border border-[#00304e]/10 rounded-xl px-3 py-2 focus:outline-none cursor-default text-center"
                      />
                    </div>
                  ))}
                </div>
              </div>

              <div className="border-t border-dashed border-gray-200" />

              <div className="flex flex-col gap-1">
                <label className="text-[10px] text-gray-400 uppercase tracking-widest px-1">
                  Doctor's Note
                </label>
                <textarea
                  rows={3}
                  name="doctorNote"
                  value={formData.doctorNote}
                  onChange={handleChange}
                  placeholder="Write your observation or note for the patient..."
                  className="w-full text-xs text-gray-700 bg-gray-50 border border-gray-200 rounded-xl px-3 py-2.5 resize-none focus:outline-none focus:border-[#005f73] placeholder-gray-300"
                />
                {errors.doctorNote && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.doctorNote}
                  </p>
                )}
              </div>

              <div>
                <label className="text-[10px] text-gray-400 uppercase tracking-widest mb-2 block px-1">
                  Prescription / Medicines
                </label>
                <div className="space-y-2">
                  {formData.medicines.map((med, index) => (
                    <div key={index} className="flex gap-2 items-center">
                      <span className="text-[10px] text-gray-300 font-medium w-4 shrink-0 text-center">
                        {index + 1}.
                      </span>
                      <input
                        type="text"
                        placeholder="Medicine name"
                        value={med.name}
                        onChange={(e) =>
                          handleMedicineChange(index, "name", e.target.value)
                        }
                        className="flex-1 text-xs text-gray-700 bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 focus:outline-none focus:border-[#005f73] placeholder-gray-300"
                      />
                      <input
                        type="text"
                        placeholder="Dosage"
                        value={med.dosage}
                        onChange={(e) =>
                          handleMedicineChange(index, "dosage", e.target.value)
                        }
                        className="w-24 text-xs text-gray-700 bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 focus:outline-none focus:border-[#005f73] placeholder-gray-300"
                      />
                      <button
                        onClick={() => handleRemoveMedicine(index)}
                        className="w-7 h-7 flex cursor-pointer items-center justify-center rounded-xl bg-red-50 border border-red-100 text-red-400 hover:bg-red-100 text-sm shrink-0"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                  {errors.medicines && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors.medicines}
                    </p>
                  )}
                </div>
                <button
                  onClick={handleAddMedicine}
                  className="mt-2 w-full cursor-pointer py-2 rounded-xl border border-dashed border-gray-200 text-xs text-gray-400 hover:border-[#005f73] hover:text-[#005f73] transition-colors"
                >
                  + Add Medicine
                </button>
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-[10px] text-gray-400 uppercase tracking-widest px-1">
                  Follow-up Instructions
                </label>
                <textarea
                  rows={2}
                  name="followUp"
                  value={formData.followUp}
                  onChange={handleChange}
                  placeholder="e.g. Get ECG done before next visit..."
                  className="w-full text-xs text-gray-700 bg-gray-50 border border-gray-200 rounded-xl px-3 py-2.5 resize-none focus:outline-none focus:border-[#005f73] placeholder-gray-300"
                />
                {errors.followUp && (
                  <p className="text-red-500 text-xs mt-1">{errors.followUp}</p>
                )}
              </div>

              <div className="flex gap-2 pt-1">
                <button
                  onClick={() => setShowPrescriptionForm(false)}
                  className="flex-1 py-2.5 cursor-pointer rounded-xl border border-gray-200 text-xs text-gray-500 hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSubmitPrescription}
                  className="flex-1 py-2.5 cursor-pointer rounded-xl bg-[#00304e] text-white text-xs font-medium hover:bg-[#005f73] transition-colors"
                >
                  Submit Prescription
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AppointmentTable;
