import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import { useState } from "react";

const FilterDates = ({ column }) => {
  const [date, setDate] = useState(null);

  const { _, setFilter } = column;

  return (
    <span>
      <LocalizationProvider dateAdapter={AdapterMoment}>
        <DatePicker
          clearable
          value={date || null}
          onChange={(e) => {
            if (e === null) {
              setFilter(undefined);
            } else {
              setFilter(e.format("DD/MM/yyyy"));
            }
            setDate(e);
          }}
          slotProps={{
            actionBar: {
              actions: ["clear"],
            },
          }}
        />
      </LocalizationProvider>
    </span>
  );
};

export default FilterDates;
