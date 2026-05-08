import sequelize from "../config/db.mjs";
import User from "./User.mjs";
import Role from "./Role.mjs";
import Module from "./Module.mjs";
import RolePermission from "./RolePermission.mjs";
import Employee from "./Employee.mjs";
import EmployeeEmployment from "./EmployeeEmployment.mjs";
import EmployeeDocument from "./EmployeeDocument.mjs";
import EmployeeEducation from "./EmployeeEducation.mjs";
import EmployeeSkill from "./EmployeeSkill.mjs";
import EmployeeLanguage from "./EmployeeLanguage.mjs";
import EmployeeTraining from "./EmployeeTraining.mjs";
import EmployeeCertification from "./EmployeeCertification.mjs";
import Bid from "./Bid.mjs";
import EmployeeAttendance from "./EmployeeAttendance.mjs";
import BidType from './BidType.mjs';
import MasterProjectType from './MasterProjectType.mjs';
import MasterProjectSubType from "./MasterProjectSubType.mjs";
import MasterBudgetType from './MasterBudgetType.mjs';
import MasterPortalName from './MasterPortalName.mjs';
import MasterTag from './MasterTag.mjs';
import MasterFeature from './MasterFeature.mjs';
import MasterTechStack from './MasterTechStack.mjs';
import Project from "./Project.mjs";
import DailyUpdate from "./DailyUpdate.mjs";
import MasterCurrency from "./MasterCurrency.mjs";
import Finance from "./Finance.mjs";

import Portfolio from "./Portfolio.mjs";
import PortfolioTag from "./PortfolioTag.mjs";
import PortfolioFeature from "./PortfolioFeature.mjs";
import PortfolioTechStack from "./PortfolioTechStack.mjs";
import PortfolioImage from "./PortfolioImage.mjs";

import Question from "./Question.mjs";
import QuestionTag from "./QuestionTag.mjs";
import Deliverable from "./Deliverable.mjs";
import DeliverableTag from "./DeliverableTag.mjs";
import MonthlyBidTarget from "./MonthlyBidTarget.mjs";

import QuestionFeature from "./QuestionFeature.mjs";
import QuestionTechStack from "./QuestionTechStack.mjs";
import DeliverableFeature from "./DeliverableFeature.mjs";
import DeliverableTechStack from "./DeliverableTechStack.mjs";

import EmployeeSalary from "./EmployeeSalary.mjs";


User.belongsTo(Role, { foreignKey: "role_id" });
Role.hasMany(User, { foreignKey: "role_id" });

User.belongsTo(Employee, { foreignKey: "employee_id" });
Employee.hasOne(User, { foreignKey: "employee_id" });

RolePermission.belongsTo(Module, { foreignKey: "module_id", as: "Module" });
Module.hasMany(RolePermission, { foreignKey: "module_id", as: "RolePermissions" });

RolePermission.belongsTo(Role, { foreignKey: "role_id" });
Role.hasMany(RolePermission, { foreignKey: "role_id" });

Employee.hasOne(EmployeeEmployment, {
  foreignKey: "employee_id",
  as: "employment",
});
EmployeeEmployment.belongsTo(Employee, {
  foreignKey: "employee_id",
  as: "employee",
});

Employee.hasOne(EmployeeDocument, {
  foreignKey: "employee_id",
  as: "documents",
});
EmployeeDocument.belongsTo(Employee, {
  foreignKey: "employee_id",
  as: "employee",
});

Employee.hasMany(EmployeeEducation, {
  foreignKey: "employee_id",
  as: "educations",
});
EmployeeEducation.belongsTo(Employee, {
  foreignKey: "employee_id",
  as: "employee",
});

Employee.hasMany(EmployeeSkill, {
  foreignKey: "employee_id",
  as: "skills",
});
EmployeeSkill.belongsTo(Employee, {
  foreignKey: "employee_id",
  as: "employee",
});

Employee.hasMany(EmployeeLanguage, {
  foreignKey: "employee_id",
  as: "languages",
});
EmployeeLanguage.belongsTo(Employee, {
  foreignKey: "employee_id",
  as: "employee",
});

Employee.hasMany(EmployeeTraining, {
  foreignKey: "employee_id",
  as: "training",
});
EmployeeTraining.belongsTo(Employee, {
  foreignKey: "employee_id",
  as: "employee",
});

Employee.hasMany(EmployeeCertification, {
  foreignKey: "employee_id",
  as: "certifications",
});
EmployeeCertification.belongsTo(Employee, {
  foreignKey: "employee_id",
  as: "Employee",
});

Project.belongsTo(Employee, {
  foreignKey: "project_manager",
  as: "manager",
});

Employee.hasMany(Project, {
  foreignKey: "project_manager",
});

DailyUpdate.belongsTo(Employee, {
  foreignKey: "employee_id",
  as: "employee",
});

