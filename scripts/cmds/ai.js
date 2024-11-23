const axios = require('axios');
const { GoatWrapper } = require('fca-liane-utils');

module.exports = {
  config: {
    name: 'ai',
    version: '1.0.0',
    role: 0,
    hasPrefix: false,
    aliases: ['ming'],
    description: "Gpt architecture",
    usage: "ai [prompt]",
    credits: 'KA Tian JHYY',
    cooldown: 3,
  },

  async onStart({ api, event, args }) {
    const { messageID, messageReply, threadID, senderID } = event;
    let userInput = args.join(" ").trim();

    if (messageReply) {
      const repliedMessage = messageReply.body;
      userInput = `${repliedMessage} ${userInput}`;
    }

    if (!userInput) {
      return api.sendMessage('Usage: ai [your question]', threadID, messageID);
    }

    // Construct the API URL
    const apiUrl = `https://joshweb.click/ai/starling-lm-7b?q=${encodeURIComponent(userInput)}&uid=100`;

    try {
      const response = await axios.get(apiUrl);

      if (response.data && response.data.result) {
        const generatedText = response.data.result;

        api.getUserInfo(senderID, (err, ret) => {
          if (err) {
            console.error('❌ Error fetching user info:', err);
            api.sendMessage('Error fetching user info.', threadID, messageID);
            return;
          }

          const userName = ret[senderID].name;
          const formattedResponse = `━━━━━━━━━━━━━━━━━━\n${generatedText}\n━━━━━━━━━━━━━━━━━━\n🗣𝗔𝘀𝗸𝗲𝗱 𝗕𝘆: ${userName}\n━━━━━━━━━━━━━━━━━━`;

          api.sendMessage(formattedResponse, threadID, messageID);
        });
      } else {
        console.error('API response did not contain expected data:', response.data);
        api.sendMessage('❌ An error occurred while generating the text response. Please try again later.', threadID, messageID);
      }
    } catch (error) {
      console.error('Error:', error);
      api.sendMessage(`❌ An error occurred while generating the text response. Please try again later. Error details: ${error.message}`, threadID, messageID);
    }
  }
};

// welcome to dark system !!
const wrapper = new GoatWrapper(module.exports);
wrapper.applyNoPrefix({ allowPrefix: true });
