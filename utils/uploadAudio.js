import { v2 as cloudinary } from 'cloudinary';
import fs from "fs";
import Song from "../models/song.js";

cloudinary.config({
    cloud_name: 'dr89vdded',
    api_key: '848138291126733',
    api_secret: process.env.CLOUDINARY_API_KEY
});

async function uploadAudio(audioFilePath, songId) {
    try {
        const uploadResult = await cloudinary.uploader.upload(audioFilePath, { 
            resource_type: "video",
            folder: "muzify/songs" 
        })
    
        // console.log(uploadResult.secure_url);
        const songUrl = uploadResult.secure_url;
        
        try {
            await Song.create({ songId, songUrl });
        }
        catch(error) {
            console.log("Error storing audio url", error);
        }
        
        fs.unlink(audioFilePath, (err) => {
            if(err) {
                console.log("Error deleting audio", err);
            }
        })
        
        return songUrl;
    }
    catch(error) {
        console.log("Error uploading audio", error);
    }
}

export default uploadAudio;