export const formatDateForInput = (date: Date | null): string => {
  if (!date) return "";
  return date.toISOString().split("T")[0];
};

export const createDateChangeHandler = (
  updateFilter: (key: "dateFrom" | "dateTo", value: Date | null) => void,
  filterKey: "dateFrom" | "dateTo"
) => {
  return (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    updateFilter(filterKey, value ? new Date(value) : null);
  };
};
