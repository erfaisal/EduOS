import { getPlacements, getPlacementStats } from "@/services/placements";

export default async function PlacementsPage() {
  const [placements, stats] = await Promise.all([
    getPlacements(),
    getPlacementStats(),
  ]);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* UI Hero & Stats */}
      <header className="bg-primary text-white py-16 text-center">
        <div className="max-w-7xl mx-auto px-6">
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-6">
            Training & Placements
          </h1>
          <div className="flex flex-wrap justify-center items-center gap-8 text-2xl md:text-3xl font-bold">
            <div>Total Offers: {stats.totalOffers}</div>
            <div className="hidden md:inline text-white/50">•</div>
            <div>Highest Package: {stats.highestPackage} LPA</div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {placements.map((placement: any, index: number) => (
            <div
              key={placement.id || index}
              className="relative bg-white rounded-lg p-6 shadow-sm border border-gray-200 hover:shadow-md transition-shadow"
            >
              <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-semibold absolute top-4 right-4">
                {placement.package_lpa} LPA
              </span>
              <div className="pr-20">
                <h2 className="font-bold text-xl text-gray-900 mb-1">
                  {placement.company_name}
                </h2>
                <p className="text-gray-700 font-medium mb-3">
                  {placement.student_name}
                </p>
              </div>
              <div className="pt-3 border-t border-gray-100 flex justify-between items-center text-sm text-gray-600">
                <span>{placement.role}</span>
                <span className="text-gray-500">
                  Batch: {placement.batch_year}
                </span>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}