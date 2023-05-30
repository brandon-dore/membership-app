import { useState, useEffect, useMemo } from "react";
import { useTable, useFilters } from "react-table";
import FilterForm from "./FilterForm";
import "./SearchMembers.css";

const COLUMNS = [
  {
    Header: "ID",
    accessor: "membership_id",
    Filter: FilterForm,
  },
  {
    Header: "First Name",
    accessor: "first_name",
    Filter: FilterForm,
  },
  {
    Header: "Last Name",
    accessor: "last_name",
    Filter: FilterForm,
  },
  {
    Header: "Expiry Date",
    accessor: "expiry_date",
    Filter: FilterForm,
  },
  {
    Header: "Date of Birth",
    accessor: "dob",
    Filter: FilterForm,
  },
];

const SearchMembers = () => {
  const [data, setData] = useState([]);
  // useeffect ...

  useEffect(() => {
    const fetchData = async () => {
      await fetch("http://localhost:3000/users")
        .then((response) => {
          return response.text();
        })
        .then((data) => {
          setData(JSON.parse(data));
        })
        .catch((e) => {
          console.log(e);
        });
    };

    fetchData();
  }, []);

  const columns = useMemo(() => COLUMNS, []);

  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } =
    useTable({ columns, data }, useFilters);

  return (
    <div>
      <table {...getTableProps()}>
        <thead>
          {headerGroups.map((headerGroup) => (
            <tr {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers.map((column) => (
                <th {...column.getHeaderProps()}>
                  {column.render("Header")}
                  <div>{column.canFilter ? column.render("Filter") : null}</div>
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody {...getTableBodyProps()}>
          {rows.map((row) => {
            prepareRow(row);
            return (
              <tr {...row.getRowProps()}>
                {row.cells.map((cell) => {
                  return (
                    <td {...cell.getCellProps()}>{cell.render("Cell")}</td>
                  );
                })}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default SearchMembers;
