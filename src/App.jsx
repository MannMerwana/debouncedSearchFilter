import "./App.css";
import React, { useState, useEffect, useCallback } from "react";
import { data } from "./data";
import Form from "react-bootstrap/Form";
import InputGroup from "react-bootstrap/InputGroup";
import debounce from "./debounce";

export function App() {
  const [counter, setCounter] = useState(0);
  const [search, setSearch] = useState(""); //initially search query is empty.
  const [actualData, setData] = useState(data);
  const [sortField, setsortField] = useState("name");
  const [sortDirection, setSortDirection] = useState('desc');

  //Memoizing the debounced function using CallBack

  const debouncedSetSearch = useCallback(
    debounce((value) => {
      setSearch(value); //set the search state
      setCounter((prevCounter) => prevCounter + 1); //increment counter based on previous value
    }, 300),
    []
  );

  //effect to cleanUp debounce function (cancel the timer on unmount)
  useEffect(() => {
    //cleanup function to handle any ongoing debounce during component unmounting
    return () => {
      //cancel or clear pending debounce actions if needed
      debouncedSetSearch.cancel();
    };
  }, [debouncedSetSearch]);
  useEffect(() => {
    console.log(`api calls :${counter}`);
  }, [counter]); //this effect will run whenever the counter state changes.

  //handle input change
  const handleSearchChange = (e) => {
    

    debouncedSetSearch(e.target.value);
  };

  //sorting function to sort the data  based on selected field and direction
const sortByField = (field) => {
  // Toggle sort direction when the same field is selected
  const newDirection =
    sortField === field && sortDirection === "asc" ? "desc" : "asc";
  setSortDirection(newDirection);
  setsortField(field);

  const sortedData = [...actualData].sort((a, b) => {
   
    if (newDirection === "asc") {
      console.log(`a:${a[field]} and b:${b[field]} `);
      console.log(a[field] > b[field] ? 1 : -1);
      a[field].trim(); //clear empty spaces
      b[field].trim(); //clear empty spaces
      return a[field] > b[field] ? 1 : -1;
    } else {
      console.log(b[field] > a[field] ? 1 : -1);
      return b[field] > a[field] ? 1 : -1;
    }
  });
console.log(sortedData);
  setData(sortedData);
};



// const sortByField = (field) => {
//   const direction = sortField === field && sortDirection === "asc" ? "desc" : "asc";
//   setSortDirection(direction);
//   setsortField(field);

//   const sortedData = actualData
//     .map(item => ({
//       ...item,
//       roleForSorting: item[field]?.toLowerCase() || '' // Add lowercase version of the role for sorting
//     }))
//     .sort((a, b) => 
//       direction === "asc" 
//         ? a.roleForSorting.localeCompare(b.roleForSorting) 
//         : b.roleForSorting.localeCompare(a.roleForSorting) 
//     )
//     .map(({ roleForSorting, ...rest }) => rest); // Remove roleForSorting after sorting

//   setData(sortedData);
// }

  
  return (
    <div className="App bg-black text-white">
      <h1 className="text-xl font-medium text  text-start text-black">
        Search Filter
      </h1>
      <section className=" flex gap-5">
        <label htmlFor="SortBy">SortBy</label>
        <select
          name="SortByField"
          id=""
          className="text-black"
          onChange={(e) => sortByField(e.target.value)}
        >
          <option value="name">Name</option>
          <option value="role">Role</option>
        </select>
      </section>

      <Form>
        <InputGroup className="my-5 text-black">
          <Form.Control
            onChange={handleSearchChange}
            placeholder="Search "
            className="w-80"
          />
        </InputGroup>
      </Form>
      <table className="border-separate border  border-slate-200 border-spacing-5">
        <thead>
          <tr>
            <th> Id</th>
            <th value="name"> Name</th>
            <th value="role">Role</th>
            {/* <th>Email</th>
            <th>Mobile Number</th> */}
          </tr>
        </thead>
        <tbody>
          {actualData &&
            actualData
              .filter((item) => {
                return search.toLowerCase() === ""
                  ? item
                  : item.name.toLowerCase().includes(search);
              })
              .map((item) => (
                <tr key={item.id}>
                  {/* <td>{item.first_name}</td>
                  <td>{item.last_name}</td>
                  <td>{item.email}</td>
                  <td>{item.phone}</td> */}
                  <td>{item.id}</td>
                  <td>{item.name}</td>
                  <td>{item.role}</td>
                </tr>
              ))}
        </tbody>
      </table>
    </div>
  );
}
