import { Request, Response } from "express";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { initializeApp } from "firebase/app";
import { UserRole } from "../constants/roles";
import {
  checkSuperAdminExists,
  createUserWithRole,
  getUserDataByUid,
} from "../services/auth.service";
import firebaseConfig from "../../utils/firebaseClient";

const firebaseApp = initializeApp(firebaseConfig);
const firebaseAuth = getAuth(firebaseApp);

export const signupSuperAdmin = async (req: Request, res: Response) => {
  const { email, password, displayName } = req.body;

  try {
    const superAdminExists = await checkSuperAdminExists();

    if (superAdminExists) {
      return res.status(403).json({ message: "Super Admin already exists" });
    }

    const user = await createUserWithRole(
      email,
      password,
      displayName,
      UserRole.SUPER_ADMIN
    );

    return res.status(201).json({
      message: "Super Admin created successfully",
      uid: user.uid,
    });
  } catch (error: any) {
    return res.status(400).json({
      message: "Failed to create Super Admin",
      error: error.message,
    });
  }
};

export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  try {
    const userCredential = await signInWithEmailAndPassword(
      firebaseAuth,
      email,
      password
    );
    const token = await userCredential.user.getIdToken();
    const uid = userCredential.user.uid;

    const userData = await getUserDataByUid(uid);

    if (!userData) {
      return res.status(404).json({ message: "User not found in database" });
    }

    return res.status(200).json({
      message: "Login successful",
      uid,
      role: userData.role,
      token,
    });
  } catch (error: any) {
    return res.status(401).json({
      message: "Login failed",
      error: error.message,
    });
  }
};
