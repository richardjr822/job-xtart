import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  onSnapshot,
  Timestamp,
  addDoc,
  QueryConstraint,
} from 'firebase/firestore';
import { db } from './config';
import { User } from '@/interfaces/User';
import { Job } from '@/interfaces/Job';
import { Application } from '@/interfaces/Application';
import { Review } from '@/interfaces/Review';

const COLLECTIONS = {
  USERS: 'users',
  JOBS: 'jobs',
  APPLICATIONS: 'applications',
  REVIEWS: 'reviews',
  NOTIFICATIONS: 'notifications',
};

const convertTimestamp = (timestamp: Timestamp | Date): Date => {
  return timestamp instanceof Timestamp ? timestamp.toDate() : timestamp;
};

export const usersService = {
  async create(userId: string, data: Omit<User, '_id'>) {
    await setDoc(doc(db, COLLECTIONS.USERS, userId), {
      ...data,
      createdAt: Timestamp.now(),
    });
  },

  async get(userId: string): Promise<User | null> {
    const docSnap = await getDoc(doc(db, COLLECTIONS.USERS, userId));
    if (!docSnap.exists()) return null;
    const data = docSnap.data();
    return {
      ...data,
      _id: docSnap.id,
      createdAt: convertTimestamp(data.createdAt),
    } as User;
  },

  async update(userId: string, data: Partial<User>) {
    await updateDoc(doc(db, COLLECTIONS.USERS, userId), data);
  },

  async getByEmail(email: string): Promise<User | null> {
    const q = query(collection(db, COLLECTIONS.USERS), where('email', '==', email));
    const snapshot = await getDocs(q);
    if (snapshot.empty) return null;
    const docData = snapshot.docs[0];
    return {
      ...docData.data(),
      _id: docData.id,
      createdAt: convertTimestamp(docData.data().createdAt),
    } as User;
  },

  subscribe(userId: string, callback: (user: User | null) => void) {
    return onSnapshot(doc(db, COLLECTIONS.USERS, userId), (docSnap) => {
      if (!docSnap.exists()) {
        callback(null);
        return;
      }
      const data = docSnap.data();
      callback({
        ...data,
        _id: docSnap.id,
        createdAt: convertTimestamp(data.createdAt),
      } as User);
    });
  },
};

export const jobsService = {
  async create(data: Omit<Job, '_id'>): Promise<string> {
    const docRef = await addDoc(collection(db, COLLECTIONS.JOBS), {
      ...data,
      createdAt: Timestamp.now(),
    });
    return docRef.id;
  },

  async get(jobId: string): Promise<Job | null> {
    const docSnap = await getDoc(doc(db, COLLECTIONS.JOBS, jobId));
    if (!docSnap.exists()) return null;
    const data = docSnap.data();
    return {
      ...data,
      _id: docSnap.id,
      createdAt: convertTimestamp(data.createdAt),
      completedAt: data.completedAt ? convertTimestamp(data.completedAt) : undefined,
    } as Job;
  },

  async update(jobId: string, data: Partial<Job>) {
    await updateDoc(doc(db, COLLECTIONS.JOBS, jobId), data);
  },

  async delete(jobId: string) {
    await deleteDoc(doc(db, COLLECTIONS.JOBS, jobId));
  },

  async getAll(constraints: QueryConstraint[] = []): Promise<Job[]> {
    const q = query(collection(db, COLLECTIONS.JOBS), ...constraints);
    const snapshot = await getDocs(q);
    return snapshot.docs.map((docSnap) => {
      const data = docSnap.data();
      return {
        ...data,
        _id: docSnap.id,
        createdAt: convertTimestamp(data.createdAt),
        completedAt: data.completedAt ? convertTimestamp(data.completedAt) : undefined,
      } as Job;
    });
  },

  async getByPoster(posterId: string): Promise<Job[]> {
    return this.getAll([where('posterId', '==', posterId), orderBy('createdAt', 'desc')]);
  },

  async getOpen(): Promise<Job[]> {
    return this.getAll([where('status', '==', 'open'), orderBy('createdAt', 'desc')]);
  },

  subscribe(callback: (jobs: Job[]) => void) {
    const q = query(collection(db, COLLECTIONS.JOBS), orderBy('createdAt', 'desc'));
    return onSnapshot(q, (snapshot) => {
      const jobs = snapshot.docs.map((docSnap) => {
        const data = docSnap.data();
        return {
          ...data,
          _id: docSnap.id,
          createdAt: convertTimestamp(data.createdAt),
          completedAt: data.completedAt ? convertTimestamp(data.completedAt) : undefined,
        } as Job;
      });
      callback(jobs);
    });
  },
};

