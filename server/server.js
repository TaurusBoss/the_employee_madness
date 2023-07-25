require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const EquipmentModel = require("./db/equipment.model");
const EmployeeModel = require("./db/employee.model");
const MissingEmployeeModel = require("./db/missingemployee.model");
const missingemployeeModel = require("./db/missingemployee.model");

const { MONGO_URL, PORT = 8080 } = process.env;
console.log(MONGO_URL)
if (!MONGO_URL) {
  console.error("Missing MONGO_URL environment variable");
  process.exit(1);
}

const app = express();

app.use(express.json());

app.use("/api/employees/:id", async (req, res, next) => {
  let employee = null;

  try {
    employee = await EmployeeModel.findById(req.params.id);
  } catch (err) {
    return next(err);
  }

  if (!employee) {
    return res.status(404).end("Employee not found");
  }

  req.employee = employee;
  next();
});

app.get("/api/employees", async (req, res) => {
  if (req.query.filterby) {
    const filterBy = req.query.filterby.split("_")
    return res.json(await filterEmployees(filterBy[0], filterBy[1]));
  }
  else if (req.query.sortby) {
    return res.json( await sortEmployees(req.query.sortby, req.query.order));
  }
  else {
    const employees = await EmployeeModel.find().sort({ created: "desc" });
    return res.json(employees);
  }
  
});


app.get("/api/employees/:id", (req, res) => {
  return res.json(req.employee);
});

app.post("/api/employees/", async (req, res, next) => {
  const employee = req.body;

  try {
    const saved = await EmployeeModel.create(employee);
    return res.json(saved);
  } catch (err) {
    return next(err);
  }
});

app.patch("/api/employees/:id", async (req, res, next) => {
  const employee = req.body;

  try {
    const updated = await req.employee.set(employee).save();
    return res.json(updated);
  } catch (err) {
    return next(err);
  }
});

app.delete("/api/employees/:id", async (req, res, next) => {
  try {
    const deleted = await req.employee.delete();
    return res.json(deleted);
  } catch (err) {
    return next(err);
  }
});

app.get("/robert", async (req, res) =>{
  const roberts = await EmployeeModel.find({name: /^.*Robert.*$/gm})
    return res.json(roberts)
})

app.get("/api/equipments", async (req, res) => {
  const equipments = await EquipmentModel.find().sort({ created: "desc" });
  return res.json(equipments);

});

app.use("/api/equipments/:id", async (req, res, next) => {
  let equipment = null;

  try {
    equipment = await EquipmentModel.findById(req.params.id);
  } catch (err) {
    return next(err);
  }

  if (!equipment) {
    return res.status(404).end("Equipment not found");
  }

  req.equipment = equipment;
  next();
});

app.get("/api/equipments/:id", (req, res) => {
  return res.json(req.equipment);
});

app.post("/api/equipments/", async (req, res, next) => {
  const equipment = req.body;

  try {
    const saved = await EquipmentModel.create(equipment);
    return res.json(saved);
  } catch (err) {
    return next(err);
  }
});

app.patch("/api/equipments/:id", async (req, res, next) => {
  const equipment = req.body;

  try {
    const updated = await req.equipment.set(equipment).save();
    return res.json(updated);
  } catch (err) {
    return next(err);
  }
});

app.delete("/api/equipments/:id", async (req, res, next) => {
  try {
    const deleted = await req.equipment.delete();
    return res.json(deleted);
  } catch (err) {
    return next(err);
  }
});

const main = async () => {
  await mongoose.connect(MONGO_URL);

  app.listen(PORT, () => {
    console.log("App is listening on 8080");
    console.log("Try /api/employees route right now");
  });
};

app.patch("/api/missingemployees/", async (req, res) => {
  const missing = req.body.missing
  await EmployeeModel.updateMany({missing: false})
  for(let employee of missing) {
    await EmployeeModel.findOneAndUpdate({name: employee.name}, {missing: true})
  }
  await MissingEmployeeModel.deleteMany({})
  await MissingEmployeeModel.insertMany(missing)
  await missingemployeeModel.updateMany({missing: true})
  res.status(200)
  res.send("DONE")
});

app.get("/api/missingemployees/", async (req, res) => {
  const data = await MissingEmployeeModel.find()
  res.status(200)
  res.send(data)
});

main().catch((err) => {
  console.error(err);
  process.exit(1);
});

async function sortEmployees(sortby, order) {
  switch (sortby) {
    case "fname":
      return await EmployeeModel.find().sort({ fname: `${order}`});

    case "lname":
      return await EmployeeModel.find().sort({ lname: `${order}`});

    case "midname":
      return await EmployeeModel.find().sort({ midname: `${order}`});

    case "pos":
      return await EmployeeModel.find().sort({ position: `${order}`});

    case "lvl":
      return await EmployeeModel.find().sort({ level: `${order}`});
  }
}

async function filterEmployees(filterBy, param) {
  param = param[0].toUpperCase() + param.substring(1, param.length)
  switch (filterBy) {
    case "pos":
      return await EmployeeModel.find({ position: `${param}`})

    case "lvl":
      return await EmployeeModel.find({ level: `${param}`})
  }
}