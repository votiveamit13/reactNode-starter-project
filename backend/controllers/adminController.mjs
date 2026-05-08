import Admin from "../models/Admin.mjs";
import Staff from "../models/Staff.mjs";
import BidType from "../models/BidType.mjs";


// Keep only necessary exports, remove Portal related

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.json({ success: false, msg: "Email & Password required" });
    }

    const admin = await Admin.findOne({
      where: { email: email, password: password }
    });

    if (admin) {
      res.json({ success: true, data: admin });
    } else {
      res.json({ success: false, msg: "Invalid login" });
    }

  } catch (err) {
    res.json({ success: false, msg: "DB Error", error: err });
  }
};

// Staff routes
export const createStaff = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.json({ success: false, msg: "All fields required" });
    }

    const exists = await Staff.findOne({ where: { email } });

    if (exists) {
      return res.json({ success: false, msg: "Email already exists" });
    }

    await Staff.create({ name, email, password });

    res.json({ success: true, msg: "Staff Created Successfully" });

  } catch (err) {
    res.json({ success: false, msg: "Error", error: err });
  }
};

export const getStaff = async (req, res) => {
  const data = await Staff.findAll();
  res.json(data);
};

export const updateStaff = async (req, res) => {
  const { id, name, email, password } = req.body;
  await Staff.update({ name, email, password }, { where: { id } });
  res.json({ success: true });
};

export const deleteStaff = async (req, res) => {
  const { id } = req.params;
  await Staff.destroy({ where: { id } });  
  res.json({ success: true });
};

// Bid Type routes
export const createBidType = async (req, res) => {
  try {
    const { name } = req.body;
    if (!name) return res.json({ success: false, msg: "Name required" });
    await BidType.create({ name });
    res.json({ success: true, msg: "Bid Type Added" });
  } catch (err) {
    res.json({ success: false, msg: "Error", error: err });
  }
};

export const getBidTypes = async (req, res) => {
  const data = await BidType.findAll();
  res.json(data);
};

export const updateBidType = async (req, res) => {
  const { id, name } = req.body;
  await BidType.update({ name }, { where: { id } });
  res.json({ success: true });
};

export const deleteBidType = async (req, res) => {
  const { id } = req.params;
  await BidType.destroy({ where: { id } });
  res.json({ success: true });
};

// CREATE PROJECT BUDGET - Simple version
export const createProjectBudget = async (req, res) => {
  try {
    const {
      projectType,
      budgetType,
      portalName,
      budgetRanges
    } = req.body;

    console.log("Received:", { projectType, budgetType, portalName, budgetRanges });

    if (!projectType || !budgetType || !portalName || !budgetRanges) {
      return res.json({ success: false, msg: "All fields are required" });
    }

    const projectBudget = await ProjectBudget.create({
      projectType,
      budgetType,
       portalName: portalName,
      budgetRanges
    });

    res.json({ success: true, msg: "Project Budget Created Successfully", data: projectBudget });

  } catch (err) {
    console.error("Error:", err);
    res.json({ success: false, msg: "Error creating project budget", error: err.message });
  }
};

// GET ALL PROJECT BUDGETS
export const getProjectBudgets = async (req, res) => {
  try {
    const budgets = await ProjectBudget.findAll({
      order: [['createdAt', 'DESC']]
    });
    
    // Make sure response format is consistent
    res.json({ success: true, data: budgets });
  } catch (err) {
    console.error("Error:", err);
    res.json({ success: false, msg: "Error fetching data", error: err.message });
  }
};

// DELETE PROJECT BUDGET
export const deleteProjectBudget = async (req, res) => {
  try {
    const { id } = req.params;
    const budget = await ProjectBudget.findByPk(id);
    
    if (!budget) {
      return res.json({ success: false, msg: "Budget not found" });
    }

    await budget.destroy();
    res.json({ success: true, msg: "Project Budget Deleted Successfully" });
  } catch (err) {
    res.json({ success: false, msg: "Error deleting data", error: err.message });
  }
};

// TOGGLE STATUS
export const toggleBudgetStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const budget = await ProjectBudget.findByPk(id);
    
    if (!budget) {
      return res.json({ success: false, msg: "Budget not found" });
    }

    await budget.update({ status: !budget.status });
    res.json({ success: true, msg: "Status updated successfully" });
  } catch (err) {
    res.json({ success: false, msg: "Error updating status", error: err.message });
  }
};


// ==================== PROJECT TYPE MASTER CRUD ====================

