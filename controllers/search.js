import axios from "axios";
import { storeInDataBase } from "../services/database.js";

const searchHandler = async (req, res) => {
  const term = req.params.query;
  if (!term) {
    return res.status(400).send({ error: "Search Term is requird" });
  }
  try {
    const podcastFetch = await axios.get("https://itunes.apple.com/search", {
      params: {
        term: term,
        media: "podcast",
        entity: "podcast",
        limit: 10,
        // limit here can be anything but i used 12 for each because DynamoDB has a limit of 25 items per batch write operation
      },
      timeout: 8000,
    });
    const episodesFetch = await axios.get("https://itunes.apple.com/search", {
      params: {
        term: term,
        media: "podcast",
        entity: "podcastEpisode",
        limit: 10,
      },
      timeout: 8000,
    });
    const [podcastsRes, episodesRes] = await Promise.all([
      podcastFetch,
      episodesFetch,
    ]);
    const podcasts = podcastsRes.data.results;
    const episodes = episodesRes.data.results;
    try {
      storeInDataBase([...podcasts, ...episodes]).catch(console.error);
    } catch (error) {
      console.error(error);
    }

    return res.send({
      success: true,
      results: {
        podcasts: podcasts.map((p) => ({
          id: p.trackId,
          title: p.trackName,
          artist: p.artistName,
          artwork: p.artworkUrl600,
          genre: p.primaryGenreName,
        })),
        episodes: episodes.map((e) => ({
          id: e.trackId,
          title: e.trackName,
          artist: e.collectionName,
          shortDescription: e.shortDescription,
          description: e.description,
          date: e.releaseDate,
          duration: e.trackTimeMillis,
          audio: e.previewUrl,
          artwork: e.artworkUrl600,
        })),
      },
    });
  } catch (error) {
    console.error("API Error:", error);

    return res.code(500).send({
      error: "Search failed",
      details: error.message,
    });
  }
};
export { searchHandler };
