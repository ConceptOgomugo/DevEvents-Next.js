"use client";

import { createBooking } from "@/lib/actions/booking.actions";
import { posthog } from "posthog-js";
import { useState } from "react";

export default function BookEvent({eventId, slug}: {eventId: string, slug: string;}) {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    const { success} = await createBooking({eventId, slug, email});

    if (success) {
      setSubmitted(true);
      posthog.capture("event_booked", {eventId, slug, email});
    } else {
      console.error("Booking Creation Failed");
      posthog.captureException("Booking Creation Failed");
    }

    e.preventDefault();

    setTimeout(() => {
      setSubmitted(true);
    }, 1000);
  }

  return (
    <div id="book-event">
      {submitted ? (
        <p className="text-sm ">
          Thank you for booking your spot! We look forward to seeing you at the
          event.
        </p>
      ) : (
        <form>
          <div>
            <label htmlFor="email">Email Address</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email address"
              required
            />
          </div>
          <button
            type="submit"
            className="button-submit">Book</button>
        </form>
      )}
    </div>
  );
}