export const createProjectTypeMaster = async (req, res) => {
  try {
    const { name, description } = req.body;
    
    if (!name) {
      return res.json({ success: false, msg: "Name is required" });
    }
    
    const projectType = await ProjectTypeMaster.create({ name, description });
    res.json({ success: true, msg: "Project Type created successfully", data: projectType });
  } catch (err) {
    console.error("Error:", err);
    res.json({ success: false, msg: "Error creating project type", error: err.message });
  }
};

export const getProjectTypeMasters = async (req, res) => {
  try {
    const projectTypes = await ProjectTypeMaster.findAll({
      order: [['createdAt', 'DESC']]
    });
    res.json({ success: true, data: projectTypes });
  } catch (err) {
    console.error("Error:", err);
    res.json({ success: false, msg: "Error fetching data", error: err.message });
  }
};

export const updateProjectTypeMaster = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, status } = req.body;
    
    const projectType = await ProjectTypeMaster.findByPk(id);
    if (!projectType) {
      return res.json({ success: false, msg: "Project Type not found" });
    }
    
    await projectType.update({ name, description, status });
    res.json({ success: true, msg: "Project Type updated successfully", data: projectType });
  } catch (err) {
    console.error("Error:", err);
    res.json({ success: false, msg: "Error updating project type", error: err.message });
  }
};

export const deleteProjectTypeMaster = async (req, res) => {
  try {
    const { id } = req.params;
    const projectType = await ProjectTypeMaster.findByPk(id);
    
    if (!projectType) {
      return res.json({ success: false, msg: "Project Type not found" });
    }
    
    await projectType.destroy();
    res.json({ success: true, msg: "Project Type deleted successfully" });
  } catch (err) {
    console.error("Error:", err);
    res.json({ success: false, msg: "Error deleting project type", error: err.message });
  }
};

export const toggleProjectTypeStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const projectType = await ProjectTypeMaster.findByPk(id);
    
    if (!projectType) {
      return res.json({ success: false, msg: "Project Type not found" });
    }
    
    await projectType.update({ status: !projectType.status });
    res.json({ success: true, msg: "Status updated successfully" });
  } catch (err) {
    console.error("Error:", err);
    res.json({ success: false, msg: "Error updating status", error: err.message });
  }
};

// ==================== PROJECT TYPE DETAILS (Nested Entries) ====================

export const createProjectTypeDetail = async (req, res) => {
  try {
    const { projectTypeMasterId, subTypeName, minBudget, maxBudget, description } = req.body;
    
    if (!projectTypeMasterId || !subTypeName) {
      return res.json({ success: false, msg: "Project Type Master ID and Sub Type Name are required" });
    }
    
    const detail = await ProjectTypeDetail.create({
      projectTypeMasterId,
      subTypeName,
      minBudget,
      maxBudget,
      description
    });
    
    res.json({ success: true, msg: "Detail added successfully", data: detail });
  } catch (err) {
    console.error("Error:", err);
    res.json({ success: false, msg: "Error creating detail", error: err.message });
  }
};

export const getProjectTypeDetails = async (req, res) => {
  try {
    const { masterId } = req.params;
    const details = await ProjectTypeDetail.findAll({
      where: { projectTypeMasterId: masterId },
      order: [['createdAt', 'DESC']]
    });
    res.json({ success: true, data: details });
  } catch (err) {
    console.error("Error:", err);
    res.json({ success: false, msg: "Error fetching details", error: err.message });
  }
};

export const updateProjectTypeDetail = async (req, res) => {
  try {
    const { id } = req.params;
    const { subTypeName, minBudget, maxBudget, description, status } = req.body;
    
    const detail = await ProjectTypeDetail.findByPk(id);
    if (!detail) {
      return res.json({ success: false, msg: "Detail not found" });
    }
    
    await detail.update({ subTypeName, minBudget, maxBudget, description, status });
    res.json({ success: true, msg: "Detail updated successfully", data: detail });
  } catch (err) {
    console.error("Error:", err);
    res.json({ success: false, msg: "Error updating detail", error: err.message });
  }
};

export const deleteProjectTypeDetail = async (req, res) => {
  try {
    const { id } = req.params;
    const detail = await ProjectTypeDetail.findByPk(id);
    
    if (!detail) {
      return res.json({ success: false, msg: "Detail not found" });
    }
    
    await detail.destroy();
    res.json({ success: true, msg: "Detail deleted successfully" });
  } catch (err) {
    console.error("Error:", err);
    res.json({ success: false, msg: "Error deleting detail", error: err.message });
  }
};

