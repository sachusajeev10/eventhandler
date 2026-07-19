"use server"
import { adminDb } from "@/lib/firebase-admin"

export async function submitRegistration(eventId: string, eventSlug: string, eventName: string, name: string, email: string, phone: string, data: any, paymentScreenshotUrl?: string) {
  const collectionRef = adminDb.collection("registrations");
  
  await collectionRef.add({
    eventId,
    eventSlug,
    eventName,
    name,
    email,
    phone,
    submittedFields: data,
    paymentScreenshotUrl: paymentScreenshotUrl || null,
    submissionTime: new Date().toISOString(),
  });
  
  return { success: true };
}
