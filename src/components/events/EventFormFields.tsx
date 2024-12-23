import { UseFormReturn } from "react-hook-form";
import type { EventFormValues } from "./schemas/eventFormSchema";
import { EventBasicFields } from "./form-fields/EventBasicFields";
import { EventDateTimeFields } from "./form-fields/EventDateTimeFields";
import { EventLocationFields } from "./form-fields/EventLocationFields";
import { EventPrivacyFields } from "./form-fields/EventPrivacyFields";

interface EventFormFieldsProps {
  form: UseFormReturn<EventFormValues>;
}

export function EventFormFields({ form }: EventFormFieldsProps) {
  return (
    <>
      <EventBasicFields form={form} />
      <EventDateTimeFields form={form} />
      <EventLocationFields form={form} />
      <EventPrivacyFields form={form} />
    </>
  );
}