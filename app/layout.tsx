import type { Metadata } from "next";
import { Lato, Martian_Mono, Geist } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import LightRays from "@/components/LightRays";
import Navbar from "@/components/Navbar";
import { emitPostHogLog } from "@/instrumentation";

const geist = Geist({ subsets: ["latin"], variable: "--font-sans" });

const lato = Lato({
  variable: "--font-lato",
  subsets: ["latin"],
  weight: ["400", "700"],
});

const martianMono = Martian_Mono({
  variable: "--font-martian-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "DevHub",
  description: "All Developers Events in One Place",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  emitPostHogLog("site shell rendered", {
    event: "site_shell_rendered",
    page_type: "home",
  });

  return (
    <html
      lang="en"
      className={cn(
        "min-h-screen",
        "antialiased",
        lato.variable,
        martianMono.variable,
        "font-sans",
        geist.variable,
      )}
    >
      <body className="min-h-full flex flex-col">
        <Navbar />
        <div className="absolute inset-0 top-0 z-[-1] flex min-h-screen">
          <LightRays
          raysOrigin="top-center-offset"
          raysColor="#5dfeca"
          raysSpeed={0.5}
          lightSpread={0.9}
          rayLength={1.4}
          followMouse={true}
          mouseInfluence={0.02}
          noiseAmount={0}
          distortion={0}
          pulsating={false}
          fadeDistance={0.5}
          saturation={0.5}
        />
        </div>

        <main>{children}</main>
      </body>
    </html>
  );
}
