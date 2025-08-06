import admin from "../../firebase";
import { Department } from "./department.model";

const db = admin.firestore();

export const createDepartment = async (department: Department): Promise<string> => {
  const docRef = await db.collection("departments").add(department);
  return docRef.id;
};

export const getAllDepartments = async (): Promise<Department[]> => {
  const snapshot = await db.collection("departments").get();
  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...(doc.data() as Department),
  }));
};