DailyUpdate.belongsTo(Project, {
  foreignKey: "project_id",
  as: "project",
});

Employee.hasMany(DailyUpdate, {
  foreignKey: "employee_id",
  as: "updates",
});

Project.hasMany(DailyUpdate, {
  foreignKey: "project_id",
  as: "updates",
});

// TAGS
Portfolio.belongsToMany(MasterTag, {
  through: PortfolioTag,
  foreignKey: "portfolio_id",
  otherKey: "tag_id",
});

// FEATURES
Portfolio.belongsToMany(MasterFeature, {
  through: PortfolioFeature,
  foreignKey: "portfolio_id",
  otherKey: "feature_id",
});

// TECH STACK
Portfolio.belongsToMany(MasterTechStack, {
  through: PortfolioTechStack,
  foreignKey: "portfolio_id",
  otherKey: "tech_stack_id",
});

// IMAGES
Portfolio.hasMany(PortfolioImage, {
  foreignKey: "portfolio_id",
});

// Question ↔ Tags
Question.belongsToMany(MasterTag, {
  through: QuestionTag,
  foreignKey: "question_id",
  otherKey: "tag_id",
});

// Question → Category
Question.belongsTo(MasterProjectType, {
  foreignKey: "category_id",
  as: "category",
});

// Deliverable ↔ Tags
Deliverable.belongsToMany(MasterTag, {
  through: DeliverableTag,
  foreignKey: "deliverable_id",
  otherKey: "tag_id",
});

MasterProjectType.hasMany(MasterProjectSubType, {
  foreignKey: "project_type_id",
});

MasterProjectSubType.belongsTo(MasterProjectType, {
  foreignKey: "project_type_id",
});

// Category
Portfolio.belongsTo(MasterProjectType, {
  foreignKey: "category",
  as: "categoryData",
});

// Sub Category
Portfolio.belongsTo(MasterProjectSubType, {
  foreignKey: "sub_category",
  as: "subCategoryData",
});

Deliverable.belongsTo(MasterProjectType, {
  foreignKey: "category_id",
  as: "category",
});

Deliverable.belongsTo(MasterProjectType, {
  foreignKey: "project_type_id",
  as: "projectType",
});

Question.belongsToMany(MasterFeature, {
  through: QuestionFeature,
  foreignKey: "question_id",
  otherKey: "feature_id",
});

MasterFeature.belongsToMany(Question, {
  through: QuestionFeature,
  foreignKey: "feature_id",
  otherKey: "question_id",
});

// TECH STACK
Question.belongsToMany(MasterTechStack, {
  through: QuestionTechStack,
  foreignKey: "question_id",
  otherKey: "tech_stack_id",
});

MasterTechStack.belongsToMany(Question, {
  through: QuestionTechStack,
  foreignKey: "tech_stack_id",
  otherKey: "question_id",
});

Deliverable.belongsToMany(MasterFeature, {
  through: DeliverableFeature,
  foreignKey: "deliverable_id",
  otherKey: "feature_id",
});

MasterFeature.belongsToMany(Deliverable, {
  through: DeliverableFeature,
  foreignKey: "feature_id",
  otherKey: "deliverable_id",
});

// TECH STACK
Deliverable.belongsToMany(MasterTechStack, {
  through: DeliverableTechStack,
  foreignKey: "deliverable_id",
  otherKey: "tech_stack_id",
});

MasterTechStack.belongsToMany(Deliverable, {
  through: DeliverableTechStack,
  foreignKey: "tech_stack_id",
  otherKey: "deliverable_id",
});

Employee.hasMany(EmployeeSalary, { foreignKey: "employee_id", as: "salaries" });
EmployeeSalary.belongsTo(Employee, { foreignKey: "employee_id" });
Finance.belongsTo(Project, {
  foreignKey: "project_id",
});

Finance.belongsTo(MasterCurrency, {
  foreignKey: "currency",
});

export {
  sequelize,
  User,
  Role,
  Module,
  RolePermission,
  Employee,
  EmployeeEmployment,
  EmployeeDocument,
  EmployeeEducation,
  EmployeeSkill,
  EmployeeLanguage,
  EmployeeTraining,
  EmployeeCertification,
  Bid,
  EmployeeAttendance,
  BidType,
  MasterProjectType,
  MasterProjectSubType,
  MasterBudgetType,
  MasterPortalName,
  MasterFeature,
  MasterTechStack,
  MasterTag,
  Project,
  DailyUpdate,
  Portfolio,
  PortfolioTag,
  PortfolioFeature,
  PortfolioTechStack,
  PortfolioImage,
  Question,
  QuestionTag,
  Deliverable,
  DeliverableTag,
  QuestionFeature,
  QuestionTechStack,
  DeliverableFeature,
  DeliverableTechStack,
  MonthlyBidTarget,
  EmployeeSalary,
  MasterCurrency,
  Finance
};