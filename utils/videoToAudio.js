import youtubedl from 'youtube-dl-exec';
// import { google } from "googleapis";
import fs from "fs";
import path from "path";
import uploadAudio from './uploadAudio.js';

const __dirname = path.dirname(new URL(import.meta.url).pathname);

const audioFolderPath = path.resolve(__dirname, '../audio');

// const auth = new google.auth.GoogleAuth({
//     keyFile: '../credentials.json',
//     scopes: ['https://www.googleapis.com/auth/drive.file'],
// });

// const drive = google.drive({ version: 'v3', auth });

async function videoToAudio(songId) {
    const ytUrl = `https://www.youtube.com/watch?v=${songId}`;

    const outputFilePath = path.join(audioFolderPath, `${songId}.mp3`);

    try {
        await youtubedl(ytUrl, {
          extractAudio: true,
          audioFormat: 'mp3',
          output: outputFilePath,
        });

        console.log("Audio extracted");

        await uploadAudio(outputFilePath);
    } 
    catch (error) {
        console.error('Error extracting audio:', error.message);
        throw error;
    }
}

export default videoToAudio;