import "./App.css";
import React, { useState, useEffect, useCallback } from "react";
import { data } from "./data";
import Form from "react-bootstrap/Form";
import InputGroup from "react-bootstrap/InputGroup";
import debounce from "./debounce";

export function App() {
  const [counter,setCounter]=useState(0);
  const [search, setSearch] = useState(""); //initially search query is empty.

 

  //Memoizing the debounced function using CallBack

  const debouncedSetSearch = useCallback(
   
    debounce((value) => {
      setSearch(value);//set the search state
      setCounter((prevCounter)=>prevCounter+1);//increment counter based on previous value
    },300),
    []
  );

  //effect to cleanUp debounce function (cancel the timer on unmount)
  useEffect(()=>{
        //cleanup function to handle any ongoing debounce during component unmounting
        return()=>{
              //cancel or clear pending debounce actions if needed
          debouncedSetSearch.cancel();
    }
  },[debouncedSetSearch]);
  useEffect(()=>{
     console.log(`api calls :${counter}`);
  },[counter]);//this effect will run whenever the counter state changes.

  //handle input change
  const handleSearchChange=(e)=>{
    console.log(search);
   
    debouncedSetSearch(e.target.value);
    
  }
  return (
    <div className="App">
      <h1 className="text-xl font-medium text  text-center">Search Filter</h1>
      <Form>
        <InputGroup className="my-3">
          <Form.Control
            onChange={handleSearchChange}
            placeholder="Search Contact"
            className="w-80"
          />
        </InputGroup>
      </Form>
      <table className="border-separate border  border-slate-200 border-spacing-2">
        <thead>
          <tr>
            <th>First Name</th>
            <th>Last Name</th>
            <th>Email</th>
            <th>Mobile Number</th>
          </tr>
        </thead>
        <tbody>
          {data &&
            data
              .filter((item) => {
                return search.toLowerCase() === ""
                  ? item
                  : item.first_name.toLowerCase().includes(search);
              })
              .map((item) => (
                <tr key={item.id}>
                  <td>{item.first_name}</td>
                  <td>{item.last_name}</td>
                  <td>{item.email}</td>
                  <td>{item.phone}</td>
                </tr>
              ))}

          
        </tbody>
      </table>
    </div>
  );
}
