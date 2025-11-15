import { CandidateProfile } from "../models/CandidateProfile";

export const createCandidateProfile = async (data: any) => {
  try {
    console.log("📝 Service: Creating profile with data:", data);
    const profile = await CandidateProfile.create(data);
    console.log("✅ Service: Profile created successfully:", profile._id);
    return profile;
  } catch (error: any) {
    console.error("❌ Service Error (create):", error.message);
    throw error; // Re-throw to be handled by controller
  }
};

export const getCandidateProfile = async (userId: string) => {
  try {
    console.log("📝 Service: Getting profile for userId:", userId);
    const profile = await CandidateProfile.findOne({ user: userId }).populate("resume");
    
    if (!profile) {
      console.log("⚠️ Service: Profile not found for userId:", userId);
    } else {
      console.log("✅ Service: Profile found:", profile._id);
    }
    
    return profile;
  } catch (error: any) {
    console.error("❌ Service Error (get):", error.message);
    throw error;
  }
};

export const updateCandidateProfile = async (userId: string, data: any) => {
  try {
    console.log("📝 Service: Updating profile for userId:", userId);
    console.log("📝 Service: Update data:", data);
    
    const profile = await CandidateProfile.findOneAndUpdate(
      { user: userId }, 
      data, 
      { new: true, runValidators: true }
    );
    
    if (!profile) {
      console.log("⚠️ Service: Profile not found for update, userId:", userId);
    } else {
      console.log("✅ Service: Profile updated successfully:", profile._id);
    }
    
    return profile;
  } catch (error: any) {
    console.error("❌ Service Error (update):", error.message);
    throw error;
  }
};