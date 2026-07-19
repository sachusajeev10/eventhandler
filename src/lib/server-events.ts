import { adminDb } from "./firebase-admin"

const COLLECTION_NAME = "events"

export async function getPublishedEvents(): Promise<any[]> {
  if (!adminDb) return [];
  
  try {
    const snapshot = await adminDb.collection(COLLECTION_NAME)
      .where("isPublished", "==", true)
      .orderBy("createdAt", "desc")
      .get()
      
    return snapshot.docs.map((doc: any) => {
      const data = doc.data();
      // Sanitize Firestore Timestamp objects for Next.js Server Components
      if (data.createdAt && typeof data.createdAt.toDate === 'function') {
        data.createdAt = data.createdAt.toDate().toISOString();
      }
      if (data.updatedAt && typeof data.updatedAt.toDate === 'function') {
        data.updatedAt = data.updatedAt.toDate().toISOString();
      }
      return { id: doc.id, ...data };
    })
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
    const data = doc.data();
    
    // Sanitize Firestore Timestamp objects for Next.js Server Components
    if (data.createdAt && typeof data.createdAt.toDate === 'function') {
      data.createdAt = data.createdAt.toDate().toISOString();
    }
    if (data.updatedAt && typeof data.updatedAt.toDate === 'function') {
      data.updatedAt = data.updatedAt.toDate().toISOString();
    }
    
    return {
      id: doc.id,
      ...data
    }
  } catch (error) {
    console.error(`Failed to fetch event by slug ${slug}:`, error);
    return null;
  }
}
