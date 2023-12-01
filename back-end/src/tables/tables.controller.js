const asyncErrorBoundary = require("../errors/asyncErrorBoundary");
const service = require("./tables.service");
const hasProperties = require("../errors/hasProperties");
const reservationService = require("../reservations/reservations.service");

//middleware fxns

const VALID_PROPERTIES = ["table_name", "capacity", "reservation_id"];

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
          message: `${data[field]} is not a valid table_name: must be at least two characters long.`,
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
          //capacity can't be capitalized bc of test
          message: `capacity: ${data[field]} is not a valid number greater than zero.`,
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

//tables/table_id/seat

async function reservationExists(req, res, next) {
  const { reservation_id } = req.body.data;
  const reservation = await reservationService.read(reservation_id);
  if (reservation) {
    res.locals.reservation = reservation;
    return next();
  }
  next({
    status: 404,
    message: `Reservation ${reservation_id} cannot be found.`,
  });
}

function tableIsOccupied(req, res, next) {
  const table = res.locals.table;
  if (table.reservation_id) {
    next({
      status: 400,
      message: "Table is currently occupied.",
    });
  }
  return next();
}
function tableIsNotOccupied(req, res, next) {
  const table = res.locals.table;
  if (!table.reservation_id) {
    next({
      status: 400,
      message: "Table is not occupied.",
    });
  }
  return next();
}
function enoughCapacityForRes(req, res, next) {
  const table = res.locals.table;
  const reservation = res.locals.reservation;

  if (reservation.people <= table.capacity) {
    table.reservation_id = res.locals.reservation_id;
    return next();
  }
  next({
    status: 400,
    message: "Number of people in reservation exceeds this table's capacity.",
  });
}
function reservationIsAlreadySeated(req, res, next) {
  const reservation = res.locals.reservation;
  if (reservation.status && reservation.status === "seated") {
    return next({
      status: 400,
      message: "Reservation is already seated at a table.",
    });
  }
  next();
}
async function seatReservation(req, res) {
  const updatedTable = {
    ...req.body.data,
    table_id: res.locals.table.table_id,
  };
  const updatedReservation = {
    ...res.locals.reservation,
    status: "seated",
  };
  const data = await service.update(updatedTable, updatedReservation);
  res.json({ data });
}

//get res_id
async function getReservation(req, res, next) {
  const reservation_id = res.locals.table.reservation_id;
  const reservation = await reservationService.read(reservation_id);
  if (reservation) {
    res.locals.reservation = reservation;
    return next();
  }
  next({
    status: 404,
    message: `Reservation ${reservation_id} cannot be found.`,
  });
}

async function removeReservation(req, res) {
  const updatedTable = {
    ...res.locals.table,
    reservation_id: null,
  };
  const updatedReservation = {
    ...res.locals.reservation,
    reservation_id: res.locals.reservation.reservation_id,
    status: "finished",
  };
  const data = await service.update(updatedTable, updatedReservation);
  res.json({ data });
}

module.exports = {
  list: asyncErrorBoundary(list),
  create: [
    hasProperties("table_name", "capacity"),
    hasOnlyValidProperties,
    validateTableNameField,
    validateCapacityField,
    asyncErrorBoundary(create),
  ],
  read: [asyncErrorBoundary(tableExists), read],
  seatReservationAtTable: [
    asyncErrorBoundary(tableExists),
    hasProperties("reservation_id"),
    asyncErrorBoundary(reservationExists),
    reservationIsAlreadySeated,
    tableIsOccupied,
    enoughCapacityForRes,
    asyncErrorBoundary(seatReservation),
  ],
  removeReservationFromTable: [
    asyncErrorBoundary(tableExists),
    tableIsNotOccupied,
    asyncErrorBoundary(getReservation),
    asyncErrorBoundary(removeReservation),
  ],
};