export const applicationsService = {
  async create(data: Omit<Application, '_id'>): Promise<string> {
    const docRef = await addDoc(collection(db, COLLECTIONS.APPLICATIONS), {
      ...data,
      createdAt: Timestamp.now(),
    });
    return docRef.id;
  },

  async get(applicationId: string): Promise<Application | null> {
    const docSnap = await getDoc(doc(db, COLLECTIONS.APPLICATIONS, applicationId));
    if (!docSnap.exists()) return null;
    const data = docSnap.data();
    return {
      ...data,
      _id: docSnap.id,
      createdAt: convertTimestamp(data.createdAt),
      respondedAt: data.respondedAt ? convertTimestamp(data.respondedAt) : undefined,
    } as Application;
  },

  async update(applicationId: string, data: Partial<Application>) {
    await updateDoc(doc(db, COLLECTIONS.APPLICATIONS, applicationId), data);
  },

  async getBySeeker(seekerId: string): Promise<Application[]> {
    const q = query(
      collection(db, COLLECTIONS.APPLICATIONS),
      where('seekerId', '==', seekerId),
      orderBy('createdAt', 'desc')
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map((docSnap) => {
      const data = docSnap.data();
      return {
        ...data,
        _id: docSnap.id,
        createdAt: convertTimestamp(data.createdAt),
        respondedAt: data.respondedAt ? convertTimestamp(data.respondedAt) : undefined,
      } as Application;
    });
  },

  async getByJob(jobId: string): Promise<Application[]> {
    const q = query(
      collection(db, COLLECTIONS.APPLICATIONS),
      where('jobId', '==', jobId),
      orderBy('createdAt', 'desc')
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map((docSnap) => {
      const data = docSnap.data();
      return {
        ...data,
        _id: docSnap.id,
        createdAt: convertTimestamp(data.createdAt),
        respondedAt: data.respondedAt ? convertTimestamp(data.respondedAt) : undefined,
      } as Application;
    });
  },

  subscribe(seekerId: string, callback: (applications: Application[]) => void) {
    const q = query(
      collection(db, COLLECTIONS.APPLICATIONS),
      where('seekerId', '==', seekerId),
      orderBy('createdAt', 'desc')
    );
    return onSnapshot(q, (snapshot) => {
      const applications = snapshot.docs.map((docSnap) => {
        const data = docSnap.data();
        return {
          ...data,
          _id: docSnap.id,
          createdAt: convertTimestamp(data.createdAt),
          respondedAt: data.respondedAt ? convertTimestamp(data.respondedAt) : undefined,
        } as Application;
      });
      callback(applications);
    });
  },
};

export const reviewsService = {
  async create(data: Omit<Review, '_id'>): Promise<string> {
    const docRef = await addDoc(collection(db, COLLECTIONS.REVIEWS), {
      ...data,
      createdAt: Timestamp.now(),
    });
    return docRef.id;
  },

  async getByReviewee(revieweeId: string): Promise<Review[]> {
    const q = query(
      collection(db, COLLECTIONS.REVIEWS),
      where('revieweeId', '==', revieweeId),
      orderBy('createdAt', 'desc')
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map((docSnap) => {
      const data = docSnap.data();
      return {
        ...data,
        _id: docSnap.id,
        createdAt: convertTimestamp(data.createdAt),
      } as Review;
    });
  },

  async getByJob(jobId: string): Promise<Review[]> {
    const q = query(collection(db, COLLECTIONS.REVIEWS), where('jobId', '==', jobId));
    const snapshot = await getDocs(q);
    return snapshot.docs.map((docSnap) => {
      const data = docSnap.data();
      return {
        ...data,
        _id: docSnap.id,
        createdAt: convertTimestamp(data.createdAt),
      } as Review;
    });
  },
};

export interface Notification {
  id: string;
  userId: string;
  type: string;
  title: string;
  message: string;
  read: boolean;
  createdAt: Date;
  data?: Record<string, unknown>;
}

export const notificationsService = {
  async create(data: Omit<Notification, 'id' | 'read' | 'createdAt'>): Promise<string> {
    const docRef = await addDoc(collection(db, COLLECTIONS.NOTIFICATIONS), {
      ...data,
      read: false,
      createdAt: Timestamp.now(),
    });
    return docRef.id;
  },

  async markAsRead(notificationId: string) {
    await updateDoc(doc(db, COLLECTIONS.NOTIFICATIONS, notificationId), { read: true });
  },

  async markAllAsRead(userId: string) {
    const q = query(
      collection(db, COLLECTIONS.NOTIFICATIONS),
      where('userId', '==', userId),
      where('read', '==', false)
    );
    const snapshot = await getDocs(q);
    const updates = snapshot.docs.map((docSnap) =>
      updateDoc(doc(db, COLLECTIONS.NOTIFICATIONS, docSnap.id), { read: true })
    );
    await Promise.all(updates);
  },

  async clearAll(userId: string) {
    const q = query(
      collection(db, COLLECTIONS.NOTIFICATIONS),
      where('userId', '==', userId)
    );
    const snapshot = await getDocs(q);
    const deletes = snapshot.docs.map((docSnap) =>
      deleteDoc(doc(db, COLLECTIONS.NOTIFICATIONS, docSnap.id))
    );
    await Promise.all(deletes);
  },

  subscribe(userId: string, callback: (notifications: Notification[]) => void) {
    const q = query(
      collection(db, COLLECTIONS.NOTIFICATIONS),
      where('userId', '==', userId),
      orderBy('createdAt', 'desc')
    );
    return onSnapshot(q, (snapshot) => {
      const notifications = snapshot.docs.map((docSnap) => {
        const data = docSnap.data();
        return {
          ...data,
          id: docSnap.id,
          createdAt: convertTimestamp(data.createdAt),
        } as Notification;
      });
      callback(notifications);
    });
  },
};
