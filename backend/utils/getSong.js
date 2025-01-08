import YTMusic from "ytmusic-api";

async function getSong(song) {
    const ytmusic = new YTMusic();
    await ytmusic.initialize();

    const songs = await ytmusic.search(song);
    
    return songs.filter((song) => song.type == "SONG" || song.type == "VIDEO");
}

export default getSong;