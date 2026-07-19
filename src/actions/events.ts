"use server"
import { adminDb } from "@/lib/firebase-admin"

export async function deleteEventAction(eventId: string) {
  try {
    // 1. Delete all registrations for this event
    const registrationsRef = adminDb.collection("registrations");
    const snapshot = await registrationsRef.where("eventId", "==", eventId).get();
    
    const batch = adminDb.batch();
    
    snapshot.docs.forEach((doc) => {
      batch.delete(doc.ref);
    });
    
    // 2. Delete the event itself
    const eventRef = adminDb.collection("events").doc(eventId);
    batch.delete(eventRef);
    
    // Commit the batch
    await batch.commit();
    
    return { success: true };
  } catch (error) {
    console.error("Failed to delete event and registrations:", error);
    throw new Error("Failed to delete event");
  }
}
