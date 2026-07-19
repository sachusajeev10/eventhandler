import { adminDb } from "./firebase-admin"

const COLLECTION_NAME = "events"

export async function getPublishedEvents(): Promise<any[]> {
  if (!adminDb) return [];
  
  try {
    const snapshot = await adminDb.collection(COLLECTION_NAME)
      .where("isPublished", "==", true)
      .orderBy("createdAt", "desc")
      .get()
      
    return snapshot.docs.map((doc: any) => ({
      id: doc.id,
      ...doc.data()
    }))
  } catch (error) {
    console.error("Failed to fetch published events:", error);
    return [];
  }
}

export async function getEventBySlug(slug: string): Promise<any> {
  if (!adminDb) return null;
  
  try {
    const snapshot = await adminDb.collection(COLLECTION_NAME)
      .where("slug", "==", slug)
      .where("isPublished", "==", true)
      .limit(1)
      .get()
      
    if (snapshot.empty) return null;
    
    const doc = snapshot.docs[0];
    return {
      id: doc.id,
      ...doc.data()
    }
  } catch (error) {
    console.error(`Failed to fetch event by slug ${slug}:`, error);
    return null;
  }
}
