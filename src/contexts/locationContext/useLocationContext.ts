import { useContext } from "react";
import { LocationContext } from "./locationContext";

export function useLocationContext() {
  const context = useContext(LocationContext);
  if (context === undefined) {
    throw new Error(
      "useLocationContext must be used within a LocationProvider",
    );
  }
  return context;
}
