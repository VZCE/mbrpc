const axios = require("axios");

const apiUrl = process.env.API_URL;

async function getNowPlayingInfo(apiUrl) {
  if (!apiUrl) {
    console.error("Missing API_URL in .env file");
    return null;
  }
  try {
    const requests = [
      axios.post(apiUrl + "/NowPlaying_GetFileTags", {
        fields: [65, 30, 32],
      }),
      axios.post(apiUrl + "/NowPlaying_GetFileUrl", {}),
      axios.post(apiUrl + "/NowPlaying_GetDuration", {}),
      axios.post(apiUrl + "/Player_GetPosition", {}),
    ];

    const [
      fileTagsResponse,
      fileUrlResponse,
      fileDurationResponse,
      fileGetPositionResponse,
    ] = await Promise.all(requests);

    if (
      fileTagsResponse.status === 200 &&
      fileUrlResponse.status === 200 &&
      fileDurationResponse.status === 200 &&
      fileGetPositionResponse.status === 200
    ) {
      const fileTags = fileTagsResponse.data;
      const fileUrl = fileUrlResponse.data;
      const fileDuration = fileDurationResponse.data / 60000;
      const fileGetPosition = fileGetPositionResponse.data / 60000;

      const [trackTitle, album, artist] = fileTags;
      return {
        trackTitle,
        album,
        artist,
        fileDuration,
        fileGetPosition,
        fileUrl,
      };
    } else {
      console.error(
        "Error:",
        fileTagsResponse.status,
        fileUrlResponse.status,
        fileDurationResponse.status,
        fileGetPositionResponse.status
      );
      return null;
    }
  } catch (error) {
    console.error("Error:", error.message);
    return null;
  }
}

module.exports = { getNowPlayingInfo };
