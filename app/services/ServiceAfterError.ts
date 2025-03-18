"use server";

import * as Sentry from "@sentry/nextjs";
import { deleteAsset } from "../lib/orm/queries/assets";
import { updateAvailableId } from "../lib/orm/queries/availability";

export const actionsAfterError = async (id: number): Promise<void> => {
  try {
    const response = await deleteAsset(id);
    // console.log("🟡 Service Response [deleteAsset]:", response);
  } catch (error) {
    // console.error("🔴 Service ERROR [deleteAsset]:", (error as Error).message);
    Sentry.captureException(error);
  }

  try {
    const response = await updateAvailableId(id);
    // console.log("🟡 Service Response [updateAvailableId]:", response);
  } catch (error) {
    // console.error("🔴 Service Error [updateAvailableId]:", (error as Error).message);
    Sentry.captureException(error);
  }
};
