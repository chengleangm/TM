export type ContactData = {
  name: string;
  email: string;
  phone: string;
  city: string;
  language: string;
  message: string;
  consent: string;
};
export function validateContact(
  data: Partial<ContactData>,
): Record<string, string> {
  const errors: Record<string, string> = {};
  for (const field of ["name", "email", "phone", "city", "message"] as const) {
    if (typeof data[field] !== "string" || !data[field]!.trim())
      errors[field] = "required";
  }
  if (
    typeof data.email === "string" &&
    data.email.trim() &&
    (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email.trim()) ||
      data.email.length > 254)
  )
    errors.email = "email";
  if (
    typeof data.phone === "string" &&
    data.phone.trim() &&
    (!/^[+\d\s().-]{7,30}$/.test(data.phone) ||
      data.phone.replace(/\D/g, "").length < 7)
  )
    errors.phone = "phone";
  if (data.consent !== "yes") errors.consent = "required";
  if (data.language !== "en" && data.language !== "km")
    errors.language = "required";
  for (const field of ["name", "city", "message"] as const)
    if (
      typeof data[field] === "string" &&
      data[field]!.length > (field === "message" ? 3000 : 100)
    )
      errors[field] = "required";
  return errors;
}
