// import { Schema, model } from "mongoose";

// export interface ICompany {
//   name: string;
//   industry: string;
//   size: string;
//   website?: string;
//   description?: string;
// }

// const companySchema = new Schema<ICompany>({
//   name: { type: String, required: true },
//   industry: { type: String, required: true },
//   size: { type: String, required: true },
//   website: { type: String },
//   description: { type: String },
// }, { timestamps: true });

// export const Company = model<ICompany>("Company", companySchema);


import mongoose, { Schema, model } from "mongoose";

export interface ICompany {
  name: string;
  industry?: string;
  size?: string;
  website?: string;
  description?: string;
}

const companySchema = new Schema<ICompany>({
  name: { type: String, required: true, unique: true },
  industry: { type: String },
  size: { type: String },
  website: { type: String },
  description: { type: String }
}, { timestamps: true });

// Guarded model creation to avoid OverwriteModelError
export const Company =
  (mongoose.models.Company as mongoose.Model<ICompany>) ||
  model<ICompany>("Company", companySchema);

export default Company;