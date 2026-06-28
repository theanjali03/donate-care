const getBotResponse = async (message, Campaign) => {
  const msg = message.toLowerCase().trim();

  // 🔹 Greeting
  if (/hi|hello|hey/.test(msg)) {
    return "Hello 👋 How can I assist you today?";
  }

  // 🔹 Help
  if (msg.includes("help")) {
    return `You can ask:
• Show food campaigns
• Show health campaigns
• Show urgent campaigns
• How to donate
• Suggest campaigns`;
  }

  // 🔹 Donation Guide
  if (msg.includes("donate")) {
    return "To donate, open a campaign and click the Donate button 💳";
  }

  // 🔹 Category-based search
  if (msg.includes("food") || msg.includes("meal")) {
    const campaigns = await Campaign.findAll({ where: { category: "food" } });

    return campaigns.length
      ? "🍲 Food Campaigns:\n" + campaigns.map(c => `• ${c.title}`).join("\n")
      : "No food campaigns found.";
  }

  if (msg.includes("health") || msg.includes("medical")) {
    const campaigns = await Campaign.findAll({ where: { category: "health" } });

    return campaigns.length
      ? "🏥 Health Campaigns:\n" + campaigns.map(c => `• ${c.title}`).join("\n")
      : "No health campaigns found.";
  }

  // 🔹 Urgent campaigns (sorted)
  if (msg.includes("urgent") || msg.includes("emergency")) {
    const campaigns = await Campaign.findAll({
      where: { urgent: true },
      limit: 5
    });

    return campaigns.length
      ? "⚠️ Urgent Campaigns:\n" + campaigns.map(c => `• ${c.title}`).join("\n")
      : "No urgent campaigns right now.";
  }

  // 🔹 Smart suggestion (AI-like logic)
  if (msg.includes("suggest") || msg.includes("recommend")) {
    const campaigns = await Campaign.findAll({ limit: 3 });

    return campaigns.length
      ? "✨ Recommended for you:\n" + campaigns.map(c => `• ${c.title}`).join("\n")
      : "No campaigns available.";
  }

  // 🔹 Fallback (important)
  return "🤖 I didn’t understand that. Try asking about food, health, urgent campaigns or donation help.";
};

module.exports = getBotResponse;