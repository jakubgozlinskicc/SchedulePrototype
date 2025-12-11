import type { Event } from "../../db/scheduleDb";

export const getDefaultEvent = (): Event => ({
  id: undefined,
  title: "",
  description: "",
  start: new Date(),
  end: new Date(),
  color: "#0000FF",
});
