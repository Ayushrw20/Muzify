import { v2 as cloudinary } from 'cloudinary';
import fs from "fs";

cloudinary.config({
    cloud_name: 'dr89vdded',
    api_key: '848138291126733',
    api_secret: process.env.CLOUDINARY_API_KEY
});

async function uploadAudio(audioFilePath) {
    try {
        const uploadResult = await cloudinary.uploader.upload(audioFilePath, { 
            resource_type: "video",
            folder: "muzify/songs" 
        })
    
        console.log(uploadResult.secure_url);
        const url = uploadResult.secure_url;
        //TODO

        fs.unlink(audioFilePath, (err) => {
            if(err) {
                console.log("Error deleting audio", err);
            }
        })
    }
    catch(error) {
        console.log("Error uploading audio", error);
    }
}

export default uploadAudio;