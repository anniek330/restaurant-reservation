import React from "react";
import { removeReservationFromTable } from "../utils/api";

function TableCard({ tables, setTablesError, loadDashboard }) {

  function handleFinishClick(table_id, reservation_id) {
    const confirmed = window.confirm(
      "Is this table ready to seat new guests? This cannot be undone."
    );
    if (confirmed) {
      removeReservationFromTable(table_id, reservation_id)
        .then(() => loadDashboard())
        .catch(setTablesError);
    }
  }

  // tables.map
  const tableCard = tables.map((table) => (
    <div key={table.table_id} className="card">
      <div className="card-body">
        <h4 className="card-title">Table: {table.table_name}</h4>

        <div className="card-text">
          <p className="card-text">Capacity: {table.capacity}</p>
          <p className="card-text" data-table-id-status={table.table_id}>
            Status: {table.reservation_id ? "Occupied" : "Free"}
          </p>
        </div>
        <div className="card-button">
          {table.reservation_id && (
            <button
              type="button"
              className="btn btn-danger w-25"
              data-table-id-finish={table.table_id}
              onClick={() => handleFinishClick(table.table_id)}
              style={{ marginLeft: "5px" }}
            >
              Finish
            </button>
          )}
        </div>
      </div>
    </div>
  ));
  return <div className="list-group mt-2 card-list">{tableCard}</div>;
}

export default TableCard;
