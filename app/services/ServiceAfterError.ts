"use server";

import * as Sentry from "@sentry/nextjs";
import { updateAvailableId } from "../lib/orm/queries/availability";

export const actionsAfterError = async (id: number): Promise<void> => {
  try {
    const response = await updateAvailableId(id);
    // console.log("🟡 Service Response [updateAvailableId]:", response);
  } catch (error) {
    // console.error("🔴 Service Error [updateAvailableId]:", (error as Error).message);
    Sentry.captureException(error);
  }
};