// ==================== BUDGET TYPE MASTER CRUD ====================

export const createBudgetTypeMaster = async (req, res) => {
  try {
    const { name, code, description } = req.body;
    
    if (!name) {
      return res.json({ success: false, msg: "Name is required" });
    }
    
    const budgetType = await BudgetTypeMaster.create({ name, code, description });
    res.json({ success: true, msg: "Budget Type created successfully", data: budgetType });
  } catch (err) {
    console.error("Error:", err);
    res.json({ success: false, msg: "Error creating budget type", error: err.message });
  }
};

export const getBudgetTypeMasters = async (req, res) => {
  try {
    const budgetTypes = await BudgetTypeMaster.findAll({
      order: [['createdAt', 'DESC']]
    });
    res.json({ success: true, data: budgetTypes });
  } catch (err) {
    console.error("Error:", err);
    res.json({ success: false, msg: "Error fetching data", error: err.message });
  }
};

export const updateBudgetTypeMaster = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, code, description, status } = req.body;
    
    const budgetType = await BudgetTypeMaster.findByPk(id);
    if (!budgetType) {
      return res.json({ success: false, msg: "Budget Type not found" });
    }
    
    await budgetType.update({ name, code, description, status });
    res.json({ success: true, msg: "Budget Type updated successfully", data: budgetType });
  } catch (err) {
    console.error("Error:", err);
    res.json({ success: false, msg: "Error updating budget type", error: err.message });
  }
};

export const deleteBudgetTypeMaster = async (req, res) => {
  try {
    const { id } = req.params;
    const budgetType = await BudgetTypeMaster.findByPk(id);
    
    if (!budgetType) {
      return res.json({ success: false, msg: "Budget Type not found" });
    }
    
    await budgetType.destroy();
    res.json({ success: true, msg: "Budget Type deleted successfully" });
  } catch (err) {
    console.error("Error:", err);
    res.json({ success: false, msg: "Error deleting budget type", error: err.message });
  }
};

export const toggleBudgetTypeStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const budgetType = await BudgetTypeMaster.findByPk(id);
    
    if (!budgetType) {
      return res.json({ success: false, msg: "Budget Type not found" });
    }
    
    await budgetType.update({ status: !budgetType.status });
    res.json({ success: true, msg: "Status updated successfully" });
  } catch (err) {
    console.error("Error:", err);
    res.json({ success: false, msg: "Error updating status", error: err.message });
  }
};

// ==================== BUDGET TYPE DETAILS ====================

export const createBudgetTypeDetail = async (req, res) => {
  try {
    const { budgetTypeMasterId, rangeName, minValue, maxValue, description } = req.body;
    
    if (!budgetTypeMasterId || !rangeName) {
      return res.json({ success: false, msg: "Budget Type Master ID and Range Name are required" });
    }
    
    const detail = await BudgetTypeDetail.create({
      budgetTypeMasterId,
      rangeName,
      minValue,
      maxValue,
      description
    });
    
    res.json({ success: true, msg: "Detail added successfully", data: detail });
  } catch (err) {
    console.error("Error:", err);
    res.json({ success: false, msg: "Error creating detail", error: err.message });
  }
};

export const getBudgetTypeDetails = async (req, res) => {
  try {
    const { masterId } = req.params;
    const details = await BudgetTypeDetail.findAll({
      where: { budgetTypeMasterId: masterId },
      order: [['createdAt', 'DESC']]
    });
    res.json({ success: true, data: details });
  } catch (err) {
    console.error("Error:", err);
    res.json({ success: false, msg: "Error fetching details", error: err.message });
  }
};

export const updateBudgetTypeDetail = async (req, res) => {
  try {
    const { id } = req.params;
    const { rangeName, minValue, maxValue, description, status } = req.body;
    
    const detail = await BudgetTypeDetail.findByPk(id);
    if (!detail) {
      return res.json({ success: false, msg: "Detail not found" });
    }
    
    await detail.update({ rangeName, minValue, maxValue, description, status });
    res.json({ success: true, msg: "Detail updated successfully", data: detail });
  } catch (err) {
    console.error("Error:", err);
    res.json({ success: false, msg: "Error updating detail", error: err.message });
  }
};

export const deleteBudgetTypeDetail = async (req, res) => {
  try {
    const { id } = req.params;
    const detail = await BudgetTypeDetail.findByPk(id);
    
    if (!detail) {
      return res.json({ success: false, msg: "Detail not found" });
    }
    
    await detail.destroy();
    res.json({ success: true, msg: "Detail deleted successfully" });
  } catch (err) {
    console.error("Error:", err);
    res.json({ success: false, msg: "Error deleting detail", error: err.message });
  }
};

