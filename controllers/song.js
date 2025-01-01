import videoToAudio from "../utils/videoToAudio.js";
import getSong from "../utils/getSong.js";

async function songByIdController(req, res) {
    const songId = req.params.id;

    if(!songId) {
        return res.status(400).json({ message: "No song id" });
    }

    try {
        await videoToAudio(songId);
    }
    catch(error) {
        console.log(error);
        return res.status(500).json({ error });
    }

    return res.status(200).json({ message: "Audio extracted sucessfully" });
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