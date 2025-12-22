import { yupResolver } from "@hookform/resolvers/yup";
import { eventFormSchema, type EventFormData } from "../../eventFormSchema";
import { useForm } from "react-hook-form";

export function useEventFormSetup() {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<EventFormData>({
    resolver: yupResolver(eventFormSchema),
    defaultValues: {
      title: "",
      description: "",
      start: "",
      end: "",
      color: "#0000FF",
    },
  });
  return {
    register,
    handleSubmit,
    reset,
    errors,
  };
}
