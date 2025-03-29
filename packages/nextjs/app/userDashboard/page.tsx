"use client";

import React, { useState } from "react";
import { CategoryScale, Chart as ChartJS, Legend, LineElement, LinearScale, PointElement, Tooltip } from "chart.js";
import { Line } from "react-chartjs-2";
import { FaChartLine, FaExchangeAlt, FaHome, FaTrophy } from "react-icons/fa";

ChartJS.register(LineElement, CategoryScale, LinearScale, PointElement, Tooltip, Legend);

export default function Dashboard() {
  // State to manage which tab (page) is active
  const [activeTab, setActiveTab] = useState<"overview" | "emissionData" | "nationalRanking" | "transfer">("overview");

  // State to manage whether the sidebar is open or collapsed
  const [sidebarOpen, setSidebarOpen] = useState(true);

  // -----------------------------
  // 1) CHART TIMEFRAME SELECTION
  // -----------------------------
  const [selectedRange, setSelectedRange] = useState<"1D" | "5D" | "1M" | "6M" | "1Y">("1D");

  // Predefined chart data for each timeframe (you can replace with real data)
  const chartDataRanges = {
    "1D": {
      labels: ["0", "1", "2", "3", "4", "5", "6", "7"],
      datasets: [
        {
          label: "Emission Data (1D)",
          data: [50, 70, 45, 90, 40, 60, 30, 75],
          borderColor: "#10B981",
          backgroundColor: "rgba(16, 185, 129, 0.2)",
          tension: 0.3,
          pointRadius: 4,
          pointHoverRadius: 6,
        },
      ],
    },
    "5D": {
      labels: ["Mon", "Tue", "Wed", "Thu", "Fri"],
      datasets: [
        {
          label: "Emission Data (5D)",
          data: [200, 300, 250, 320, 270],
          borderColor: "#10B981",
          backgroundColor: "rgba(16, 185, 129, 0.2)",
          tension: 0.3,
          pointRadius: 4,
          pointHoverRadius: 6,
        },
      ],
    },
    "1M": {
      labels: ["Wk1", "Wk2", "Wk3", "Wk4"],
      datasets: [
        {
          label: "Emission Data (1M)",
          data: [1200, 900, 1500, 1300],
          borderColor: "#10B981",
          backgroundColor: "rgba(16, 185, 129, 0.2)",
          tension: 0.3,
          pointRadius: 4,
          pointHoverRadius: 6,
        },
      ],
    },
    "6M": {
      labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
      datasets: [
        {
          label: "Emission Data (6M)",
          data: [4000, 3800, 4200, 4100, 4300, 4500],
          borderColor: "#10B981",
          backgroundColor: "rgba(16, 185, 129, 0.2)",
          tension: 0.3,
          pointRadius: 4,
          pointHoverRadius: 6,
        },
      ],
    },
    "1Y": {
      labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
      datasets: [
        {
          label: "Emission Data (1Y)",
          data: [4000, 4200, 3900, 4300, 4700, 5000, 4800, 4600, 4400, 5200, 5500, 6000],
          borderColor: "#10B981",
          backgroundColor: "rgba(16, 185, 129, 0.2)",
          tension: 0.3,
          pointRadius: 4,
          pointHoverRadius: 6,
        },
      ],
    },
  };

  // -----------------------------
  // 2) EMISSION DATA TABLE
  // -----------------------------
  const emissionDataTable = [
    {
      date: "2025-03-21",
      source: "Plant #42",
      emissionType: "CO₂",
      amount: "150 kg",
      location: "Wellington, NZ",
      creditsApplied: "200 CC",
      netEmission: "-50 kg CO₂",
      status: "Verified",
    },
    {
      date: "2025-03-20",
      source: "Auckland Transport",
      emissionType: "CH₄",
      amount: "80 kg",
      location: "Auckland, NZ",
      creditsApplied: "100 CC",
      netEmission: "-20 kg CH₄",
      status: "Pending",
    },
    {
      date: "2025-03-19",
      source: "Christchurch Factory",
      emissionType: "CO₂",
      amount: "200 kg",
      location: "Christchurch, NZ",
      creditsApplied: "150 CC",
      netEmission: "50 kg CO₂",
      status: "Verified",
    },
    {
      date: "2025-03-18",
      source: "Hamilton Warehouse",
      emissionType: "N₂O",
      amount: "30 kg",
      location: "Hamilton, NZ",
      creditsApplied: "20 CC",
      netEmission: "10 kg N₂O",
      status: "Verified",
    },
    {
      date: "2025-03-17",
      source: "Dunedin Plant",
      emissionType: "CO₂",
      amount: "120 kg",
      location: "Dunedin, NZ",
      creditsApplied: "50 CC",
      netEmission: "70 kg CO₂",
      status: "Pending",
    },
  ];

  // -----------------------------
  // 3) NATIONAL RANKING TABLE
  // -----------------------------
  const rankingData = [
    {
      rank: "#1",
      entity: "Wellington Energy Co.",
      totalEmissions: "1,200 kg CO₂",
      carbonCredits: "600 CC",
      netEmission: "600 kg CO₂",
      status: "Compliant",
    },
    {
      rank: "#2",
      entity: "Auckland Plant",
      totalEmissions: "950 kg CO₂",
      carbonCredits: "500 CC",
      netEmission: "450 kg CO₂",
      status: "Pending",
    },
    {
      rank: "#3",
      entity: "Christchurch Factory",
      totalEmissions: "800 kg CO₂",
      carbonCredits: "400 CC",
      netEmission: "400 kg CO₂",
      status: "Compliant",
    },
    {
      rank: "#4",
      entity: "Hamilton Transport",
      totalEmissions: "700 kg CO₂",
      carbonCredits: "350 CC",
      netEmission: "350 kg CO₂",
      status: "Non-compliant",
    },
    {
      rank: "#5",
      entity: "Dunedin Industrial",
      totalEmissions: "650 kg CO₂",
      carbonCredits: "200 CC",
      netEmission: "450 kg CO₂",
      status: "Pending",
    },
  ];

  // -----------------------------
  // 4) TRANSFER PAGE (CREDITS)
  // -----------------------------
  const [availableCredits, setAvailableCredits] = useState("2500 CC");
  const [yourAddress] = useState("34xp4vRoCGJym3xR7yCVPfHoCnkx4Twseo");
  const [transferAddress, setTransferAddress] = useState("");
  const [transferAmount, setTransferAmount] = useState("");
  const [transferDescription, setTransferDescription] = useState("");

  // Detect whether the user is adding or deducting credits
  const isDeducting = transferAmount.trim() !== "" && Number(transferAmount) < 0;

  // Handle "Execute" button click
  const handleExecuteTransfer = () => {
    // This is where you’d integrate your actual transfer logic
    alert(
      `Transferring ${transferAmount} from ${yourAddress} to ${transferAddress}\nDescription: ${transferDescription}`,
    );
    // Reset fields
    setTransferAddress("");
    setTransferAmount("");
    setTransferDescription("");
  };

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <div
        className={`flex flex-col bg-white border-r p-4 transition-all duration-300 ${sidebarOpen ? "w-64" : "w-16"}`}
      >
        {/* Header / Logo + Toggle Button */}
        <div className="flex items-center justify-between mb-8">
          {sidebarOpen && (
            <div className="text-black font-bold text-xl flex items-center gap-1">
              <img src="/kiwiLogo.svg" alt="CarbonKiwi Logo" className="h-7 w-auto" />
              <span className="text-2xl text-black font-bold text-emerald-600 whitespace-nowrap">CARBONKIWI</span>
            </div>
          )}
          <button
            className="text-gray-600 hover:text-gray-800 focus:outline-none"
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            {/* Simple icon to represent toggling */}
            <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d={
                  sidebarOpen
                    ? "M6 18L18 6M6 6l12 12" // X icon
                    : "M4 6h16M4 12h16M4 18h16" // Hamburger icon
                }
              />
            </svg>
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex flex-col space-y-2">
          <button
            className={`flex items-center w-full text-left px-2 py-2 rounded hover:bg-gray-100 transition-colors ${
              activeTab === "overview" ? "bg-gray-100 text-emerald-600" : "text-gray-700"
            }`}
            onClick={() => setActiveTab("overview")}
          >
            <div className="w-5 h-5 mr-2">
              <FaHome />
            </div>
            {sidebarOpen && <span>Overview</span>}
          </button>

          <button
            className={`flex items-center w-full text-left px-2 py-2 rounded hover:bg-gray-100 transition-colors ${
              activeTab === "emissionData" ? "bg-gray-100 text-emerald-600" : "text-gray-700"
            }`}
            onClick={() => setActiveTab("emissionData")}
          >
            <div className="w-5 h-5 mr-2">
              <FaChartLine />
            </div>
            {sidebarOpen && <span>Emission Data</span>}
          </button>

          <button
            className={`flex items-center w-full text-left px-2 py-2 rounded hover:bg-gray-100 transition-colors ${
              activeTab === "nationalRanking" ? "bg-gray-100 text-emerald-600" : "text-gray-700"
            }`}
            onClick={() => setActiveTab("nationalRanking")}
          >
            <div className="w-5 h-5 mr-2">
              <FaTrophy />
            </div>
            {sidebarOpen && <span>National Ranking</span>}
          </button>

          <button
            className={`flex items-center w-full text-left px-2 py-2 rounded hover:bg-gray-100 transition-colors ${
              activeTab === "transfer" ? "bg-gray-100 text-emerald-600" : "text-gray-700"
            }`}
            onClick={() => setActiveTab("transfer")}
          >
            <div className="w-5 h-5 mr-2">
              <FaExchangeAlt />
            </div>
            {sidebarOpen && <span>Transfer</span>}
          </button>
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-grow p-4 md:p-6 bg-gray-50 overflow-auto">
        {/* ----------------------------------- */}
        {/* OVERVIEW TAB (with timeframe buttons) */}
        {/* ----------------------------------- */}
        {activeTab === "overview" && (
          <>
            <h2 className="text-3xl font-bold text-gray-800 mb-6">Overview</h2>

            {/* Stat Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              <div className="bg-white p-4 rounded-lg shadow-md">
                <p className="text-sm text-gray-500">Total Carbon Credits Held:</p>
                <h3 className="text-3xl font-bold text-gray-800">1,245 CC</h3>
                <p className="text-emerald-500 text-sm">↑ 5% than last week</p>
              </div>
              <div className="bg-white p-4 rounded-lg shadow-md">
                <p className="text-sm text-gray-500">Total Emissions Recorded:</p>
                <h3 className="text-3xl font-bold text-gray-800">150 kg CO₂</h3>
                <p className="text-emerald-500 text-sm">↑ 5% than last week</p>
              </div>
              <div className="bg-white p-4 rounded-lg shadow-md">
                <p className="text-sm text-gray-500">Credits Traded:</p>
                <h3 className="text-3xl font-bold text-gray-800">320 CC traded</h3>
                <p className="text-emerald-500 text-sm">↑ 5% than last week</p>
              </div>
              <div className="bg-white p-4 rounded-lg shadow-md">
                <p className="text-sm text-gray-500">Offsets Purchased:</p>
                <h3 className="text-3xl font-bold text-gray-800">360 CC offset</h3>
                <p className="text-emerald-500 text-sm">↑ 2% than last week</p>
              </div>
            </div>

            {/* Emission Data Overview Graph */}
            <div className="bg-white p-4 rounded-lg shadow-md mb-6">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-xl font-bold text-gray-800">Emission Data Overview</h3>
                {/* Timeframe buttons */}
                <div className="flex space-x-1">
                  {(["1D", "5D", "1M", "6M", "1Y"] as const).map(range => (
                    <button
                      key={range}
                      className={`px-3 py-1 text-sm rounded ${
                        selectedRange === range
                          ? "bg-emerald-600 text-white"
                          : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                      }`}
                      onClick={() => setSelectedRange(range)}
                    >
                      {range}
                    </button>
                  ))}
                </div>
              </div>
              <Line data={chartDataRanges[selectedRange]} />
            </div>
          </>
        )}

        {/* --------------- */}
        {/* EMISSION DATA  */}
        {/* --------------- */}
        {activeTab === "emissionData" && (
          <>
            <h2 className="text-3xl font-bold text-gray-800 mb-6">Emission Data</h2>
            <div className="bg-white p-4 rounded-lg shadow-md">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold text-gray-800">Recorded Emissions</h3>
              </div>
              {/* Emission Data Table */}
              <table className="min-w-full divide-y divide-gray-200">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Source</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Emission Type</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Amount</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Location</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Credits Applied</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Net Emission</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {emissionDataTable.map((item, index) => (
                    <tr key={index}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{item.date}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{item.source}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{item.emissionType}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{item.amount}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{item.location}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{item.creditsApplied}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{item.netEmission}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            item.status === "Verified"
                              ? "bg-emerald-100 text-emerald-800"
                              : item.status === "Pending"
                                ? "bg-yellow-100 text-yellow-800"
                                : "bg-red-100 text-red-800"
                          }`}
                        >
                          {item.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}

        {/* ------------------- */}
        {/* NATIONAL RANKING   */}
        {/* ------------------- */}
        {activeTab === "nationalRanking" && (
          <>
            <h2 className="text-3xl font-bold text-gray-800 mb-6">National Ranking</h2>
            <div className="bg-white p-4 rounded-lg shadow-md">
              <table className="min-w-full divide-y divide-gray-200">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Rank</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Entity/Region</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Total Emissions</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Carbon Credits</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Net Emission</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {rankingData.map((item, index) => (
                    <tr key={index}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{item.rank}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{item.entity}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{item.totalEmissions}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{item.carbonCredits}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{item.netEmission}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            item.status === "Compliant"
                              ? "bg-emerald-100 text-emerald-800"
                              : item.status === "Pending"
                                ? "bg-yellow-100 text-yellow-800"
                                : item.status === "Non-compliant"
                                  ? "bg-red-100 text-red-800"
                                  : "bg-gray-100 text-gray-800"
                          }`}
                        >
                          {item.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}

        {/* ------------------- */}
        {/* TRANSFER PAGE      */}
        {/* ------------------- */}
        {activeTab === "transfer" && (
          <>
            <h2 className="text-3xl font-bold text-gray-800 mb-6">Carbon Credits Management</h2>
            <div className="bg-white p-4 rounded-lg shadow-md max-w-xl">
              <div className="flex flex-col space-y-4">
                {/* Available Credit */}
                <div className="flex items-center justify-between border-b pb-2">
                  <p className="font-semibold text-gray-700">Available Credit:</p>
                  <p className="text-emerald-600 font-bold">{availableCredits}</p>
                </div>

                {/* Your Address */}
                <div className="flex items-center justify-between border-b pb-2">
                  <p className="font-semibold text-gray-700">Your Address:</p>
                  <p className="text-sm text-gray-700 truncate max-w-xs">{yourAddress}</p>
                </div>

                {/* Transfer Address */}
                <div className="flex flex-col">
                  <label className="font-semibold text-gray-700 mb-1">Recipient Address</label>
                  <input
                    type="text"
                    placeholder="0x1234... or similar"
                    value={transferAddress}
                    onChange={e => setTransferAddress(e.target.value)}
                    className="border rounded p-2 bg-white  focus:outline-none focus:ring-2 focus:ring-emerald-400"
                  />
                </div>

                {/* Amount */}
                <div className="flex flex-col">
                  <label className="font-semibold text-gray-700 mb-1">Amount</label>
                  <input
                    type="number"
                    placeholder="e.g. 100 (negative to remove from address)"
                    value={transferAmount}
                    onChange={e => setTransferAmount(e.target.value)}
                    className="border rounded p-2 bg-white  focus:outline-none focus:ring-2 focus:ring-emerald-400"
                  />
                </div>

                {/* Description */}
                <div className="flex flex-col">
                  <label className="font-semibold text-gray-700 mb-1">Description</label>
                  <textarea
                    placeholder="Optional description of the transfer"
                    value={transferDescription}
                    onChange={e => setTransferDescription(e.target.value)}
                    className="border rounded p-2 bg-white  focus:outline-none focus:ring-2 focus:ring-emerald-400"
                  />
                </div>

                {/* Info: Are you adding or deducting credits? */}
                {transferAmount && (
                  <p className={`text-sm font-semibold ${isDeducting ? "text-red-600" : "text-emerald-600"}`}>
                    You are {isDeducting ? "DEDUCTING" : "ADDING"} credits
                  </p>
                )}

                {/* Execute Button */}
                <button
                  onClick={handleExecuteTransfer}
                  className="bg-emerald-600 text-white px-4 py-2 rounded hover:bg-emerald-700 transition-colors"
                >
                  Execute
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
