import React from "react";
import { Link } from "react-router-dom";


function TableCard({ tables }) {
 

  // reservations.map
  const tableCard = tables.map((table) => (
    <div className="card">
      <div className="card-body">
        <h5 className="card-title">Table: {table.table_name}</h5>
        <p className="card-text">Capacity: {table.capacity}</p>
        <p data-table-id-status={table.table_id}>
          {table.reservation_id ? "Occupied" : "Free"}
        </p>
      </div>
    </div>
  ));
  return <ul className="list-group mt-2 card-list">{tableCard}</ul>;
}

export default TableCard;
