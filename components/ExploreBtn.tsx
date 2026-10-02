'use client';

import Image from "next/image";
import posthog from "posthog-js";

const isPostHogConfigured = Boolean(
  process.env.NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN &&
    process.env.NEXT_PUBLIC_POSTHOG_HOST,
);

export default function ExploreBtn() {
  const handleExplore = () => {
    if (isPostHogConfigured) {
      posthog.capture("events_explored");
    }
  };

  return (
      <button
        type="button"
        id="explore-btn"
        className="mt-6 mx-auto"
        onClick={handleExplore}
      >
        <a href="#events">
            Explore Events
            <Image src="/icons/arrow-down.svg" alt="arrow-down" width="20" height="20" />
        </a>
        </button>
  );
}