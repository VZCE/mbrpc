require("dotenv").config();

const fs = require("fs");
const path = require("path");
const crypto = require("crypto");
const imgbbUploader = require("imgbb-uploader");
const axios = require("axios");

const apiUrl = process.env.API_URL;
const apiKey = process.env.IMGBB_API_KEY;

const imageDataFile = path.join(__dirname, "imageData.json");

async function fetchAndUploadArtwork(filePath) {
  if (!apiUrl || !apiKey) {
    console.error("Missing API_URL or IMGBB_API_KEY in .env file");
    return null;
  }
  try {
    const response = await axios.post(apiUrl + "/NowPlaying_GetArtwork", {});
    if (response.status === 200) {
      const base64Data = response.data.replace(/^data:image\/png;base64,/, "");
      const hash = crypto.createHash("sha256").update(base64Data).digest("hex");
      const uniqueName = hash + ".png";

      // Charger les données existantes ou initialiser un objet vide
      let imageData = {};
      if (fs.existsSync(imageDataFile)) {
        const data = fs.readFileSync(imageDataFile, "utf8");
        imageData = JSON.parse(data);
      }

      // Vérifier si le hash existe déjà
      if (imageData[hash]) {
        console.log("[EXTRACTOR] Image already uploaded.");
        return imageData[hash]; // Retourne l'URL de l'image existante
      }

      const options = {
        apiKey: apiKey,
        base64string: base64Data,
        name: uniqueName,
      };

      return imgbbUploader(options)
        .then((response) => {
          console.log(
            "[EXTRACTOR] Image uploaded successfully:",
            response.thumb.url
          );
          // Ajouter le hash et l'URL de l'image au fichier JSON
          imageData[hash] = response.thumb.url;
          fs.writeFileSync(imageDataFile, JSON.stringify(imageData), "utf8");
          return response.thumb.url; // Retourne l'URL de l'image uploadée
        })
        .catch((error) => {
          console.error("[EXTRACTOR] Error uploading image:", error);
          return null;
        });
    } else {
      console.log("[EXTRACTOR] Error fetching artwork:", response.status);
      return null;
    }
  } catch (error) {
    console.log("Error:", error);
    return null;
  }
}

module.exports = fetchAndUploadArtwork;
