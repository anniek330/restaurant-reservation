import React, { useState, useEffect } from "react";
import { useHistory, useParams } from "react-router-dom";
import ErrorAlert from "../layout/ErrorAlert";
import { seatReservation, listTables } from "../utils/api";

function SeatResAtTable() {
  const history = useHistory();
  const { reservation_id } = useParams();

  const [tables, setTables] = useState([]);
  const [tableToBeSelected, setTableToBeSelected] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    setError(null);
    const abortController = new AbortController();
    listTables(abortController.signal).then(setTables).catch(setError);
    return () => abortController.abort();
  }, []);


  //get tables from database
  // useEffect(() => {
  //   listTables().then((data) => setTables(data));
  // }, []);

  function handleCancelClick() {
    history.goBack(); // cancel button redirects to previous page
  }

  const handleSelectChange = (event) => {
    setTableToBeSelected(event.target.value);
  };

  //"tableToBeSelected" is the table_id
  const handleSubmit = (event) => {
    event.preventDefault();
    seatReservation(reservation_id, tableToBeSelected)
      .then(() => history.push("/dashboard"))
      .catch((error) => setError(error));
  };

  return (
    <>
      <h1>Seat Reservation</h1>
      <div>
        <ErrorAlert error={error} />
        <form onSubmit={handleSubmit} className="seat-res-form">
          <fieldset>
            <div className="form-group">
              {/* table_number label */}
              <label htmlFor="table_id" className="form-label">
                Table Number:
              </label>

              <select
                id="table_id"
                name="table_id"
                //value={tableToBeSelected}
                onChange={handleSelectChange}
              >
                <option value="">Select a table</option>
                {tables.map((table) => (
                  <option key={table.table_id} value={table.table_id}>
                    {table.table_name} - {table.capacity}
                  </option>
                ))}
              </select>
            </div>
          </fieldset>

          <div>
              <button className= "btn btn-primary" type="submit" onClick={handleSubmit}>
              Submit
            </button>
            
            <button className= "btn btn-danger" type="button" onClick={handleCancelClick}>
              Cancel
            </button>
          </div>

        </form>
      </div>
    </>
  );
}

export default SeatResAtTable;
