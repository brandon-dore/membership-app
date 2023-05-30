import { TextField } from "@mui/material";

const FilterFormText = ({ column }) => {
  const { filterValue, setFilter } = column;
  return (
    <span>
      <TextField
        id="outlined-basic"
        variant="outlined"
        type="text"
        value={filterValue || ""}
        onChange={(e) => setFilter(e.target.value)}
      />
    </span>
  );
};

export default FilterFormText;
