require("dotenv").config();

const axios = require("axios");
const { getNowPlayingInfo } = require("./src/api/extractTags");
const getPosition = require("./src/api/getPosition");
const fetchAndUploadArtwork = require("./src/artworks/extractArtwork");
const DiscordRPC = require("discord-rpc");

const clientId = process.env.CLIENT_ID;
const apiUrl = process.env.API_URL;

let newInfo = null;
let rpc = new DiscordRPC.Client({ transport: "ipc" });

async function updateDiscordRPC() {
  const title = " " + newInfo.trackTitle || "Untitled";
  const state = newInfo.artist || "unknown";
  const largeImageText = newInfo.album || "unknown";
  const largeImageKey =
    (await fetchAndUploadArtwork(newInfo.fileUrl)) || "unknown";
  const smallImageKey = process.env.SMALL_IMAGE_KEY || "unknown";

  rpc.setActivity({
    details: details,
    state: state,
    startTimestamp: Date.now() - newInfo.fileGetPosition * 60 * 1000,
    endTimestamp:
      Date.now() + (newInfo.fileDuration - newInfo.fileGetPosition) * 60 * 1000,
    largeImageKey: largeImageKey,
    largeImageText: largeImageText,
    smallImageKey: smallImageKey,
    smallImageText: "v0.3.3 by VNCE",
  });
}

async function checkForMusicChanges() {
  try {
    const playStateResponse = await axios.post(
      apiUrl + "/Player_GetPlayState",
      {}
    );
    const playState = playStateResponse.data;

    if (playState !== 3) {
      rpc.clearActivity();
      return null;
    }
    const nowPlayingInfo = await getNowPlayingInfo(apiUrl);
    if (JSON.stringify(nowPlayingInfo) !== JSON.stringify(newInfo)) {
      newInfo = nowPlayingInfo;
      await updateDiscordRPC(); // Only call updateDiscordRPC if the music information has changed
      console.log("Info retrieved:", newInfo);
    }
  } catch (error) {
    console.error("Error fetching music info:", error);
  }
}

async function runApp() {
  let isConnected = false;

  function connect() {
    rpc
      .login({ clientId })
      .then(() => {
        isConnected = true;
      })
      .catch((error) => {
        console.error("[Connection failed]:", error);
        isConnected = false;
        setTimeout(connect, 5000);
      });
  }

  rpc.on("ready", () => {
    isConnected = true;
    console.log("[Connected to #" + rpc.user.username + "]");
  });

  connect();

  // Verify if changes
  setInterval(() => {
    if (isConnected) {
      checkForMusicChanges();
    }
  }, 5000);
}

runApp();
