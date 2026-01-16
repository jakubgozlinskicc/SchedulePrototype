export const formatDateForInput = (date: Date | null): string => {
  if (!date) return "";

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
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
