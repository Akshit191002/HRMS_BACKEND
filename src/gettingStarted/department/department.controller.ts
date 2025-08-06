import { Request, Response } from "express";
import { createDepartment, getAllDepartments } from "./department.service";
import { Department } from "./department.model";

export const addDepartment = async (req: Request, res: Response) => {
  try {
    const { name, code, description, status } = req.body;
    const createdBy = req.user?.uid || "unknown";

    const newDepartment: Department = {
      name,
      code,
      description,
      status,
      createdBy,
      createdAt: new Date().toISOString(),
    };

    const id = await createDepartment(newDepartment);
    res.status(201).json({ message: "Department created", id });
  } catch (error: any) {
    res
      .status(500)
      .json({ message: "Failed to create department", error: error.message });
  }
};

export const fetchDepartments = async (_req: Request, res: Response) => {
  try {
    const departments = await getAllDepartments();
    res.status(200).json(departments);
  } catch (error: any) {
    res
      .status(500)
      .json({ message: "Failed to fetch departments", error: error.message });
  }
};
