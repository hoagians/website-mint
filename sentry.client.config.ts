// This file configures the initialization of Sentry on the client.
// The config you add here will be used whenever a users loads a page in their browser.
// https://docs.sentry.io/platforms/javascript/guides/nextjs/

import * as Sentry from "@sentry/nextjs";

Sentry.init({
  dsn: "https://55665cb2f314af30a4df4bf9641e2b00@o4508734197465088.ingest.us.sentry.io/4508734201724928",

  // Add optional integrations for additional features
  integrations: [Sentry.replayIntegration()],

  // Define how likely traces are sampled. Adjust this value in production, or use tracesSampler for greater control.
  tracesSampleRate: 1,

  // Define how likely Replay events are sampled.
  // This sets the sample rate to be 10%. You may want this to be 100% while
  // in development and sample at a lower rate in production
  replaysSessionSampleRate: 0, // 0.1 = 10%

  // Define how likely Replay events are sampled when an error occurs.
  replaysOnErrorSampleRate: 0, // 1.0 = 100%

  // Setting this option to true will print useful information to the console while you're setting up Sentry.
  debug: false,
});
