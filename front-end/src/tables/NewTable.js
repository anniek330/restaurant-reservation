import React from "react";
import { useHistory } from "react-router-dom";
import TableForm from "./TableForm";

function NewTable() {
  const initialFormData = {
    table_name: "",
    capacity: 1,
  };

  const history = useHistory();

  function handleCancelClick() {
    history.goBack(); // cancel button redirects to previous page
  }

  //what the user sees on the page
  return (
    <>
      <div>
        <h1>Add a Table</h1>
        {/* adds form to page (text boxes) */}
        <TableForm
          onCancel={handleCancelClick}
          initialFormData={initialFormData}
        />
      </div>
    </>
  );
}

export default NewTable;
