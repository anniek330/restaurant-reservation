const knex = require("../db/connection");

function list() {
  return knex("reservations")
    .select("*")
    .orderBy("reservations.reservation_date");
}

//"returns only reservations matching date query parameter" sorted by time (earliest time first)"
function listReservationsByDate(reservation_date) {
  return knex("reservations")
    .select("*")
    .where({ reservation_date })
    .orderBy("reservation_time");
}

function create(newReservation) {
  return knex("reservations")
    .insert(newReservation)
    .returning("*")
    .then((createdReservation) => createdReservation[0]);
}
function read(reservation_id) {
  return knex("reservations").select("*").where({ reservation_id }).first();
}
function update(updatedReservation) {
  return knex("reservations")
    .select("*")
    .where({ reservation_id: updatedReservation.reservation_id })
    .update(updatedReservation, "*")
    .then((updatedRecords) => updatedRecords[0]);
}
// //only updates status
// function updateStatus(reservation_id, status) {
//   return knex("reservations")
//     .select("*")
//     .where({ reservation_id })
//     .update({ status })
//     .returning("*")
//     .then((updatedRes) => updatedRes[0]);
// }

// function finish(reservation_id) {
//   return knex("reservations")
//     .select("*")
//     .where({ reservation_id })
//     .update({ status: "finished" });
// }

module.exports = {
  list,
  create,
  read,
  listReservationsByDate,
  update,
};
