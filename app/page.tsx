import { after } from "next/server";
import EventCard from "@/components/EventCard";
import ExploreBtn from "@/components/ExploreBtn";
import { events } from "@/lib/constants";
import { emitPostHogLog, flushPostHogLogs } from "@/instrumentation";

export default function Home() {
  emitPostHogLog("featured events rendered", {
    event: "featured_events_rendered",
    event_count: events.length,
  });
  after(flushPostHogLogs);

  return (
    <section className="max-w-7xl mx-auto px-4 py-12">
      {/* Hero Section */}
      <div className="text-center max-w-2xl mx-auto">
        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight">
          The Hub For Every Dev Event <br />
          Do not miss it
        </h1>
        <p className="mt-5 text-gray-400 text-lg">
          Hackathons, Meetups, & Conferences. All in one place
        </p>
        <div className="mt-6 flex justify-center">
          <ExploreBtn />
        </div>
      </div>

      {/* Featured Events Section */}
      <div className="mt-20 space-y-8">
        <h3 className="text-2xl font-bold text-center">Featured Events</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {events.map((event) => (
            <EventCard key={event.slug} {...event} />
          ))}
        </div>
      </div>
    </section>
  );
}