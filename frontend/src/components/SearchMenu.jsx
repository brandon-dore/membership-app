import { Tab, Tabs, Typography } from "@mui/material";
import { useState } from "react";
import SearchCustomers from "./SearchCustomers";
import QuickSearch from "./QuickSearch";

const SearchMenu = () => {
  const [tab, setTab] = useState(0);
  const handleChangeTab = (_, newValue) => {
    setTab(newValue);
  };

  return (
    <>
      <Typography variant="h1">Customers</Typography>
      <Tabs variant="fullWidth" value={tab} onChange={handleChangeTab}>
        <Tab label="Quick Search" />
        <Tab label="Search All Customers" />
      </Tabs>
      <br />
      {tab === 0 && (
        <>
          <QuickSearch />
        </>
      )}
      {tab === 1 && (
        <>
          <SearchCustomers />
        </>
      )}
    </>
  );
};

export default SearchMenu;
