import { Request, Response } from "express";
import * as adminService from "../services/adminProfileService";
import bcrypt from "bcryptjs";
import { AdminProfile } from "../models/AdminProfile";

// Create initial admin if not exists
export const ensureAdminExists = async () => {
  try {
    const adminEmail = "admin@example.com";
    let admin = await AdminProfile.findOne({ email: adminEmail });
    
    if (!admin) {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash("admin123", salt);
      
      admin = await adminService.createAdminProfile({
        name: "Admin User",
        email: adminEmail,
        password: hashedPassword,
        role: "admin" // Changed from "Admin" to "admin" to match enum
      });
      console.log("✅ Initial admin user created:", admin.email);
      console.log("🔑 Default password: admin123");
      console.log("⚠️ Please change this password after first login!");
    } else {
      console.log("ℹ️  Admin user already exists:", admin.email);
    }
    return admin;
  } catch (error) {
    console.error("❌ Error ensuring admin exists:", error);
    throw error;
  }
};

// Call this function when the server starts
ensureAdminExists().catch(console.error);

// Call this when the server starts
ensureAdminExists().catch(console.error);

export const createAdminController = async (req: Request, res: Response) => {
  try {
    const { password, ...adminData } = req.body;
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, 10);
    
    const admin = await adminService.createAdminProfile({
      ...adminData,
      password: hashedPassword
    });
    
    // Don't send password hash in response
    const { password: _, ...adminWithoutPassword } = admin.toObject();
    res.status(201).json({ success: true, data: adminWithoutPassword });
  } catch (error: any) {
    res.status(400).json({ 
      success: false, 
      message: error.message || "Failed to create admin" 
    });
  }
};

export const getAdminController = async (req: Request, res: Response) => {
  try {
    const admin = await adminService.getAdminProfile(req.params.id);
    if (!admin) {
      return res.status(404).json({ 
        success: false, 
        message: "Admin not found" 
      });
    }
    // Don't send password hash in response
    const { password, ...adminWithoutPassword } = admin.toObject();
    res.status(200).json({ success: true, data: adminWithoutPassword });
  } catch (error: any) {
    res.status(500).json({ 
      success: false, 
      message: error.message || "Error fetching admin" 
    });
  }
};

// In adminProfileController.ts
export const updateAdminController = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    // If password is being updated, hash it
    if (updateData.password) {
      const salt = await bcrypt.genSalt(10);
      updateData.password = await bcrypt.hash(updateData.password, salt);
    }

    const updatedAdmin = await adminService.updateAdminProfile(id, updateData);
    
    if (!updatedAdmin) {
      return res.status(404).json({
        success: false,
        message: "Admin profile not found"
      });
    }

    // Remove password from the response
    const { password, ...adminWithoutPassword } = updatedAdmin.toObject();
    
    res.status(200).json({
      success: true,
      data: adminWithoutPassword
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || "Error updating admin profile"
    });
  }
};

export const getAllAdminsController = async (req: Request, res: Response) => {
  try {
    const admins = await adminService.getAllAdmins();
    // Remove password from all admin objects
    const adminsWithoutPasswords = admins.map(admin => {
      const { password, ...adminWithoutPassword } = admin.toObject();
      return adminWithoutPassword;
    });
    res.status(200).json({ success: true, data: adminsWithoutPasswords });
  } catch (error: any) {
    res.status(500).json({ 
      success: false, 
      message: error.message || "Error fetching admins" 
    });
  }
};
