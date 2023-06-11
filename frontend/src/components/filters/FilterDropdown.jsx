import Box from "@mui/material/Box";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";

const FilterDropdown = ({ column }) => {
  const { filterValue, setFilter, options } = column;

  const handleChange = (event) => {
    setFilter(event.target.value);
  };

  return (
    <Box sx={{ minWidth: 200 }}>
      <FormControl fullWidth>
        <Select
          displayEmpty
          value={filterValue === undefined ? "" : filterValue}
          onChange={handleChange}
        >
          {options.map((opt) => {
            return (
              <MenuItem key={opt.value} value={opt.value}>
                {opt.label}
              </MenuItem>
            );
          })}
        </Select>
      </FormControl>
    </Box>
  );
};

export default FilterDropdown;
