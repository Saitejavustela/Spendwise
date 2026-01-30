import { useState } from "react";
import { registerAPI } from "../../api/auth";
import { useAuthStore } from "../../store/authStore";

const Register = () => {
  const setUser = useAuthStore((s) => s.setUser);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const submit = async () => {
    try {
      const data = await registerAPI(name, email, password);
      setUser(data);
      window.location.href = "/dashboard";
    } catch (err) {
      alert("Registration failed");
    }
  };

  return (
    <div className="h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900">
      <div className="bg-white dark:bg-gray-800 p-6 rounded shadow w-96 space-y-4">
        <h1 className="text-xl font-semibold">Create Account</h1>

        <input
          placeholder="Full Name"
          className="border p-2 w-full rounded dark:text-black"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <input
          placeholder="Email"
          className="border p-2 w-full rounded dark:text-black"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          placeholder="Password"
          type="password"
          className="border p-2 w-full rounded dark:text-black"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button
          onClick={submit}
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
        >
          Register
        </button>
      </div>
    </div>
  );
};

export default Register;
