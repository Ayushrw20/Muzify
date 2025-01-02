import videoToAudio from "../utils/videoToAudio.js";
import getSong from "../utils/getSong.js";
import Song from "../models/song.js";

async function songByIdController(req, res) {
    const songId = req.params.id;

    if(!songId) {
        return res.status(400).json({ message: "No song id" });
    }

    try {
        const songInDb = await Song.findOne({ songId });
        if(songInDb) {
            return res.status(200).json({ songUrl: songInDb.songUrl });
        }

        const songUrl = await videoToAudio(songId);
        console.log(songUrl);
        if(songUrl) {
            return res.status(200).json({ songUrl });
        }
    }
    catch(error) {
        console.log(error);
        return res.status(500).json({ error });
    }
}

async function songByNameController(req, res) {
    const song  = req.params.song;
    
    if(!song) {
        return res.status(400).json({ message: "No song name" });        
    }
    
    const songs = await getSong(song);

    return res.status(200).json({
        message: "Song fetched sucessfully",
        songs
    });
}

export { songByIdController, songByNameController };