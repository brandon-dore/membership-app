import { TextField } from "@mui/material";
import React from "react";

const FilterForm = ({ column }) => {
  const { filterValue, setFilter } = column;
  return (
    <span>
      <TextField
        id="outlined-basic"
        variant="outlined"
        value={filterValue || ""}
        onChange={(e) => setFilter(e.target.value)}
      />
    </span>
  );
};

export default FilterForm;
