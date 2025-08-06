import { getFirestore } from "firebase-admin/firestore";
import { UserRole } from "../constants/roles";
import admin from "../../firebase";

const db = getFirestore();

export const createUserWithRole = async (
  email: string,
  password: string,
  displayName: string,
  role: UserRole
) => {
  const userRecord = await admin.auth().createUser({
    email,
    password,
    displayName,
  });

  await db.collection("users").doc(userRecord.uid).set({
    uid: userRecord.uid,
    email,
    displayName,
    role,
    createdAt: new Date().toISOString(),
  });

  return userRecord;
};

export const checkSuperAdminExists = async (): Promise<boolean> => {
  const snapshot = await db
    .collection("users")
    .where("role", "==", UserRole.SUPER_ADMIN)
    .limit(1)
    .get();

  return !snapshot.empty;
};

export const getUserDataByUid = async (
  uid: string
): Promise<{ role: UserRole } | null> => {
  const userDoc = await db.collection("users").doc(uid).get();

  if (!userDoc.exists) return null;

  const data = userDoc.data();
  return { role: data?.role };
};
