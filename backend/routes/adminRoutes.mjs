import express from 'express';
import {
  login,
  createStaff,
  getStaff,
  updateStaff,
  deleteStaff,
  createBidType,
  getBidTypes,
  updateBidType,
  deleteBidType,
  createProjectBudget,
  getProjectBudgets,
  deleteProjectBudget,
  toggleBudgetStatus,
  // New Master Controllers
  createProjectTypeMaster,
  getProjectTypeMasters,
  updateProjectTypeMaster,
  deleteProjectTypeMaster,
  toggleProjectTypeStatus,
  createProjectTypeDetail,
  getProjectTypeDetails,
  updateProjectTypeDetail,
  deleteProjectTypeDetail,
  createBudgetTypeMaster,
  getBudgetTypeMasters,
  updateBudgetTypeMaster,
  deleteBudgetTypeMaster,
  toggleBudgetTypeStatus,
  createBudgetTypeDetail,
  getBudgetTypeDetails,
  updateBudgetTypeDetail,
  deleteBudgetTypeDetail,
  createPortalNameMaster,
  getPortalNameMasters,
  updatePortalNameMaster,
  deletePortalNameMaster,
  togglePortalNameStatus,
  createPortalNameDetail,
  getPortalNameDetails,
  updatePortalNameDetail,
  deletePortalNameDetail
} from '../controllers/adminController.mjs';

const router = express.Router();

// Auth
router.post('/login', login);

// Staff routes
router.post('/staff', createStaff);
router.get('/staff', getStaff);
router.put('/staff', updateStaff);
router.delete('/staff/:id', deleteStaff);

// Bid Type routes
router.post('/bid-type', createBidType);
router.get('/bid-types', getBidTypes);
router.put('/bid-type', updateBidType);
router.delete('/bid-type/:id', deleteBidType);

// Project Budget routes
router.post('/project-budget', createProjectBudget);
router.get('/project-budgets', getProjectBudgets);
router.delete('/project-budget/:id', deleteProjectBudget);
router.patch('/project-budget/:id/toggle-status', toggleBudgetStatus);

// ========== PROJECT TYPE MASTER ROUTES ==========
router.post('/project-type-master', createProjectTypeMaster);
router.get('/project-type-masters', getProjectTypeMasters);
router.put('/project-type-master/:id', updateProjectTypeMaster);
router.delete('/project-type-master/:id', deleteProjectTypeMaster);
router.patch('/project-type-master/:id/toggle-status', toggleProjectTypeStatus);

// Project Type Details
router.post('/project-type-detail', createProjectTypeDetail);
router.get('/project-type-details/:masterId', getProjectTypeDetails);
router.put('/project-type-detail/:id', updateProjectTypeDetail);
router.delete('/project-type-detail/:id', deleteProjectTypeDetail);

// ========== BUDGET TYPE MASTER ROUTES ==========
router.post('/budget-type-master', createBudgetTypeMaster);
router.get('/budget-type-masters', getBudgetTypeMasters);
router.put('/budget-type-master/:id', updateBudgetTypeMaster);
router.delete('/budget-type-master/:id', deleteBudgetTypeMaster);
router.patch('/budget-type-master/:id/toggle-status', toggleBudgetTypeStatus);

// Budget Type Details
router.post('/budget-type-detail', createBudgetTypeDetail);
router.get('/budget-type-details/:masterId', getBudgetTypeDetails);
router.put('/budget-type-detail/:id', updateBudgetTypeDetail);
router.delete('/budget-type-detail/:id', deleteBudgetTypeDetail);

// ========== PORTAL NAME MASTER ROUTES ==========
router.post('/portal-name-master', createPortalNameMaster);
router.get('/portal-name-masters', getPortalNameMasters);
router.put('/portal-name-master/:id', updatePortalNameMaster);
router.delete('/portal-name-master/:id', deletePortalNameMaster);
router.patch('/portal-name-master/:id/toggle-status', togglePortalNameStatus);

// Portal Name Details
router.post('/portal-name-detail', createPortalNameDetail);
router.get('/portal-name-details/:masterId', getPortalNameDetails);
router.put('/portal-name-detail/:id', updatePortalNameDetail);
router.delete('/portal-name-detail/:id', deletePortalNameDetail);

export default router;