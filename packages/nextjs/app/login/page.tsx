"use client";

import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import axios from "axios";
import { IconContext } from "react-icons";
import { FaLock, FaUser } from "react-icons/fa";


<IconContext.Provider value={{ className: "text-gray-600" }}>
  <div>
    <FaLock />
  </div>
</IconContext.Provider>;

<IconContext.Provider value={{ className: "text-gray-600" }}>
  <div>
    <FaUser />
  </div>
</IconContext.Provider>;

// @ts-ignore
export default function ParticipantPortal() {
  const [registerForm, setRegisterForm] = useState({ username: "", password: "" });
  const [registerMessage, setRegisterMessage] = useState("");
  const [loginForm, setLoginForm] = useState({ name: "", password: "" });

  const handleRegisterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setRegisterForm({ ...registerForm, [e.target.name]: e.target.value });
  };

  const handleRegisterSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:3001/api/auth/register", {
        name: registerForm.username,
        password: registerForm.password,
      });
      if (response.data.message.contains === "read only") {
        setRegisterMessage("You are already logged in");
      }
      setRegisterMessage(response.data.message);
    } catch (error: any) {
      setRegisterMessage(error.response?.data?.message || "Registration failed");
    }
  };

  const handleLoginChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLoginForm({ ...loginForm, [e.target.name]: e.target.value });
  };

  const router = useRouter();
  const handleLoginSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:3001/api/auth/login", {
        name: loginForm.name,
        password: loginForm.password,
      });
      const token = response.data.token;
      // Store token in localStorage (or consider an HttpOnly cookie for better security)
      localStorage.setItem("token", token);
      const role = response.data.user?.role;

      if (role === "government") {
        router.replace("/govDashboard");
      } else if (role === "company") {
        router.replace("/userDashboard");
      }
    } catch (err) {
      // ...error handling...
    }
  };

  // @ts-ignore
  return (
    <div
      className="h-screen w-full bg-cover bg-center flex flex-col"
      style={{ backgroundImage: `url('/background.png')` }}
    >
      {/* Header */}
      {/* <header className="bg-gradient-to-r from-green-400 to-blue-500 py-4 px-6 flex items-center justify-center">
        <div className="text-black font-bold text-xl flex items-center gap-2">
          <Image
            src="/kiwiLogo.svg" // Ensure you place the image in the public folder
            alt="Kiwi Logo"
            width={40}
            height={40}
          />
          <span className="text-black">CARBONKIWI</span>
        </div>
      </header> */}

      {/* Participant Portal Heading */}
      <div className="flex-grow flex items-center justify-center">
        <div className="text-center bg-gradient-to-r from-green-300 to-blue-300 text-transparent bg-clip-text text-3xl font-bold absolute top-24">
          PARTICIPANT PORTAL
        </div>

        {/* Registration & Login Forms */}
        <div className="flex gap-12 mt-10">
          {/* Register Form */}
          <div className="bg-white bg-opacity-80 p-8 rounded-xl shadow-md w-96">
            <h2 className="text-black text-center text-xl font-bold mb-4">Register as a participant</h2>
            <form className="space-y-4" onSubmit={handleRegisterSubmit}>
              <div className="flex items-center bg-gray-100 text-gray-600 px-4 py-2 rounded-md">
                <FaUser />
                <input
                  type="text"
                  name="username"
                  placeholder="Username"
                  className="bg-transparent outline-none w-full ml-2"
                  value={registerForm.username}
                  onChange={handleRegisterChange}
                />
              </div>
              <div className="flex items-center bg-gray-100 text-gray-600 px-4 py-2 rounded-md">
                <FaLock />
                <input
                  type="password"
                  name="password"
                  placeholder="Password"
                  className="bg-transparent outline-none w-full ml-2"
                  value={registerForm.password}
                  onChange={handleRegisterChange}
                />
              </div>
              <button className="w-full bg-gradient-to-r from-blue-300 to-green-300 text-black py-2 rounded-md hover:scale-105 transition">
                Register
              </button>
              {registerMessage && (
                  <p className={`text-center ${registerMessage === "Registration successful. Waiting for government approval." ? "text-green-500" : "text-red-500"}`}>
                    {registerMessage}
                  </p>
              )}
            </form>
          </div>

          {/* Login Form */}
          <div className="bg-white bg-opacity-80 p-8 rounded-xl shadow-md w-96">
            <h2 className="text-black text-center text-xl font-bold mb-4">Login</h2>
            <form className="space-y-4" onSubmit={handleLoginSubmit}>
              <div className="flex items-center bg-gray-100 text-gray-600 px-4 py-2 rounded-md">
                <FaUser />
                <input
                  type="text"
                  name="name"
                  placeholder="Name"
                  className="bg-transparent outline-none w-full ml-2"
                  value={loginForm.name}
                  onChange={handleLoginChange}
                />
              </div>
              <div className="flex items-center bg-gray-100 text-gray-600 px-4 py-2 rounded-md">
                <FaLock />
                <input
                  type="password"
                  name="password"
                  placeholder="Password"
                  className="bg-transparent outline-none w-full ml-2"
                  value={loginForm.password}
                  onChange={handleLoginChange}
                />
              </div>
              <button className="w-full bg-gradient-to-r from-blue-300 to-green-300 text-black py-2 rounded-md hover:scale-105 transition">
                Login
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
