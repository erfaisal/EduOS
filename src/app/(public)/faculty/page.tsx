import { getFacultyList } from "@/services/faculty";

interface FacultyMember {
  id?: string | number;
  name: string;
  designation: string;
  department: string;
  bio?: string;
  image_url?: string | null;
}

function getInitials(name: string): string {
  if (!name) return "??";
  const parts = name.trim().split(" ");
  if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

export default async function FacultyPage() {
  const faculty: FacultyMember[] = await getFacultyList();

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-extrabold text-gray-900 sm:text-5xl tracking-tight">
            Our Faculty
          </h1>
          <p className="mt-4 text-xl text-gray-500 max-w-2xl mx-auto">
            Meet our distinguished educators, researchers, and mentors dedicated to academic excellence.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {faculty.map((member, index) => (
            <div
              key={member.id || index}
              className="bg-white rounded-lg shadow overflow-hidden flex flex-col hover:shadow-md transition-shadow duration-300"
            >
              {member.image_url ? (
                <img
                  src={member.image_url}
                  alt={member.name}
                  className="w-full aspect-square object-cover rounded-t-lg"
                />
              ) : (
                <div className="w-full aspect-square bg-gray-200 rounded-t-lg flex items-center justify-center text-gray-500 text-3xl font-bold">
                  {getInitials(member.name)}
                </div>
              )}

              <div className="p-6 flex flex-col flex-grow">
                <h2 className="text-xl font-bold text-gray-900">{member.name}</h2>
                <p className="text-primary font-medium mt-1">{member.designation}</p>
                <p className="text-sm text-gray-500 mt-1">{member.department}</p>
                {member.bio && (
                  <p className="mt-4 text-gray-600 text-sm line-clamp-3">
                    {member.bio}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}