const express = require('express');
const router = express.Router();

const { User, Campaign, Donation, HelpRequest } = require('./models');
const { getPasswordHash, verifyPassword, createAccessToken } = require('./auth');
const getBotResponse = require('./chatbot');

function getDistance(lat1, lon1, lat2, lon2) {
  const R = 6371;
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;

  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1 * Math.PI / 180) *
    Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon / 2) ** 2;

  return R * (2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)));
}

// ================= SIGNUP =================
router.post('/signup', async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "Name, email and password are required"
      });
    }

    const existingUser = await User.findOne({ where: { email } });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "User already exists"
      });
    }

    const hashedPassword = await getPasswordHash(password);

    const newUser = await User.create({
      name,
      email,
      password: hashedPassword,
      role: role || "donor"
    });

    const token = createAccessToken({
      id: newUser.id.toString(),
      role: newUser.role
    });

    return res.status(201).json({
      success: true,
      token,
      user: {
        id: newUser.id.toString(),
        name: newUser.name,
        email: newUser.email,
        role: newUser.role
      }
    });

  } catch (error) {
    console.error("Signup error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error"
    });
  }
});


// ================= LOGIN =================
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required"
      });
    }

    const user = await User.findOne({ where: { email } });

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials"
      });
    }

    const isValid = await verifyPassword(password, user.password);

    if (!isValid) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials"
      });
    }

    const token = createAccessToken({
      id: user.id.toString(),
      role: user.role
    });

    return res.json({
      success: true,
      token,
      user: {
        id: user.id.toString(),
        name: user.name,
        email: user.email,
        role: user.role
      }
    });

  } catch (error) {
    console.error("Login error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error"
    });
  }
});


// ================= PROFILE =================
router.get("/profile/:userId", async (req, res) => {
  try {
    const { userId } = req.params;

    const user = await User.findByPk(userId);
    const donations = await Donation.findAll({ where: { userId } });
    const helps = await HelpRequest.findAll({
      where: userId ? { userId } : {}
    });

    res.json({
      user,
      donations,
      helps
    });

  } catch (err) {
    console.log(err);
    res.status(500).json({ msg: "Error fetching profile" });
  }
});

router.get("/nearby-feed", async (req, res) => {
  try {
    // ✅ Convert to number
    const lat = parseFloat(req.query.lat);
    const lng = parseFloat(req.query.lng);

    if (!lat || !lng) {
      return res.status(400).json({ msg: "Location required" });
    }

    const donations = await Donation.findAll();
    const helps = await HelpRequest.findAll();

    const nearbyDonations = donations
      .map(d => ({
        ...d.dataValues,
        distance: d.latitude
          ? getDistance(lat, lng, d.latitude, d.longitude)
          : null
      }))
      .filter(d => d.distance !== null && d.distance <= 100)
      .sort((a, b) => a.distance - b.distance);

    const nearbyHelps = helps
      .map(h => ({
        ...h.dataValues,
        distance: h.latitude
          ? getDistance(lat, lng, h.latitude, h.longitude)
          : null
      }))
      .filter(h => h.distance !== null && h.distance <= 100)
      .sort((a, b) => a.distance - b.distance);

    res.json({
      donations: nearbyDonations,
      helps: nearbyHelps
    });

  } catch (err) {
    console.log(err);
    res.status(500).json({ msg: "Nearby error" });
  }
});

// ================= CHATBOT =================
router.post('/chat', async (req, res) => {
  try {
    const { message } = req.body;

    if (!message) {
      return res.status(400).json({
        success: false,
        message: "Message is required"
      });
    }

    const reply = await getBotResponse(message, Campaign);

    return res.json({
      success: true,
      reply
    });

  } catch (error) {
    console.error("Chatbot error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error"
    });
  }
});


// ================= DONATE =================
router.post('/donate', async (req, res) => {
  try {
    const {
      userId,
      name,
      email,
      type,
      amount,
      message,
      bloodGroup,
      item
    } = req.body;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "User not logged in"
      });
    }

    if (!name || !email || !type) {
      return res.status(400).json({
        success: false,
        message: "Name, email and donation type required"
      });
    }

    let finalAmount = null;
    let finalBloodGroup = null;
    let finalItem = null;

    if (type === "money") {
      if (!amount || amount <= 0) {
        return res.status(400).json({
          success: false,
          message: "Valid amount required"
        });
      }
      finalAmount = amount;
    }

    if (type === "blood") {
      if (!bloodGroup) {
        return res.status(400).json({
          success: false,
          message: "Blood group required"
        });
      }
      finalBloodGroup = bloodGroup;
    }

    if (type === "other") {
      if (!item) {
        return res.status(400).json({
          success: false,
          message: "Item required"
        });
      }
      finalItem = item;
    }

    const donation = await Donation.create({
      userId,
      name,
      email,
      type,
      amount: finalAmount,
      bloodGroup: finalBloodGroup,
      item: finalItem,
      message
    });

    return res.status(201).json({
      success: true,
      donation
    });

  } catch (error) {
    console.error("Donation error:", error);

    return res.status(500).json({
      success: false,
      message: "Donation failed"
    });
  }
});


// ================= GET ALL DONATIONS =================
router.get('/donations', async (req, res) => {
  try {
    const donations = await Donation.findAll({
      order: [['createdAt', 'DESC']]
    });

    res.json({
      success: true,
      donations
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch donations"
    });
  }
});


// ================= GET MY DONATIONS =================
router.get('/my-donations/:userId', async (req, res) => {
  try {
    const donations = await Donation.findAll({
      where: { userId: req.params.userId },
      order: [['createdAt', 'DESC']]
    });

    res.json({
      success: true,
      donations
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching user donations"
    });
  }
});


// ================= BLOOD DONORS =================
router.get('/blood-donors', async (req, res) => {
  try {
    const { group } = req.query;

    let where = { type: "blood" };

    if (group) {
      where.bloodGroup = group;
    }

    const donors = await Donation.findAll({
      where,
      order: [['createdAt', 'DESC']]
    });

    return res.json({
      success: true,
      donors
    });

  } catch (error) {
    console.error("Blood donors error:", error);
    return res.status(500).json({
      success: false,
      message: "Error fetching donors"
    });
  }
});


// ================= HELP REQUEST =================
router.post('/help', async (req, res) => {
  try {
    const { userId, name, email, type, detail, message } = req.body;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "User not logged in"
      });
    }

    if (!name || !email || !type) {
      return res.status(400).json({
        success: false,
        message: "Required fields missing"
      });
    }

    const help = await HelpRequest.create({
      userId, // ⭐ FIXED
      name,
      email,
      type,
      detail,
      message
    });

    return res.status(201).json({
      success: true,
      help
    });

  } catch (error) {
    console.error("Help error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error"
    });
  }
});


module.exports = router;