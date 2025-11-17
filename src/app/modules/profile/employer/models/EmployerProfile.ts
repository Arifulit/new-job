// // import { Schema, model, Types } from "mongoose";

// // export interface IEmployerProfile {
// //   user: Types.ObjectId;
// //   company: Types.ObjectId;
// //   designation: string;
// //   phone: string;
// //   website?: string;
// //   location?: string;
// // }

// // const employerProfileSchema = new Schema<IEmployerProfile>({
// //   user: { type: Schema.Types.ObjectId, ref: "User", required: true, unique: true },
// //   company: { type: Schema.Types.ObjectId, ref: "Company", required: true },
// //   designation: { type: String, required: true },
// //   phone: { type: String, required: true },
// //   website: { type: String },
// //   location: { type: String }
// // }, { timestamps: true });

// // export const EmployerProfile = model<IEmployerProfile>("EmployerProfile", employerProfileSchema);

// // ...existing code...
// import { Schema, model, Types } from "mongoose";

// export interface ICompany {
//   name: string;
//   industry?: string;
//   size?: string;
//   website?: string;
//   description?: string;
// }

// const companySchema = new Schema<ICompany>({
//   name: { type: String, required: true, unique: true },
//   industry: { type: String },
//   size: { type: String },
//   website: { type: String },
//   description: { type: String }
// }, { timestamps: true });

// export const Company = model<ICompany>("Company", companySchema);

// // EmployerProfile model (keep existing)
// export interface IEmployerProfile {
//   user: Types.ObjectId;       // reference to User
//   phone: string;
//   company: Types.ObjectId;    // reference to Company
//   designation: string;
// }

// const employerProfileSchema = new Schema<IEmployerProfile>({
//   user: { type: Schema.Types.ObjectId, ref: "User", required: true },
//   phone: { type: String, required: true },
//   company: { type: Schema.Types.ObjectId, ref: "Company", required: true },
//   designation: { type: String, required: true },
// }, { timestamps: true });

// export const EmployerProfile = model<IEmployerProfile>("EmployerProfile", employerProfileSchema);


// // added helpers
// export async function resolveCompany(company: string | Types.ObjectId) {
//   if (!company) throw new Error("Company value is required");
//   let companyDoc = null;

//   // if string and looks like ObjectId, try by id first
//   if (typeof company === "string" && Types.ObjectId.isValid(company)) {
//     companyDoc = await Company.findById(company);
//   }

//   // if not found by id or company is a name string, treat as name and find-or-create
//   if (!companyDoc) {
//     const name = typeof company === "string" ? company.trim() : undefined;
//     if (!name) {
//       // if company provided as ObjectId but not found
//       if (typeof company !== "string") {
//         companyDoc = await Company.findById(company);
//       }
//       if (!companyDoc) throw new Error("Company not found");
//     } else {
//       companyDoc = await Company.findOne({ name });
//       if (!companyDoc) {
//         companyDoc = await Company.create({ name });
//       }
//     }
//   }

//   return companyDoc;
// }

// export async function createEmployerProfile(params: {
//   user: Types.ObjectId | string;
//   phone: string;
//   company: Types.ObjectId | string; // id or name
//   designation: string;
// }) {
//   const { user, phone, company, designation } = params;
//   const companyDoc = await resolveCompany(company);

//   const userId =
//     typeof user === "string" && Types.ObjectId.isValid(user)
//       ? new Types.ObjectId(user)
//       : (user as Types.ObjectId);

//   const existing = await EmployerProfile.findOne({ user: userId });
//   if (existing) {
//     // update existing profile
//     existing.phone = phone;
//     existing.company = companyDoc._id;
//     existing.designation = designation;
//     await existing.save();
//     return existing;
//   }

//   const profile = await EmployerProfile.create({
//     user: userId,
//     phone,
//     company: companyDoc._id,
//     designation,
//   });

//   return profile;
// }

import mongoose, { Schema, model, Types } from "mongoose";
import Company from "../../../company/models/Company";
// import { Company } from "../../../../company/models/Company"; // adjust relative path if needed

export interface IEmployerProfile {
  user: Types.ObjectId;
  company: Types.ObjectId;
  designation: string;
  phone: string;
  website?: string;
  location?: string;
}

const employerProfileSchema = new Schema<IEmployerProfile>({
  user: { type: Schema.Types.ObjectId, ref: "User", required: true, unique: true },
  company: { type: Schema.Types.ObjectId, ref: "Company", required: true },
  designation: { type: String, required: true },
  phone: { type: String, required: true },
  website: { type: String },
  location: { type: String }
}, { timestamps: true });

// Guarded EmployerProfile model
export const EmployerProfile =
  (mongoose.models.EmployerProfile as mongoose.Model<IEmployerProfile>) ||
  model<IEmployerProfile>("EmployerProfile", employerProfileSchema);

// helpers (optional) — keep existing resolve/create helpers here if you use them
export async function resolveCompany(company: string | Types.ObjectId) {
  if (!company) throw new Error("Company value is required");
  let companyDoc: any = null;

  if (typeof company === "string" && Types.ObjectId.isValid(company)) {
    companyDoc = await Company.findById(company);
  }

  if (!companyDoc) {
    const name = typeof company === "string" ? company.trim() : undefined;
    if (!name) {
      if (typeof company !== "string") {
        companyDoc = await Company.findById(company);
      }
      if (!companyDoc) throw new Error("Company not found");
    } else {
      companyDoc = await Company.findOne({ name });
      if (!companyDoc) companyDoc = await Company.create({ name });
    }
  }

  return companyDoc;
}

export async function createEmployerProfile(params: {
  user: Types.ObjectId | string;
  phone: string;
  company: Types.ObjectId | string;
  designation: string;
}) {
  const { user, phone, company, designation } = params;
  const companyDoc = await resolveCompany(company);

  const userId =
    typeof user === "string" && Types.ObjectId.isValid(user)
      ? new Types.ObjectId(user)
      : (user as Types.ObjectId);

  const existing = await EmployerProfile.findOne({ user: userId });
  if (existing) {
    existing.phone = phone;
    existing.company = companyDoc._id;
    existing.designation = designation;
    await existing.save();
    return existing;
  }

  const profile = await EmployerProfile.create({
    user: userId,
    phone,
    company: companyDoc._id,
    designation,
  });

  return profile;
}