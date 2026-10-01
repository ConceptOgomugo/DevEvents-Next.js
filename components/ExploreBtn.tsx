'use client';

import Image from "next/image";

export default function ExploreBtn() {
  return (
      <button type="button" id="explore-btn" className="mt-6 mx-auto">
        <a href="#events">
            Explore Events
            <Image src="/icons/arrow-down.svg" alt="arrow-down" width="20" height="20" />
        </a>
        </button>
  );
}