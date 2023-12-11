const knex = require("../db/connection");

function list() {
  return knex("tables").select("*").orderBy("tables.table_name");
}

function create(table) {
  return knex("tables")
    .insert(table)
    .returning("*")
    .then((createdTable) => createdTable[0]);
}
function read(table_id) {
  return knex("tables").select("*").where({ table_id }).first();
}



async function update(updatedTable, updatedReservation) {
  const trx = await knex.transaction();
  return trx("tables")
    .where({ table_id: updatedTable.table_id })
    .update(updatedTable, "*")
    .returning("*")
    .then((updatedTables) => updatedTables[0])
    .then(() => {
      return trx("reservations")
        .where({ reservation_id: updatedReservation.reservation_id })
        .update(updatedReservation, "*")
        .then((updatedRes) => updatedRes[0]);
    })
    .then(trx.commit)
    .catch(trx.rollback);
}

module.exports = {
  list,
  create,
  read,
  update,
};
