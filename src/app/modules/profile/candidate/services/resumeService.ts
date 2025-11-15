import { Resume } from "../models/Resume";

export const uploadResume = async (data: any) => {
  try {
    console.log("📝 Service: Uploading resume with data:", data);
    const resume = await Resume.create(data);
    console.log("✅ Service: Resume uploaded successfully:", resume._id);
    return resume;
  } catch (error: any) {
    console.error("❌ Service Error (upload resume):", error.message);
    throw error;
  }
};

export const getResumeByCandidate = async (candidateId: string) => {
  try {
    console.log("📝 Service: Getting resume for candidateId:", candidateId);
    const resume = await Resume.findOne({ candidate: candidateId });
    
    if (!resume) {
      console.log("⚠️ Service: Resume not found for candidateId:", candidateId);
    } else {
      console.log("✅ Service: Resume found:", resume._id);
    }
    
    return resume;
  } catch (error: any) {
    console.error("❌ Service Error (get resume):", error.message);
    throw error;
  }
};