import type { Metadata } from "next";
import { Archivo, JetBrains_Mono, Public_Sans } from "next/font/google";
import { Footer } from "@/components/Footer";
import { Navbar } from "@/components/Navbar";
import { Providers } from "@/components/Providers";
import { site } from "@/lib/site";
import "./globals.css";

const display = Archivo({
  variable: "--font-display-archivo",
  subsets: ["latin"],
  weight: ["500", "600", "700"],
});

const sans = Public_Sans({
  variable: "--font-sans-public",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

const mono = JetBrains_Mono({
  variable: "--font-mono-jetbrains",
  subsets: ["latin"],
  weight: ["400", "500"],
});

export const metadata: Metadata = {
  title: {
    default: `${site.name} — ${site.role.en}`,
    template: `%s — ${site.name}`,
  },
  description: site.tagline.en,
  metadataBase: new URL("https://my-personal-website.vercel.app"),
  openGraph: {
    title: `${site.name} — ${site.role.en}`,
    description: site.tagline.en,
    type: "website",
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${display.variable} ${sans.variable} ${mono.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col">
        <Providers>
          <Navbar />
          <main className="mx-auto flex w-full max-w-5xl flex-1 flex-col px-5 sm:px-8">
            {children}
          </main>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}