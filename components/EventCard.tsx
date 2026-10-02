'use client';

import Image from "next/image";
import Link from "next/link";
import posthog from "posthog-js";

const isPostHogConfigured = Boolean(
  process.env.NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN &&
    process.env.NEXT_PUBLIC_POSTHOG_HOST,
);

interface Props {
  title: string;
  image: string;
  slug: string;
  location: string;
  Date: string;
  Time: string;
}

export default function EventCard({
  title,
  image,
  slug,
  location,
  Date,
  Time,
}: Props) {
  const handleEventSelection = () => {
    if (isPostHogConfigured) {
      posthog.capture("event_selected", { event_slug: slug });
    }
  };

  return (
    <div>
      <Link href={`/events/${slug}`} id="event-card" onClick={handleEventSelection}>
        <Image
          src={image}
          alt={title}
          width={410}
          height={300}
          className="poster"
        />

        <div className="flex flex-row gap-2">
          <Image src="/icons/pin.svg" alt="location" width="14" height="14" />
          <p>{location}</p>
        </div>

        <p className="title">{title}</p>

        <div className="datetime">
          <div>
            <Image src="/icons/calendar.svg" alt="calendar" width="14" height="14" />
            <p>{Date}</p>
          </div>
          <div>
            <Image src="/icons/clock.svg" alt="clock" width="14" height="14" />
            <p>{Time}</p>
          </div>
        </div>
      </Link>
    </div>
  );
}
