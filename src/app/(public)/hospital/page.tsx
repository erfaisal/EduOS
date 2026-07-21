import { getHospitalFacilities } from "@/services/hospital";
import { Clock, Phone, AlertCircle } from "lucide-react";

export default async function HospitalPage() {
  const facilities = await getHospitalFacilities();

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-red-50 text-red-900 py-16 text-center">
        <div className="max-w-4xl mx-auto px-6">
          <h1 className="text-4xl font-bold tracking-tight mb-4">
            Campus Hospital & Medical Services
          </h1>
          <div className="inline-flex items-center gap-2 bg-red-100 border border-red-200 text-red-800 px-4 py-2 rounded-full font-medium text-sm">
            <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
            <span>24/7 Emergency Contact: <strong>+1 (555) 911-0000</strong></span>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {facilities.map((facility: any, index: number) => (
            <div
              key={facility.id || index}
              className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between gap-2 mb-3">
                  <h2 className="text-xl font-semibold text-gray-900">
                    {facility.name}
                  </h2>
                  <span className="inline-block px-2.5 py-0.5 text-xs font-semibold rounded-full bg-red-100 text-red-800 border border-red-200 shrink-0">
                    {facility.type}
                  </span>
                </div>

                <p className="text-gray-600 text-sm mb-6">
                  {facility.description}
                </p>
              </div>

              <div className="space-y-2 pt-4 border-t border-gray-100 text-sm text-gray-600">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-gray-400 shrink-0" />
                  <span>{facility.timing}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-gray-400 shrink-0" />
                  <a
                    href={`tel:${facility.contact_number}`}
                    className="hover:text-red-700 transition-colors"
                  >
                    {facility.contact_number}
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}