import { BASE_URL, COLLECTION_NAME, METADATA_DESCRIPTION } from "@/app/lib/constants";
import { ICON_IMG } from "@/app/lib/images";
import { GoogleTagManager } from "@next/third-parties/google";
import type { Metadata, Viewport } from "next";
import { BackgroundEffect } from "../components/BackgroundEffect";
import WalletProviderApp from "../components/WalletProviderApp";
import "../styles/globals.css";

export const metadata: Metadata = {
  title: COLLECTION_NAME,
  description: METADATA_DESCRIPTION,
  metadataBase: new URL(BASE_URL),
  icons: {
    icon: [{ url: ICON_IMG, sizes: "512x512", type: "image/svg+xml", rel: "icon", fetchPriority: "high" }],
    shortcut: [{ url: ICON_IMG, sizes: "512x512", type: "image/svg+xml", rel: "shortcut icon" }],
    apple: [{ url: "/apple.png", sizes: "512x512", type: "image/png", rel: "apple-touch-icon" }],
  },
  openGraph: {
    locale: "en_US",
    type: "website",
    siteName: COLLECTION_NAME,
    title: COLLECTION_NAME,
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
    title: COLLECTION_NAME,
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

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <GoogleTagManager gtmId="GTM-NWGLGTB6" />
      <meta property="fb:app_id" content="1989322008254480" />
      <body>
        <BackgroundEffect />
        <WalletProviderApp>{children}</WalletProviderApp>
      </body>
    </html>
  );
}
