import { format } from "date-fns";
import { pl, enUS } from "date-fns/locale";
import type { Event } from "../../../../../../../db/scheduleDb";
import type { EventFilters } from "../../../../../context/filtersContext";
import type { IFilterStrategy } from "./IFilterStrategy";
import { toDateTimeLocal } from "../../../../../../../utils/toDateTimeLocal/toDateTimeLocal";

export class SearchQuery implements IFilterStrategy {
  isActive(filters: EventFilters): boolean {
    return !!filters.searchQuery;
  }

  private normalize(text: string): string {
    return text
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/ł/g, "l")
      .replace(/Ł/g, "l")
      .toLowerCase();
  }

  apply(event: Event, filters: EventFilters): boolean {
    const query = this.normalize(filters.searchQuery);

    const title = this.normalize(event.title);
    const description = event.description
      ? this.normalize(event.description)
      : "";

    const dateISO = toDateTimeLocal(event.start);
    const datePL = event.start.toLocaleDateString("pl-PL");
    const timePL = event.start.toLocaleTimeString("pl-PL", {
      hour: "2-digit",
      minute: "2-digit",
    });

    const dayNamePL = this.normalize(
      format(event.start, "EEEE", { locale: pl })
    );
    const dayNameEN = this.normalize(
      format(event.start, "EEEE", { locale: enUS })
    );

    const fullSearchableContent = [
      title,
      description,
      dateISO,
      datePL,
      timePL,
      dayNamePL,
      dayNameEN,
    ]
      .join(" ")
      .toLowerCase();

    return fullSearchableContent.includes(query);
  }
}
