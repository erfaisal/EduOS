import { getHostels } from "@/services/hostels";
import { User, ShieldCheck, Phone } from "lucide-react";

export default async function HostelsPage() {
  const hostels = await getHostels();

  const groupedHostels = (hostels || []).reduce<Record<string, typeof hostels>>(
    (acc, hostel) => {
      const type = hostel.type || "General";
      if (!acc[type]) {
        acc[type] = [];
      }
      acc[type].push(hostel);
      return acc;
    },
    {}
  );

  return (
    <div className="min-h-screen bg-gray-50/50">
      <section className="bg-primary text-white py-16 text-center">
        <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl mb-4">
          Campus Accommodations
        </h1>
        <p className="max-w-2xl mx-auto text-lg text-primary-foreground/90 px-4">
          Experience a vibrant, secure, and comfortable residential life tailored to support your academic and personal growth.
        </p>
      </section>

      <main className="max-w-7xl mx-auto px-6 py-16 space-y-16">
        {Object.entries(groupedHostels).map(([type, hostelList]) => (
          <section key={type}>
            <h2 className="text-2xl font-bold mb-6 text-gray-900 border-b pb-2">
              {type.toLowerCase().includes("hostel") ? type : `${type} Hostels`}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {hostelList.map((hostel, index) => (
                <div
                  key={hostel.id || index}
                  className="bg-white rounded-xl shadow border border-gray-100 overflow-hidden flex flex-col justify-between"
                >
                  <div>
                    <h3 className="text-xl p-4 bg-gray-50 border-b font-bold text-gray-900">
                      {hostel.name}
                    </h3>
                    <div className="p-6 space-y-3">
                      <div className="flex items-center gap-3 text-gray-700">
                        <User className="w-5 h-5 text-gray-400 shrink-0" />
                        <span>Capacity: {hostel.capacity} Students</span>
                      </div>
                      <div className="flex items-center gap-3 text-gray-700">
                        <ShieldCheck className="w-5 h-5 text-gray-400 shrink-0" />
                        <span>Warden: {hostel.warden_name}</span>
                      </div>
                      <div className="flex items-center gap-3 text-gray-700">
                        <Phone className="w-5 h-5 text-gray-400 shrink-0" />
                        <span>{hostel.contact_number}</span>
                      </div>

                      {hostel.facilities && (
                        <div className="mt-4 pt-4 border-t border-gray-100">
                          <p className="text-sm text-gray-500">
                            <span className="font-semibold text-gray-700">Facilities: </span>
                            {Array.isArray(hostel.facilities)
                              ? hostel.facilities.join(", ")
                              : hostel.facilities}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        ))}
      </main>
    </div>
  );
}