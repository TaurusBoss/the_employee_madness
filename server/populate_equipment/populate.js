/*
Loading the .env file and creates environment variables from it
*/
require("dotenv").config();
const mongoose = require("mongoose");
const names = require("./names.json");
const types = require("./types.json");
const EquipmentModel = require("../db/equipment.model");

const mongoUrl = process.env.MONGO_URL;

if (!mongoUrl) {
  console.error("Missing MONGO_URL environment variable");
  process.exit(1); // exit the current program
}

const pick = (from) => from[Math.floor(Math.random() * (from.length - 0))];

const populateEquipments = async () => {
  await EquipmentModel.deleteMany({});
  const equipments = names.map((name) => ({
    name,
    type: pick(types),
    quantity: Math.floor(Math.random() * 100)
  }));

  await EquipmentModel.create(...equipments);
  console.log("Equipments created");
};

const main = async () => {
  await mongoose.connect(mongoUrl);

  await populateEquipments();

  await mongoose.disconnect();
};

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
