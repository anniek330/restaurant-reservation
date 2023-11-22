const asyncErrorBoundary = require("../errors/asyncErrorBoundary");
const service = require("./tables.service");
const hasProperties = require("../errors/hasProperties");

//middleware fxns

const VALID_PROPERTIES = ["table_name", "capacity"];

//all properties are filled in
const hasRequiredProperties = hasProperties("table_name", "capacity");

//only has properties from VALID array
function hasOnlyValidProperties(req, res, next) {
  const { data = {} } = req.body;
  const invalidFields = Object.keys(data).filter(
    (field) => !VALID_PROPERTIES.includes(field)
  );
  if (invalidFields.length) {
    return next({
      status: 400,
      message: `Invalid field(s): ${invalidFields.join(", ")}.`,
    });
  }
  next();
}
function validateTableNameField(req, res, next) {
  const { data = {} } = req.body;
  Object.keys(data).filter((field) => {
    if (field === "table_name") {
      if (data[field].length < 2) {
        return next({
          status: 400,
          message: `${"table_name"} is not a valid table_name: must be at least two characters long.`,
        });
      }
    }
  });
  next();
}

function validateCapacityField(req, res, next) {
  const { data = {} } = req.body;
  Object.keys(data).filter((field) => {
    if (field === "capacity") {
      const isNumber = Number.isInteger(data[field]);
      if (!isNumber || Number(data[field]) < 0) {
        return next({
          status: 400,
          message: `${"capacity"} is not a valid number greater than zero.`,
        });
      }
    }
  });
  next();
}

async function tableExists(req, res, next) {
    const { table_id } = req.params;
    const table = await service.read(table_id);
  
    if (table) {
      res.locals.table = table;
      return next();
    }
    next({
      status: 404,
      message: `Table ${table_id} cannot be found.`,
    });
  }

// if the table capacity is less than the number of people in the reservation, return 400 with an error message.
// if the table is occupied, return 400 with an error message.
async function list(req, res) {
  const data = await service.list();
  res.status(200).json({ data });
}
async function create(req, res) {
  const data = await service.create(req.body.data);
  res.status(201).json({ data });
}
function read(req, res) {
    const { table: data } = res.locals;
    res.send({ data });
  }
module.exports = {
  list: asyncErrorBoundary(list),
  create: [
    hasOnlyValidProperties,
    hasRequiredProperties,
    validateTableNameField,
    validateCapacityField,
    asyncErrorBoundary(create),
  ],
  read: [asyncErrorBoundary(tableExists), read],
};
