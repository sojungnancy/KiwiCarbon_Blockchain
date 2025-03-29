"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import { FaBuilding, FaCoins } from "react-icons/fa";
import { MdSensors } from "react-icons/md";

interface Company {
  id: number;
  name: string;
  walletAddress: string | null;
  approved: boolean;
}

interface Sensor {
  id: number;
  companyId: number;
  createdAt: string;
  updatedAt: string;
  company?: Company;
}

export default function GovernmentDashboard() {
  const [activeTab, setActiveTab] = useState<"credits" | "companies" | "sensors">("credits");
  const [sidebarOpen, setSidebarOpen] = useState(true);

  // ------------------------------------------
  // 1) CREDITS TAB
  // ------------------------------------------
  const [availableCredits, setAvailableCredits] = useState("5000 CC");
  const [yourAddress] = useState("34xp4vRoCGJym3xR7yCVPfHoCnkx4Twseo");
  const [transferAddress, setTransferAddress] = useState("");
  const [transferAmount, setTransferAmount] = useState("");
  const [transferDescription, setTransferDescription] = useState("");
  const isDeducting = transferAmount.trim() !== "" && Number(transferAmount) < 0;

  const handleExecuteTransfer = () => {
    alert(
      `Transferring ${transferAmount} from ${yourAddress} to ${transferAddress}\nDescription: ${transferDescription}`,
    );
    setTransferAddress("");
    setTransferAmount("");
    setTransferDescription("");
  };

  // ------------------------------------------
  // 2) COMPANIES TAB
  // ------------------------------------------
  const [companies, setCompanies] = useState<Company[]>([]);
  const [loadingCompanies, setLoadingCompanies] = useState(true);

  // States for Edit Modal
  const [showEditCompanyModal, setShowEditCompanyModal] = useState(false);
  const [selectedCompany, setSelectedCompany] = useState<Company | null>(null);
  const [editCompanyName, setEditCompanyName] = useState("");
  const [editCompanyWallet, setEditCompanyWallet] = useState("");

  // Fetch companies
  const fetchCompanies = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("No token found in localStorage");
      const res = await axios.get("http://localhost:3001/api/companies", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCompanies(res.data);
      setLoadingCompanies(false);
    } catch (error) {
      console.error("Error fetching companies:", error);
    }
  };

  // Approve or unapprove a company
  const handleApproveCompany = async (companyId: number, currentApproved: boolean) => {
    try {
      const token = localStorage.getItem("token");
      await axios.put(
        `http://localhost:3001/api/companies/approve/${companyId}`,
        { approved: !currentApproved },
        { headers: { Authorization: `Bearer ${token}` } },
      );
      fetchCompanies();
    } catch (err) {
      console.error("Error approving company:", err);
    }
  };

  // Delete a company
  const handleDeleteCompany = async (companyId: number) => {
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`http://localhost:3001/api/companies/${companyId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchCompanies();
    } catch (err) {
      console.error("Error deleting company:", err);
    }
  };

  // Open the Edit modal
  const handleOpenEditModal = (company: Company) => {
    setSelectedCompany(company);
    setEditCompanyName(company.name);
    setEditCompanyWallet(company.walletAddress || "");
    setShowEditCompanyModal(true);
  };

  // Close the Edit modal
  const handleCloseEditModal = () => {
    setShowEditCompanyModal(false);
    setSelectedCompany(null);
  };

  // Submit the edited company details
  const handleUpdateCompany = async () => {
    if (!selectedCompany) return;
    try {
      const token = localStorage.getItem("token");
      await axios.put(
        `http://localhost:3001/api/companies/${selectedCompany.id}`,
        {
          name: editCompanyName,
          walletAddress: editCompanyWallet,
        },
        { headers: { Authorization: `Bearer ${token}` } },
      );
      // Close modal & refresh
      setShowEditCompanyModal(false);
      setSelectedCompany(null);
      fetchCompanies();
    } catch (err) {
      console.error("Error updating company:", err);
    }
  };

  // ------------------------------------------
  // 3) SENSORS TAB
  // ------------------------------------------
  const [sensors, setSensors] = useState<Sensor[]>([]);
  const [loadingSensors, setLoadingSensors] = useState(true);

  // State for "Add Sensor" form
  const [showAddSensorForm, setShowAddSensorForm] = useState(false);
  const [newSensorCompanyId, setNewSensorCompanyId] = useState("");

  const fetchSensors = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("No token found in localStorage");
      const res = await axios.get("http://localhost:3001/api/sensors", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSensors(res.data);
      setLoadingSensors(false);
    } catch (error) {
      console.error("Error fetching sensors:", error);
    }
  };

  const handleDeleteSensor = async (sensorId: number) => {
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`http://localhost:3001/api/sensors/${sensorId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchSensors();
    } catch (error) {
      console.error("Error deleting sensor:", error);
    }
  };

  // CREATE sensor
  const handleCreateSensor = async () => {
    try {
      if (!newSensorCompanyId) {
        alert("Please enter a valid company ID");
        return;
      }
      const token = localStorage.getItem("token");
      await axios.post(
        "http://localhost:3001/api/sensors",
        { companyId: parseInt(newSensorCompanyId, 10) },
        { headers: { Authorization: `Bearer ${token}` } },
      );
      setNewSensorCompanyId("");
      setShowAddSensorForm(false);
      fetchSensors();
    } catch (error) {
      console.error("Error creating sensor:", error);
    }
  };

  const handleEditSensor = async (sensorId: number) => {
    alert(`Open a modal or something to edit sensor #${sensorId}`);
  };

  // ------------------------------------------
  // LIFECYCLE
  // ------------------------------------------
  useEffect(() => {
    fetchCompanies();
    fetchSensors();
  }, []);

  // ------------------------------------------
  // RENDER
  // ------------------------------------------
  return (
    <div className="flex h-screen">
      {/* SIDEBAR */}
      <div
        className={`flex flex-col bg-white border-r p-4 transition-all duration-300 ${sidebarOpen ? "w-64" : "w-16"}`}
      >
        {/* Header / Logo */}
        <div className="flex flex-col mb-8">
          <div className="flex items-center gap-2">
            <img src="/kiwiLogo.svg" alt="CarbonKiwi Logo" className="h-7 w-auto" />
            {sidebarOpen && <span className="text-2xl font-bold text-emerald-600 whitespace-nowrap">CARBONKIWI</span>}
          </div>
          {sidebarOpen && <span className="text-sm text-gray-500 ml-9">GOV</span>}
        </div>

        {/* Navigation */}
        <nav className="flex flex-col space-y-2">
          <button
            onClick={() => setActiveTab("credits")}
            className={`flex items-center w-full text-left px-6 py-3 rounded hover:bg-gray-100 transition-colors ${
              activeTab === "credits" ? "bg-gray-100 text-emerald-600" : "text-gray-700"
            }`}
          >
            <div className="w-5 h-5 mr-2">
              <FaCoins />
            </div>
            {sidebarOpen && <span>Credits</span>}
          </button>

          <button
            onClick={() => setActiveTab("companies")}
            className={`flex items-center w-full text-left px-6 py-3 rounded hover:bg-gray-100 transition-colors ${
              activeTab === "companies" ? "bg-gray-100 text-emerald-600" : "text-gray-700"
            }`}
          >
            <div className="w-5 h-5 mr-2">
              <FaBuilding />
            </div>
            {sidebarOpen && <span>Companies</span>}
          </button>

          <button
            onClick={() => setActiveTab("sensors")}
            className={`flex items-center w-full text-left px-6 py-3 rounded hover:bg-gray-100 transition-colors ${
              activeTab === "sensors" ? "bg-gray-100 text-emerald-600" : "text-gray-700"
            }`}
          >
            <div className="w-5 h-5 mr-2">
              <MdSensors />
            </div>
            {sidebarOpen && <span>Sensors</span>}
          </button>
        </nav>
      </div>

      {/* MAIN CONTENT */}
      <div className="flex-grow p-4 md:p-6 bg-gray-50 overflow-auto">
        {/* CREDITS TAB */}
        {activeTab === "credits" && (
          <>
            <h2 className="text-3xl font-bold text-gray-800 mb-6">Carbon Credits Management</h2>
            <div className="bg-white p-4 rounded-lg shadow-md max-w-xl">
              <div className="flex flex-col space-y-4">
                <div className="flex items-center justify-between border-b pb-2">
                  <p className="font-semibold text-gray-700">Available Credit:</p>
                  <p className="text-emerald-600 font-bold">{availableCredits}</p>
                </div>
                <div className="flex items-center justify-between border-b pb-2">
                  <p className="font-semibold text-gray-700">Your Address:</p>
                  <p className="text-sm text-gray-700 truncate max-w-xs">{yourAddress}</p>
                </div>
                <div className="flex flex-col">
                  <label className="font-semibold text-gray-700 mb-1">Recipient Address</label>
                  <input
                    type="text"
                    placeholder="0x1234... or similar"
                    value={transferAddress}
                    onChange={e => setTransferAddress(e.target.value)}
                    className="border rounded p-2 bg-white focus:outline-none focus:ring-2 focus:ring-emerald-400"
                  />
                </div>
                <div className="flex flex-col">
                  <label className="font-semibold text-gray-700 mb-1">Amount</label>
                  <input
                    type="number"
                    placeholder="e.g. 100 (negative to remove)"
                    value={transferAmount}
                    onChange={e => setTransferAmount(e.target.value)}
                    className="border rounded p-2 bg-white focus:outline-none focus:ring-2 focus:ring-emerald-400"
                  />
                </div>
                <div className="flex flex-col">
                  <label className="font-semibold text-gray-700 mb-1">Description</label>
                  <textarea
                    placeholder="Optional description"
                    value={transferDescription}
                    onChange={e => setTransferDescription(e.target.value)}
                    className="border rounded p-2 bg-white focus:outline-none focus:ring-2 focus:ring-emerald-400"
                  />
                </div>
                {transferAmount && (
                  <p className={`text-sm font-semibold ${isDeducting ? "text-red-600" : "text-emerald-600"}`}>
                    You are {isDeducting ? "DEDUCTING" : "ADDING"} credits
                  </p>
                )}
                <button
                  onClick={handleExecuteTransfer}
                  className="bg-emerald-600 text-white px-6 py-3 rounded hover:bg-emerald-700 transition-colors"
                >
                  Execute
                </button>
              </div>
            </div>
          </>
        )}

        {/* COMPANIES TAB */}
        {activeTab === "companies" && (
          <>
            <h2 className="text-3xl font-bold text-gray-800 mb-6">Company Registry</h2>
            {loadingCompanies ? (
              <div>Loading companies...</div>
            ) : (
              <div className="bg-white p-4 rounded-lg shadow-md overflow-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">ID</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        Wallet Address
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {companies.map(company => (
                      <tr key={company.id}>
                        <td className="px-6 py-3 whitespace-nowrap text-sm text-gray-700">{company.id}</td>
                        <td className="px-6 py-3 whitespace-nowrap text-sm text-gray-700">{company.name}</td>
                        <td className="px-6 py-3 whitespace-nowrap text-sm text-gray-700">
                          {company.walletAddress || "N/A"}
                        </td>
                        <td className="px-6 py-3 whitespace-nowrap text-sm text-gray-700">
                          {company.approved ? (
                            <span className="text-emerald-600 font-bold">Approved</span>
                          ) : (
                            <span className="text-yellow-600 font-bold">Pending</span>
                          )}
                        </td>
                        <td className="px-6 py-3 whitespace-nowrap text-sm flex gap-2">
                          <button
                            onClick={() => handleApproveCompany(company.id, company.approved)}
                            className="bg-blue-100 text-blue-700 px-6 py-2 rounded hover:bg-blue-200"
                          >
                            {company.approved ? "Unapprove" : "Approve"}
                          </button>
                          <button
                            onClick={() => handleOpenEditModal(company)}
                            className="bg-green-100 text-green-700 px-6 py-2 rounded hover:bg-green-200"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDeleteCompany(company.id)}
                            className="bg-red-100 text-red-700 px-6 py-2 rounded hover:bg-red-200"
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </>
        )}

        {/* SENSORS TAB */}
        {activeTab === "sensors" && (
          <>
            <div className="text-lg font-bold  mb-6 flex justify-between items-center">
              <h2 className="text-3xl font-bold text-gray-800 ">Sensors Management</h2>
              <button
                onClick={() => setShowAddSensorForm(!showAddSensorForm)}
                className="bg-emerald-600 text-white px-6 py-3 rounded hover:bg-emerald-700 transition"
              >
                {showAddSensorForm ? "Cancel" : "Add Sensor"}
              </button>
            </div>

            {showAddSensorForm && (
              <div className="flex items-center gap-4 border p-4 rounded w-full mb-4">
                <div className="flex-grow">
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Company ID</label>
                  <div className="flex items-center gap-4 rounded w-full">
                    <input
                      type="number"
                      value={newSensorCompanyId}
                      onChange={e => setNewSensorCompanyId(e.target.value)}
                      className="border rounded px-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-emerald-400"
                      placeholder="e.g. 3"
                    />
                    <button
                      onClick={handleCreateSensor}
                      className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600 transition"
                    >
                      Create Sensor
                    </button>
                  </div>
                </div>
              </div>
            )}

            {loadingSensors ? (
              <div>Loading sensors...</div>
            ) : (
              <div className="bg-white p-4 rounded-lg shadow-md overflow-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Sensor ID</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Company ID</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Company Name</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Created At</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Updated At</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {sensors.map(sensor => (
                      <tr key={sensor.id}>
                        <td className="px-6 py-3 whitespace-nowrap text-sm text-gray-700">{sensor.id}</td>
                        <td className="px-6 py-3 whitespace-nowrap text-sm text-gray-700">{sensor.companyId}</td>
                        <td className="px-6 py-3 whitespace-nowrap text-sm text-gray-700">
                          {sensor.company ? sensor.company.name : "—"}
                        </td>
                        <td className="px-6 py-3 whitespace-nowrap text-sm text-gray-700">
                          {new Date(sensor.createdAt).toLocaleString()}
                        </td>
                        <td className="px-6 py-3 whitespace-nowrap text-sm text-gray-700">
                          {new Date(sensor.updatedAt).toLocaleString()}
                        </td>
                        <td className="px-6 py-3 whitespace-nowrap text-sm">
                          <button
                            onClick={() => handleDeleteSensor(sensor.id)}
                            className="bg-red-100 text-red-700 px-6 py-2 rounded hover:bg-red-200"
                          >
                            Delete
                          </button>
                          {/* If you want an Edit or Assign button, add it here */}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </>
        )}
      </div>

      {/* EDIT COMPANY MODAL */}
      {showEditCompanyModal && selectedCompany && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40">
          <div className="bg-white p-6 rounded shadow-md w-full max-w-sm">
            <h3 className="text-black text-xl font-bold mb-4">Edit Company #{selectedCompany.id}</h3>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Name</label>
            <input
              type="text"
              value={editCompanyName}
              onChange={e => setEditCompanyName(e.target.value)}
              className="bg-white text-black border rounded p-2 w-full mb-4 focus:outline-none focus:ring-2 focus:ring-emerald-400"
            />

            <label className="block text-sm font-semibold text-gray-700 mb-1">Wallet Address</label>
            <input
              type="text"
              value={editCompanyWallet}
              onChange={e => setEditCompanyWallet(e.target.value)}
              className="bg-white text-black  border rounded p-2 w-full mb-4 focus:outline-none focus:ring-2 focus:ring-emerald-400"
            />

            <div className="flex justify-end space-x-2">
              <button onClick={handleCloseEditModal} className="px-4 py-2 bg-gray-400 rounded hover:bg-gray-500">
                Cancel
              </button>
              <button
                onClick={handleUpdateCompany}
                className="px-4 py-2 bg-emerald-600 text-white rounded hover:bg-emerald-700"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
