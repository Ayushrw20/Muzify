import youtubedl from 'youtube-dl-exec';
import path from "path";
import uploadAudio from './uploadAudio.js';

const __dirname = path.dirname(new URL(import.meta.url).pathname);

const audioFolderPath = path.resolve(__dirname, '../audio');

async function videoToAudio(songId) {
    const ytUrl = `https://www.youtube.com/watch?v=${songId}`;

    const outputFilePath = path.join(audioFolderPath, `${songId}.mp3`);

    try {
        await youtubedl(ytUrl, {
            extractAudio: true,
            audioFormat: 'mp3',
            output: outputFilePath
        });

        console.log("Audio extracted");
        await uploadAudio(outputFilePath, songId);
    } 
    catch (error) {
        console.error('Error extracting audio:', error.message);
        throw error;
    }
}

export default videoToAudio;