import { BASE_URL, COLLECTION_NAME, METADATA_DESCRIPTION, METADATA_TITLE } from "@/app/lib/constants";
import { GoogleTagManager } from "@next/third-parties/google";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import type { Metadata, Viewport } from "next";
import Script from "next/script";
import { BackgroundEffect } from "../components/BackgroundEffect";
import WalletProviderApp from "../components/WalletProviderApp";
import "../styles/globals.css";

const FB_APP_ID = String(process.env.NEXT_PUBLIC_FB_APP_ID);
const GTM_ID = String(process.env.NEXT_PUBLIC_GTM_ID);

export const metadata: Metadata = {
  title: METADATA_TITLE,
  description: METADATA_DESCRIPTION,
  metadataBase: new URL(BASE_URL),
  icons: {
    icon: [{ url: "/hoagians.png", sizes: "512x512", type: "image/png", rel: "icon", fetchPriority: "high" }],
    shortcut: [{ url: "/hoagians.png", sizes: "512x512", type: "image/png", rel: "shortcut icon" }],
    apple: [{ url: "/apple.png", sizes: "512x512", type: "image/png", rel: "apple-touch-icon" }],
  },
  openGraph: {
    locale: "en_US",
    type: "website",
    siteName: COLLECTION_NAME,
    title: METADATA_TITLE,
    description: METADATA_DESCRIPTION,
    url: BASE_URL,
    images: [
      { url: "/1200x630.jpg", width: 1200, height: 630, alt: "Image of a Hoagian" },
      { url: "/630x315.jpg", width: 630, height: 315, alt: "Image of a Hoagian" },
    ],
  },
  twitter: {
    card: "summary_large_image",
    site: COLLECTION_NAME.toLowerCase(), // X username
    title: METADATA_TITLE,
    description: METADATA_DESCRIPTION,
    images: [
      { url: "/1200x630.jpg", width: 1200, height: 630, alt: "Image of a Hoagian" },
      { url: "/630x315.jpg", width: 630, height: 315, alt: "Image of a Hoagian" },
    ],
  },
};

export const viewport: Viewport = {
  width: "device-width",
  height: "device-height",
  initialScale: 1,
  minimumScale: 1,
  maximumScale: 5,
  userScalable: true,
  viewportFit: "contain",
  interactiveWidget: "resizes-visual",
};

const jsonLd = {
  "@context": "https://schema.org/",
  "@type": "WebSite",
  name: COLLECTION_NAME,
  description: METADATA_DESCRIPTION,
  url: BASE_URL,
  image: `${BASE_URL}/hoagians.png`,
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <GoogleTagManager gtmId={GTM_ID} />
      <Script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <meta property="fb:app_id" content={FB_APP_ID} />
      <body>
        <BackgroundEffect />
        <WalletProviderApp>{children}</WalletProviderApp>
        <SpeedInsights />
        <Analytics />
      </body>
    </html>
  );
}
