/**
 * Defines the base URL for the API.
 * The default values is overridden by the `API_BASE_URL` environment variable.
 */
import formatReservationDate from "./format-reservation-date";
import formatReservationTime from "./format-reservation-date";

const API_BASE_URL =
  process.env.REACT_APP_API_BASE_URL || "http://localhost:5001";

  // const API_BASE_URL =
  // process.env.REACT_APP_API_BASE_URL || "https://restaurant-reservation-backend-r7gs.onrender.com";

/**
 * Defines the default headers for these functions to work with `json-server`
 */
const headers = new Headers();
headers.append("Content-Type", "application/json");

/**
 * Fetch `json` from the specified URL and handle error status codes and ignore `AbortError`s
 *
 * This function is NOT exported because it is not needed outside of this file.
 *
 * @param url
 *  the url for the requst.
 * @param options
 *  any options for fetch
 * @param onCancel
 *  value to return if fetch call is aborted. Default value is undefined.
 * @returns {Promise<Error|any>}
 *  a promise that resolves to the `json` data or an error.
 *  If the response is not in the 200 - 399 range the promise is rejected.
 */
async function fetchJson(url, options, onCancel) {
  try {
    const response = await fetch(url, options);

    if (response.status === 204) {
      return null;
    }

    const payload = await response.json();

    if (payload.error) {
      return Promise.reject({ message: payload.error });
    }
    return payload.data;
  } catch (error) {
    if (error.name !== "AbortError") {
      console.error(error.stack);
      throw error;
    }
    return Promise.resolve(onCancel);
  }
}

/**
 * Retrieves all existing reservation.
 * @returns {Promise<[reservation]>}
 *  a promise that resolves to a possibly empty array of reservation saved in the database.
 */

export async function listReservations(params, signal) {
  const url = new URL(`${API_BASE_URL}/reservations`);
  Object.entries(params).forEach(([key, value]) =>
    url.searchParams.append(key, value.toString())
  );
  return await fetchJson(url, { headers, signal }, [])
    .then(formatReservationDate)
    .then(formatReservationTime);
}

//create new reservation
export async function createReservation(reservation, signal) {
  const resWithNum = { ...reservation, people: Number(reservation.people) };
  const url = `${API_BASE_URL}/reservations`;
  const options = {
    method: "POST",
    headers,
    body: JSON.stringify({ data: resWithNum }),
    signal,
  };

  return await fetchJson(url, options);
}

//cancel reservation
export async function cancelReservation(reservation_id, signal) {
  const url = `${API_BASE_URL}/reservations/${reservation_id}/status`;
  const options = {
    method: "PUT",
    headers,
    body: JSON.stringify({ data: { status: "cancelled" } }),
  };
  return await fetchJson(url, options, []);
}


export async function readReservation(reservation_id, signal) {
  const url = `${API_BASE_URL}/reservations/${reservation_id}`;
  return await fetchJson(url, { headers, signal }, [])
    .then(formatReservationDate)
    .then(formatReservationTime);
}

//update a res
export async function updateReservation(updatedReservation, signal) {
  const resWithNum = {
    ...updatedReservation,
    people: Number(updatedReservation.people),
  };
  const url = `${API_BASE_URL}/reservations/${updatedReservation.reservation_id}`;
  const options = {
    method: "PUT",
    headers,
    body: JSON.stringify({ data: resWithNum }),
    signal,
  };
  return await fetchJson(url, options, updatedReservation);
}

//seat a res at a table
export async function seatReservation(reservation_id, table_id, signal) {
  const url = new URL(`${API_BASE_URL}/tables/${table_id}/seat`);
  const options = {
    method: "PUT",
    headers,
    body: JSON.stringify({ data: { reservation_id } }),
    signal,
  };
  return await fetchJson(url, options, []);
}

//creates new table
export async function createTable(table, signal) {
  const tableWithNum = { ...table, capacity: Number(table.capacity) };
  const url = `${API_BASE_URL}/tables`;
  table.capacity = Number(table.capacity);
  const options = {
    method: "POST",
    headers,
    body: JSON.stringify({ data: tableWithNum }),
    signal,
  };
  return await fetchJson(url, options, []);
}

//list tables
export async function listTables(params, signal) {
  const url = new URL(`${API_BASE_URL}/tables`);
  return await fetchJson(url, { headers, signal }, []);
}

//remove res_id from a table "finish the table"
export async function removeReservationFromTable(
  table_id,
  reservation_id,
  signal
) {
  const url = new URL(`${API_BASE_URL}/tables/${table_id}/seat`);
  const options = {
    method: "DELETE",
    headers,
    body: JSON.stringify({ data: { reservation_id } }),
    signal,
  };
  return await fetchJson(url, options, []);
}
