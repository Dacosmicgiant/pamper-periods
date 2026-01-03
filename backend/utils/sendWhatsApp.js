// utils/sendWhatsApp.js
const axios = require("axios");

async function sendWhatsApp(number, message, instanceId, token) {
  try {
    const url = `https://api.ultramsg.com/${instanceId}/messages/chat`;

    const payload = {
      token,
      to: number, // example: "919876543210"
      body: message,
    };

    const res = await axios.post(url, payload);

    console.log("WhatsApp sent:", res.data);
    return true;
  } catch (err) {
    console.error("WhatsApp Error:", err.response?.data || err.message);
    return false;
  }
}

module.exports = sendWhatsApp;
