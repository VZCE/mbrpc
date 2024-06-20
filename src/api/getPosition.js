const axios = require("axios");

const apiUrl = process.env.API_URL;

async function getPosition() {
  if (!apiUrl) {
    console.error("Missing API_URL in .env file");
    return null;
  }
  try {
    const response = await axios.post(apiUrl + "/Player_GetPosition", {});
    if (response.status === 200) {
      console.log("Position retrieved:", response.data);
    } else {
      console.log("Error fetching position:", response.status);
    }
  } catch (error) {
    console.error("Error fetching position:", error);
    return null;
  }
}

module.exports = getPosition;
