import { useState } from "react";
import { activateAccount } from "../services/authService";
import { useSearchParams } from "react-router-dom";

export default function ActivateAccount() {
  const [params] = useSearchParams();
  const token = params.get("token");

  const [password, setPassword] = useState("");
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  const handleActivate = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await activateAccount(token!, password);
      setSuccess("Account activated! You can now log in.");
    } catch {
      setError("Activation failed.");
    }
  };

  return (
    <div className="max-w-md mx-auto mt-16 p-6 border rounded shadow">
      <h2 className="text-xl font-bold mb-4">Activate Your Account</h2>

      {success && <div className="bg-green-100 p-3 rounded">{success}</div>}
      {error && <div className="bg-red-100 p-3 rounded">{error}</div>}

      <form onSubmit={handleActivate}>

        <input
          type="password"
          placeholder="Create a password"
          className="w-full p-3 border rounded mb-4"
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <button className="w-full bg-blue-600 text-white p-3 rounded">
          Activate Account
        </button>
      </form>
    </div>
  );
}
