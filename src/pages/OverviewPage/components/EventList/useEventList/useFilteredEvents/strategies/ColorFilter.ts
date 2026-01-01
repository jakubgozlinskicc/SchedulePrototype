import type { Event } from "../../../../../../../db/scheduleDb";
import type { EventFilters } from "../../../../../context/filtersContext";
import type { IFilterStrategy } from "./IFilterStrategy";

const colorSamples: Record<string, [number, number, number]> = {
  red: [255, 0, 0],
  orange: [255, 165, 0],
  yellow: [255, 255, 0],
  green: [0, 255, 0],
  blue: [0, 0, 255],
  purple: [128, 0, 128],
  pink: [255, 105, 180],
  brown: [139, 69, 19],
  black: [0, 0, 0],
  gray: [128, 128, 128],
  white: [255, 255, 255],
  cyan: [0, 255, 255],
  gold: [255, 215, 0],
};

export class ColorFilter implements IFilterStrategy {
  isActive(filters: EventFilters): boolean {
    return filters.colors.length > 0;
  }

  apply(event: Event, filters: EventFilters): boolean {
    if (filters.colors.length === 0) return true;
    if (!event.color) return false;

    const category = this.getColorCategory(event.color);
    return category ? filters.colors.includes(category) : false;
  }

  private hexToRgb(hex: string): [number, number, number] | null {
    const match = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return match
      ? [parseInt(match[1], 16), parseInt(match[2], 16), parseInt(match[3], 16)]
      : null;
  }

  private getColorCategory(hex: string): string | null {
    const rgb = this.hexToRgb(hex);
    if (!rgb) return null;

    let closestColor: string | null = null;
    let minDistance = Infinity;

    for (const [category, sample] of Object.entries(colorSamples)) {
      const distance = Math.sqrt(
        (rgb[0] - sample[0]) ** 2 +
          (rgb[1] - sample[1]) ** 2 +
          (rgb[2] - sample[2]) ** 2
      );

      if (distance < minDistance) {
        minDistance = distance;
        closestColor = category;
      }
    }

    return closestColor;
  }
}
