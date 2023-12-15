import React, { useEffect, useState } from "react";
import { listReservations, listTables } from "../utils/api";
import ErrorAlert from "../layout/ErrorAlert";

import { useHistory } from "react-router-dom";
import { previous, next } from "../utils/date-time";
import ReservationCard from "./ReservationList";
import TableCard from "./TableCard";

/**
 * Defines the dashboard page.
 * @param date
 *  the date for which the user wants to view reservations.
 * @returns {JSX.Element}
 */
function Dashboard({ date }) {
  const [reservations, setReservations] = useState([]);
  const [reservationsError, setReservationsError] = useState(null);

  const [tables, setTables] = useState([]);
  const [tablesError, setTablesError] = useState(null);

  const history = useHistory();

  useEffect(loadDashboard, [date]);

  //get reservations and tables from database
  function loadDashboard() {
    const abortController = new AbortController();
    setReservationsError(null);

    listReservations({ date }, abortController.signal)
      .then((reservations) => {
        setReservations(reservations);
        return reservations;
      })
      .then(listTables)
      .then(setTables)
      .catch(setReservationsError);
    return () => abortController.abort();
  }

  function handlePrevButton() {
    const prevDate = previous(date);
    history.push(`/dashboard?date=${prevDate}`);
  }
  function handleTodayButton() {
    history.push(`/dashboard`);
  }

  function handleNextButton() {
    const nextDate = next(date);
    history.push(`/dashboard?date=${nextDate}`);
  }
  return (
    <main>
      <h1>Dashboard</h1>
      <div className="d-md-flex mb-3">
        <h3 className="mb-0">Reservations for {date}</h3>
      </div>
      {/* {JSON.stringify(reservations)} */}

      <ErrorAlert error={reservationsError} />
      <div>
        <button
          className="btn btn-secondary"
          type="button"
          onClick={handlePrevButton}
        >
          Previous
        </button>
        <button
          className="btn btn-primary"
          type="button"
          onClick={handleTodayButton}
        >
          Today
        </button>
        <button
          className="btn btn-info"
          type="button"
          onClick={handleNextButton}
        >
          Next
        </button>
      </div>
      <ReservationCard
        reservations={reservations}
        setReservationsError={setReservationsError}
        loadDashboard={loadDashboard}
      />

      <div className="col-md-6 col-sm-12">
        <div className="d-md-flex mb-3">
          <h2>Tables</h2>
        </div>
        <ErrorAlert error={tablesError} />
        <TableCard
          tables={tables}
          setTablesError={setTablesError}
          loadDashboard={loadDashboard}
        />
      </div>
    </main>
  );
}

export default Dashboard;
