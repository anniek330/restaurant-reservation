import React from "react";

import { Redirect, Route, Switch } from "react-router-dom";
import Dashboard from "../dashboard/Dashboard";
import NotFound from "./NotFound";
import { today } from "../utils/date-time";
import CreateReservation from "../reservations/CreateReservation";
import useQuery from "../utils/useQuery";
import NewTable from "../tables/NewTable";
import SeatResAtTable from "../seatResAtTable/SeatResAtTable";
import SearchPage from "../search/SearchPage";
import EditReservation from "../reservations/EditReservation";

/**
 * Defines all the routes for the application.
 *
 * You will need to make changes to this file.
 *
 * @returns {JSX.Element}
 */
function Routes() {
  const query = useQuery();
  const date = query.get("date");
  return (
    <Switch>
      <Route exact={true} path="/">
        <Redirect to={"/dashboard"} />
      </Route>

      <Route path="/dashboard">
        <Dashboard date={date ? date : today()} />
      </Route>

      <Route exact={true} path="/reservations">
        <Redirect to={"/dashboard"} />
      </Route>

      <Route exact={true} path="/reservations/new">
        <CreateReservation />
      </Route>
      
      <Route exact path="/reservations/:reservation_id/edit">
        <EditReservation />
      </Route>

      <Route exact path="/reservations/:reservation_id/seat">
        <SeatResAtTable />
      </Route>

      <Route path="/tables/new">
        <NewTable />
      </Route>

      <Route path="/search">
        <SearchPage />
      </Route>

      <Route>
        <NotFound />
      </Route>
    </Switch>
  );
}

export default Routes;
