import { useState } from "react";

export function useRecurringEditCheckBox() {
  const [isEditAll, setIsEditAll] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setIsEditAll(e.target.checked);
  };

  return {
    isEditAll,
    handleChange,
  };
}
