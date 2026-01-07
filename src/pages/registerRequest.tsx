import { useState } from "react";
import { requestPortalAccess } from "../services/authService";
import type { CustomerRequest } from "../services/authService";

export default function RegisterRequest() {
  const [formData, setFormData] = useState<CustomerRequest>({
    customerName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    country: "",
    taxId: "",
    vatNumber: "",
  });

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      await requestPortalAccess(formData);
      setSuccess("Request submitted! Admin will contact you after verification.");
    } catch (err: any) {
      setError(err?.message || "Failed to submit request");
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen flex">
      {/* LEFT SIDE IMAGE */}
      <div
        className="hidden md:flex w-1/2 bg-cover bg-center relative"
        style={{ backgroundImage: "url('/background.jpg')" }}
      >
        <div className="absolute inset-0 bg-blue-900 bg-opacity-60 flex items-center justify-center p-6">
          <h1 className="text-yellow-400 text-4xl font-bold text-center">
            Welcome to the Customer Portal
          </h1>
        </div>
      </div>

      {/* RIGHT SIDE FORM */}
      <div className="flex-1 flex items-center justify-center p-8 bg-gradient-to-b from-blue-50 to-yellow-50">
        <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8 space-y-6">
          <h2 className="text-3xl font-bold text-blue-700 text-center">
            Request Portal Access
          </h2>

          {success && (
            <div className="bg-green-100 text-green-800 p-3 rounded">
              {success}
            </div>
          )}

          {error && (
            <div className="bg-red-100 text-red-800 p-3 rounded">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Auto-Render Input Fields */}
            {[
              { name: "customerName", placeholder: "Full Name", type: "text", required: true },
              { name: "email", placeholder: "Email", type: "email", required: true },
              { name: "phone", placeholder: "Phone Number", type: "tel" },
              { name: "address", placeholder: "Address", type: "text" },
              { name: "city", placeholder: "City", type: "text" },
              { name: "country", placeholder: "Country", type: "text" },
              { name: "taxId", placeholder: "Tax ID", type: "text" },
              { name: "vatNumber", placeholder: "VAT Number", type: "text" },
            ].map((field) => (
              <input
                key={field.name}
                type={field.type}
                name={field.name}
                placeholder={field.placeholder}
                value={formData[field.name as keyof CustomerRequest] || ""}
                onChange={handleChange}
                className="w-full p-3 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring focus:ring-blue-200 outline-none shadow-sm"
                required={field.required}
              />
            ))}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-500 hover:bg-yellow-400 text-white font-semibold p-3 rounded-lg transition-colors duration-300 shadow-md"
            >
              {loading ? "Submitting..." : "Submit Request"}
            </button>
          </form>

          <p className="text-center text-gray-500 mt-4">
            Already have an account?{" "}
            <a
              href="/login"
              className="text-blue-500 hover:text-yellow-500 hover:underline transition-colors"
            >
              Login
            </a>
          </p>

        </div>
      </div>
    </div>
  );
}
