import { getUpcomingEvents } from "@/services/events";
import { formatDate } from "@/lib/utils";
import { MapPin } from "lucide-react";

export default async function EventsPage() {
  const events = await getUpcomingEvents();

  return (
    <div className="min-h-screen bg-white">
      <header className="bg-gray-50 py-12 text-center">
        <h1 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
          Campus Events & Calendar
        </h1>
      </header>

      <main className="max-w-5xl mx-auto px-6 py-12">
        {events.length === 0 ? (
          <p className="text-center text-gray-500 py-12">
            No upcoming events scheduled at this time.
          </p>
        ) : (
          <div>
            {events.map((event) => (
              <div
                key={event.id}
                className="flex flex-col md:flex-row bg-white shadow-sm rounded-lg overflow-hidden mb-6 border border-gray-100"
              >
                <div className="p-6 flex-1">
                  <h2 className="text-xl font-semibold text-gray-900 mb-2">
                    {event.title}
                  </h2>

                  <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 mb-3">
                    <div>
                      <span>{formatDate(event.start_date)}</span>
                      {event.end_date && (
                        <span> - {formatDate(event.end_date)}</span>
                      )}
                    </div>

                    {event.location && (
                      <div className="flex items-center gap-1">
                        <MapPin className="w-4 h-4 text-gray-400" />
                        <span>{event.location}</span>
                      </div>
                    )}
                  </div>

                  {event.description && (
                    <p className="text-gray-600 text-sm line-clamp-3">
                      {event.description}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}