import { v2 as cloudinary } from "cloudinary";
import dotenv from "dotenv";
dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const uploadOnCloudinary = async (localFilePath) => {
  try {
    if (!localFilePath) return null;

    const response = await cloudinary.uploader.upload(localFilePath, {
      resource_type: "auto",
      folder:"CRM"
    });


    return response;
  } catch (error) {
    console.log("Error in uploading localFilePath to cloudinary", error);
    return null;
  }
};

const deleteFromCloudinary = async (publicId) => {
  try {

    if (!publicId) return null;



    

    const response = await cloudinary.uploader.destroy(publicId);

    return response;
  } catch (error) {
    console.log("Error in deleting from cloudinary", error);
    return null;
  }
}

export { uploadOnCloudinary,deleteFromCloudinary };
