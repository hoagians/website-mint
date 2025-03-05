import type { MetadataRoute } from "next";
import { BASE_URL, COLLECTION_NAME, METADATA_DESCRIPTION } from "./lib/constants";
import { ICON_IMG } from "./lib/images";

export default function manifest(): MetadataRoute.Manifest {
  return {
    lang: "en-US",
    name: COLLECTION_NAME,
    short_name: COLLECTION_NAME,
    description: METADATA_DESCRIPTION,
    start_url: "/",
    display: "browser",
    display_override: ["fullscreen", "standalone"],
    background_color: "#121212",
    theme_color: "#121212",
    icons: [
      {
        src: "/favicon.ico",
        sizes: "48x48",
        type: "image/x-icon",
      },
      {
        src: ICON_IMG,
        sizes: "512x512",
        type: "image/svg+xml",
      },
      {
        src: "/apple.png",
        sizes: "512x512",
        type: "image/png",
      },
    ],
    related_applications: [
      {
        platform: "webapp",
        url: BASE_URL,
      },
    ],
  };
}
