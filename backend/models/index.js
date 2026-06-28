const { DataTypes } = require("sequelize");
const { sequelize } = require("../database");

const UserModel = require("./user");
const CampaignModel = require("./campaign");
const DonationModel = require("./donation");

const User = UserModel(sequelize, DataTypes);
const Campaign = CampaignModel(sequelize, DataTypes);
const Donation = DonationModel(sequelize, DataTypes);
const HelpRequest = require('./helpRequest')(sequelize, DataTypes);

module.exports = {
  sequelize,
  User,
  Campaign,
  Donation,
  HelpRequest
};