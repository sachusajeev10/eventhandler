import * as z from "zod"

export const registrationFieldSchema = z.object({
  id: z.string(),
  type: z.enum(["text", "email", "phone", "number", "select", "radio", "checkbox", "textarea", "url", "date"]),
  label: z.string().min(1, "Label is required"),
  required: z.boolean().default(true),
  options: z.array(z.string()).optional(),
})

export const eventSchema = z.object({
  slug: z.string().min(3, "Slug must be at least 3 characters").regex(/^[a-z0-9-]+$/, "Slug can only contain lowercase letters, numbers, and hyphens"),
  name: z.string().min(3, "Name must be at least 3 characters"),
  description: z.string().optional().or(z.literal("")),
  posterUrl: z.string().min(1, "Poster is required"),
  venue: z.string().min(1, "Venue is required"),
  date: z.string().min(1, "Date is required"),
  time: z.string().optional().or(z.literal("")),
  registrationDeadline: z.string().min(1, "Registration deadline is required"),
  maxParticipants: z.coerce.number().min(1, "Must allow at least 1 participant"),
  isPublished: z.boolean().default(false),
  paymentRequired: z.boolean().default(false),
  paymentAmount: z.coerce.number().optional(),
  paymentQrUrl: z.string().optional(),
  paymentUpiId: z.string().optional(),
  paymentInstructions: z.string().optional().or(z.literal("")),
  whatsappLink: z.string().url("Must be a valid URL").optional().or(z.literal("")),
  winnerPrize: z.string().optional().or(z.literal("")),
  registrationFields: z.array(registrationFieldSchema).default([]),
})

export type EventFormData = z.infer<typeof eventSchema>
export type RegistrationField = z.infer<typeof registrationFieldSchema>
