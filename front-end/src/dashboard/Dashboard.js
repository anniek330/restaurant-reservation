import React, { useEffect, useState } from "react";
import { listReservations } from "../utils/api";
import ErrorAlert from "../layout/ErrorAlert";

import { useHistory } from "react-router-dom";
import { previous, next } from "../utils/date-time";
import ReservationCard from "./ReservationList";

/**
 * Defines the dashboard page.
 * @param date
 *  the date for which the user wants to view reservations.
 * @returns {JSX.Element}
 */
function Dashboard({ date }) {
  const [reservations, setReservations] = useState([]);
  const [reservationsError, setReservationsError] = useState(null);
  const history = useHistory();

  useEffect(loadDashboard, [date]);

  //get reservations from database
  function loadDashboard() {
    const abortController = new AbortController();
    setReservationsError(null);
    listReservations({ date }, abortController.signal)
      .then(setReservations)
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
        <h4 className="mb-0">Reservations for {date}</h4>
      </div>
      {JSON.stringify(reservations)}

      <ErrorAlert error={reservationsError} />
      <div>
        <button type="button" onClick={handlePrevButton}>
          Previous
        </button>
        <button type="button" onClick={handleTodayButton}>
          Today
        </button>
        <button type="button" onClick={handleNextButton}>
          Next
        </button>
      </div>
      <ReservationCard reservations={reservations} />
    </main>
  );
}

export default Dashboard;
