import { useState, useEffect, useMemo } from "react";
import { useTable, useFilters } from "react-table";
import FilterText from "./FilterText";
import FilterDates from "./FiterDates";
import "./SearchMembers.css";

const COLUMNS = [
  {
    Header: "Member ID",
    accessor: "membership_id",
    Filter: FilterText,
  },
  {
    Header: "First Name",
    accessor: "first_name",
    Filter: FilterText,
  },
  {
    Header: "Last Name",
    accessor: "last_name",
    Filter: FilterText,
  },
  {
    Header: "Expiry Date",
    accessor: "expiry_date",
    Filter: FilterDates,
  },
  {
    Header: "Date of Birth",
    accessor: "dob",
    Filter: FilterDates,
  },
];

const toBase64 = (arr) => {
  if (arr !== null) {
    const photo = atob(
      arr.reduce((data, byte) => data + String.fromCharCode(byte), "")
    );
    return photo;
  }
};

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
      {data.map((member) => {
        try {
          return (
            <img
              key={member.membership_id}
              src={`data:image/jpeg;base64,${toBase64(member.photo.data)}`}
              alt="photo"
            />
          );
        } catch (e) {
          return <p>No Img</p>;
        }
      })}
    </div>
  );
};

export default SearchMembers;
