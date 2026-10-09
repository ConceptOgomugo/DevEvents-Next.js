import Image from "next/image";
import { notFound } from "next/navigation";
import BookEvent from "@/components/BookEvent";
import { IEvent } from "@/database";
import {getSimilarEventBySlug} from "@/lib/actions/event.actions"
import EventCard from "@/components/EventCard";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

const EventDetailsItem = ({icon, alt, label}: {icon: string, alt: string, label: string}) => {
    return (
        <div className="text-xs flex-row-gap-2 items-center">
            <Image src={icon} alt={alt} width={17} height={17} />
            <span>{label}</span>
        </div>
    );
}

const EventAgenda = ({agendaItems}: {agendaItems: string[] }) => {
    return (
        <div className="agenda">
            <h2>Agenda</h2>
            <ul>
                {agendaItems.map((item, index) => (
                    <li key={index} className="text-sm">{item}</li>
                ))}
            </ul>
        </div>
    );
}

const Tags = ({tags}: {tags: string[] }) => {
    return (
        <div className="flex flex-row gap-1.5 flex-wrap">
                {tags.map((tag, index) => (
                    <div key={index} className="text-sm pill">{tag}</div>
                ))}
        </div>
    );
}

export default async function eventDetails({
  params,
}: {
  params: { slug: string };
}) {
  const { slug } = await params;
  const request = await fetch(`${BASE_URL}/api/events/${slug}`);
  const { event } = await request.json();

  if (!event) return notFound();

   const bookings = 10;

   const similarEvents: IEvent[] = await getSimilarEventBySlug(slug);

  return (
    <div>
      <section id="event">
        <div className="header">
            <h1>Event Description</h1>
            <p className="mt-3">{event.description}</p>
        </div>

        <div className="details">
            {/* Left side */}
            <div className="content">
                <Image src={event.image} alt="Event Banner" width={400} height={400} className="banner" />

                <section className="flex-col-gap-2">
                    <h2>Overview</h2>
                    <p className="text-sm">{event.overview}</p>
                </section>

                <section className="flex-col-gap-2">
                    <h2>Event Details</h2>
                    <EventDetailsItem icon="/icons/calendar.svg" alt="Calendar" label={event.date} />
                    <EventDetailsItem icon="/icons/clock.svg" alt="Clock" label={event.time} />
                    <EventDetailsItem icon="/icons/pin.svg" alt="Location" label={event.location} />
                    <EventDetailsItem icon="/icons/mode.svg" alt="Mode" label={event.mode} />
                    <EventDetailsItem icon="/icons/audience.svg" alt="audience" label={event.audience} />
                </section>

                <EventAgenda agendaItems={event.agenda}/>

                <section className="flex-col-gap-2">
                    <h2>About The Organizer</h2>
                    <p className="text-sm">{event.organizer}</p>
                </section>

                <Tags  tags={JSON.parse(event.tags[0])}/>

            </div>

            {/* Right side */}
            <aside className="booking">
                <div className="sign-up card">
                    <h2> Book Your Spot</h2>
                    {bookings > 0 ? (
                        <p className="text-sm">Join {bookings} others who are attending!</p>
                    ): (
                        <p className="text-sm">Be the first to join!</p>
                    )}

                    <BookEvent eventId={event._id} slug={event.slug} />
                </div>
            </aside>
        </div>

        <div className="flex w-full flex-col gap-4 pt-20">
            <h2>Similar Events</h2>
            <div className="events">
                {similarEvents.length > 0 && similarEvents.map((similarEvents: IEvent, index) => (
                    <EventCard key={index} {... similarEvents} />
                ))}
            </div>
        </div>
      </section>
    </div>
  );
}