// ==================== PORTAL NAME MASTER CRUD ====================

export const createPortalNameMaster = async (req, res) => {
  try {
    const { name, url, description } = req.body;
    
    if (!name) {
      return res.json({ success: false, msg: "Name is required" });
    }
    
    const portal = await PortalNameMaster.create({ name, url, description });
    res.json({ success: true, msg: "Portal created successfully", data: portal });
  } catch (err) {
    console.error("Error:", err);
    res.json({ success: false, msg: "Error creating portal", error: err.message });
  }
};

export const getPortalNameMasters = async (req, res) => {
  try {
    const portals = await PortalNameMaster.findAll({
      order: [['createdAt', 'DESC']]
    });
    res.json({ success: true, data: portals });
  } catch (err) {
    console.error("Error:", err);
    res.json({ success: false, msg: "Error fetching data", error: err.message });
  }
};

export const updatePortalNameMaster = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, url, description, status } = req.body;
    
    const portal = await PortalNameMaster.findByPk(id);
    if (!portal) {
      return res.json({ success: false, msg: "Portal not found" });
    }
    
    await portal.update({ name, url, description, status });
    res.json({ success: true, msg: "Portal updated successfully", data: portal });
  } catch (err) {
    console.error("Error:", err);
    res.json({ success: false, msg: "Error updating portal", error: err.message });
  }
};

export const deletePortalNameMaster = async (req, res) => {
  try {
    const { id } = req.params;
    const portal = await PortalNameMaster.findByPk(id);
    
    if (!portal) {
      return res.json({ success: false, msg: "Portal not found" });
    }
    
    await portal.destroy();
    res.json({ success: true, msg: "Portal deleted successfully" });
  } catch (err) {
    console.error("Error:", err);
    res.json({ success: false, msg: "Error deleting portal", error: err.message });
  }
};

export const togglePortalNameStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const portal = await PortalNameMaster.findByPk(id);
    
    if (!portal) {
      return res.json({ success: false, msg: "Portal not found" });
    }
    
    await portal.update({ status: !portal.status });
    res.json({ success: true, msg: "Status updated successfully" });
  } catch (err) {
    console.error("Error:", err);
    res.json({ success: false, msg: "Error updating status", error: err.message });
  }
};

// ==================== PORTAL NAME DETAILS ====================

export const createPortalNameDetail = async (req, res) => {
  try {
    const { portalNameMasterId, subPortalName, url, description } = req.body;
    
    if (!portalNameMasterId || !subPortalName) {
      return res.json({ success: false, msg: "Portal Master ID and Sub Portal Name are required" });
    }
    
    const detail = await PortalNameDetail.create({
      portalNameMasterId,
      subPortalName,
      url,
      description
    });
    
    res.json({ success: true, msg: "Detail added successfully", data: detail });
  } catch (err) {
    console.error("Error:", err);
    res.json({ success: false, msg: "Error creating detail", error: err.message });
  }
};

export const getPortalNameDetails = async (req, res) => {
  try {
    const { masterId } = req.params;
    const details = await PortalNameDetail.findAll({
      where: { portalNameMasterId: masterId },
      order: [['createdAt', 'DESC']]
    });
    res.json({ success: true, data: details });
  } catch (err) {
    console.error("Error:", err);
    res.json({ success: false, msg: "Error fetching details", error: err.message });
  }
};

export const updatePortalNameDetail = async (req, res) => {
  try {
    const { id } = req.params;
    const { subPortalName, url, description, status } = req.body;
    
    const detail = await PortalNameDetail.findByPk(id);
    if (!detail) {
      return res.json({ success: false, msg: "Detail not found" });
    }
    
    await detail.update({ subPortalName, url, description, status });
    res.json({ success: true, msg: "Detail updated successfully", data: detail });
  } catch (err) {
    console.error("Error:", err);
    res.json({ success: false, msg: "Error updating detail", error: err.message });
  }
};

export const deletePortalNameDetail = async (req, res) => {
  try {
    const { id } = req.params;
    const detail = await PortalNameDetail.findByPk(id);
    
    if (!detail) {
      return res.json({ success: false, msg: "Detail not found" });
    }
    
    await detail.destroy();
    res.json({ success: true, msg: "Detail deleted successfully" });
  } catch (err) {
    console.error("Error:", err);
    res.json({ success: false, msg: "Error deleting detail", error: err.message });
  }
};