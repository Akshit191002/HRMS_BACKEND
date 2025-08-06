import express from "express";
import * as employeeController from '../controller/employee';
import { authenticateFirebaseUser } from "../../auth/middlewares/authenticateFirebaseUser";

const route = express.Router()
route.post('/employees', authenticateFirebaseUser, async (req, res) => {
  try {
    let { title, firstName, lastName, email, gender, phone, joiningDate, department, designation, location, reportingManager, workingPattern, holidayGroup, ctc, payslipComponent } = req.body;

    const empCode = await employeeController.generateEmpId(department);

    if (!lastName) {
      lastName = firstName;
    }

    const generalData = {
      empCode,
      name: {
        title,
        first: firstName.trim(),
        last: lastName.trim()
      },
      primaryEmail: email,
      gender,
      phoneNum: {
        code: "+91",
        num: phone
      }
    };

    const professionalData = {
      joiningDate, department,
      designation, location,
      reportingManager, holidayGroup,
      workWeek: workingPattern,
      ctcAnnual: ctc,
      payslipComponent
    };

    const employee = await employeeController.addEmployee(generalData, professionalData);
    res.status(201).json(employee);

  } catch (error) {
    res.status(400).json({ error: (error as Error).message });
  }
});

route.get('/employees', authenticateFirebaseUser, async (req, res) => {
  try {
    const employees = await employeeController.getAllEmployees();
    res.json(employees);
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
});

route.get('/employees/:id', authenticateFirebaseUser, async (req, res) => {
  try {
    const data = await employeeController.getEmployeeById(req.params.id);
    res.json(data);
  } catch (err) {
    res.status(404).json({ error: (err as Error).message });
  }
});

route.patch('/employees/status/:id', authenticateFirebaseUser, async (req, res) => {
  try {
    const { status } = req.body;
    if (!status) throw new Error("Status is required");

    const data = await employeeController.changeStatus(req.params.id, status);
    res.json(data);
  } catch (err) {
    res.status(404).json({ error: (err as Error).message });
  }
})

route.delete('/employees/:id', authenticateFirebaseUser, async (req, res) => {
  try {
    const data = await employeeController.deleteEmployee(req.params.id);
    res.json(data);
  } catch (err) {
    res.status(404).json({ error: (err as Error).message });
  }
})

route.patch('/employees/general/:id', authenticateFirebaseUser, async (req, res) => {
  try {
    const updated = await employeeController.editGeneralInfo(req.params.id, req.body);
    res.status(200).json(updated);
  } catch (error) {
    res.status(400).json({ error: (error as Error).message });
  }
});

route.patch('/employees/professional/:id', authenticateFirebaseUser, async (req, res) => {
  try {
    const updated = await employeeController.editProfessionalInfo(req.params.id, req.body);
    res.status(200).json(updated);
  } catch (error) {
    res.status(400).json({ error: (error as Error).message });
  }
});

route.post('/employees/bank/:id', authenticateFirebaseUser, async (req, res) => {
  try {
    const bank = await employeeController.addBankDetails(req.params.id, req.body)
    res.status(201).json(bank);
  } catch (error) {
    res.status(400).json({ error: (error as Error).message });
  }

})

route.patch('/employees/bank/:id', authenticateFirebaseUser, async (req, res) => {
  try {
    const updated = await employeeController.editBankDetails(req.params.id, req.body);
    res.status(200).json(updated);
  } catch (error) {
    res.status(400).json({ error: (error as Error).message });
  }
});

route.get('/employees/all/:code', authenticateFirebaseUser, async (req, res) => {
  try {
    const data = await employeeController.getCompleteEmployeeDetailsByCode(req.params.code);
    res.json(data);
  } catch (err) {
    res.status(404).json({ error: (err as Error).message });
  }
})

route.post('/employees/loan/:id', authenticateFirebaseUser, async (req, res) => {
  try {
    const bank = await employeeController.createLoanRequest(req.params.id, req.body)
    res.status(201).json(bank);
  } catch (error) {
    res.status(400).json({ error: (error as Error).message });
  }
})

route.post('/employees/approvedLoan/:id', authenticateFirebaseUser, async (req, res) => {
  try {
    const bank = await employeeController.approvedLoan(req.params.id, req.body)
    res.status(201).json(bank);
  } catch (error) {
    res.status(400).json({ error: (error as Error).message });
  }
})

route.post('/employees/cancelLoan/:id', authenticateFirebaseUser, async (req, res) => {
  try {
    const { cancelReason } = req.body;
    const bank = await employeeController.cancelLoan(req.params.id, cancelReason)
    res.status(201).json(bank);
  } catch (error) {
    res.status(400).json({ error: (error as Error).message });
  }
})

route.patch('/employees/loan/:id', authenticateFirebaseUser, async (req, res) => {
  try {
    const bank = await employeeController.editLoan(req.params.id, req.body)
    res.status(201).json(bank);
  } catch (error) {
    res.status(400).json({ error: (error as Error).message });
  }
})

route.post('/employees/proviousJob/:id', authenticateFirebaseUser, async (req, res) => {
  try {
    const bank = await employeeController.addPreviousJob(req.params.id, req.body)
    res.status(201).json(bank);
  } catch (error) {
    res.status(400).json({ error: (error as Error).message });
  }
})

route.patch('/employees/proviousJob/:id', authenticateFirebaseUser, async (req, res) => {
  try {
    const bank = await employeeController.editPreviousJob(req.params.id, req.body)
    res.status(201).json(bank);
  } catch (error) {
    res.status(400).json({ error: (error as Error).message });
  }
})

export default route;