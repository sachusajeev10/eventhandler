import { db } from "./firebase";
import { collection, doc, getDoc, getDocs, addDoc, updateDoc, deleteDoc, query, orderBy, where } from "firebase/firestore";
import { EventFormData } from "./schema";

const COLLECTION_NAME = "events";

export async function createEvent(data: EventFormData) {
  const eventsRef = collection(db, COLLECTION_NAME);
  const now = new Date().toISOString();
  
  // Remove undefined fields which Firestore rejects
  const cleanData = JSON.parse(JSON.stringify(data));
  
  const docRef = await addDoc(eventsRef, {
    ...cleanData,
    createdAt: now,
    updatedAt: now,
  });
  
  return docRef.id;
}

export async function getEvents(publishedOnly = false): Promise<any[]> {
  const eventsRef = collection(db, COLLECTION_NAME);
  const q = publishedOnly 
    ? query(eventsRef, where("isPublished", "==", true), orderBy("createdAt", "desc"))
    : query(eventsRef, orderBy("createdAt", "desc"));
    
  const snapshot = await getDocs(q);
  
  return snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  }));
}

export async function getEventById(id: string): Promise<any> {
  const docRef = doc(db, COLLECTION_NAME, id);
  const snapshot = await getDoc(docRef);
  
  if (!snapshot.exists()) {
    return null;
  }
  
  return {
    id: snapshot.id,
    ...snapshot.data()
  };
}

export async function getEventBySlug(slug: string): Promise<any> {
  const eventsRef = collection(db, COLLECTION_NAME);
  const q = query(eventsRef, where("slug", "==", slug));
  const snapshot = await getDocs(q);
  
  if (snapshot.empty) {
    return null;
  }
  
  const doc = snapshot.docs[0];
  return {
    id: doc.id,
    ...doc.data()
  };
}

export async function updateEvent(id: string, data: Partial<EventFormData>) {
  const docRef = doc(db, COLLECTION_NAME, id);
  const cleanData = JSON.parse(JSON.stringify(data));
  
  await updateDoc(docRef, {
    ...cleanData,
    updatedAt: new Date().toISOString()
  });
}

export async function deleteEvent(id: string) {
  const docRef = doc(db, COLLECTION_NAME, id);
  await deleteDoc(docRef);
}
