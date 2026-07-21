"use client";

import { useState, FormEvent } from "react";
import { submitApplication } from "@/services/admissions";

export default function AdmissionsPage() {
  const [applicant_name, setApplicant_name] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [program_of_interest, setProgram_of_interest] = useState("B.Tech CS");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      await submitApplication({
        applicant_name,
        email,
        phone,
        program_of_interest,
      });
      setSuccess(true);
    } catch (err: any) {
      setError(err?.message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center items-center p-4 py-12">
      <div className="w-full max-w-md bg-white rounded-xl shadow-md p-8 border border-gray-100">
        <h1 className="text-2xl font-bold text-gray-900 text-center mb-2">
          Admissions Application
        </h1>
        <p className="text-sm text-gray-600 text-center mb-6">
          Submit your details to apply for admission to EduOS.
        </p>

        {success ? (
          <div className="p-4 bg-green-50 border border-green-200 text-green-800 text-center rounded-lg font-medium">
            Your application has been received. Our admissions team will contact you shortly.
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-sm rounded-md">
                {error}
              </div>
            )}

            <div>
              <label
                htmlFor="applicant_name"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Full Name
              </label>
              <input
                id="applicant_name"
                type="text"
                required
                value={applicant_name}
                onChange={(e) => setApplicant_name(e.target.value)}
                placeholder="Enter your full name"
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-gray-900"
              />
            </div>

            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Email Address
              </label>
              <input
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-gray-900"
              />
            </div>

            <div>
              <label
                htmlFor="phone"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Phone Number
              </label>
              <input
                id="phone"
                type="tel"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+1 (555) 000-0000"
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-gray-900"
              />
            </div>

            <div>
              <label
                htmlFor="program_of_interest"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Program of Interest
              </label>
              <select
                id="program_of_interest"
                value={program_of_interest}
                onChange={(e) => setProgram_of_interest(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-gray-900 bg-white"
              >
                <option value="B.Tech CS">B.Tech CS</option>
                <option value="B.Tech Mechanical">B.Tech Mechanical</option>
                <option value="MBA">MBA</option>
              </select>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 px-4 bg-primary text-white font-medium rounded-md shadow hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-50 transition-opacity"
            >
              {loading ? "Submitting..." : "Submit Application"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}