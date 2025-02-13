import { useState } from "react";
import "./App.css";
import ReviewList from "./components/ReviewList";
import items from "./mocks/mock.json";

function App() {
  return (
    <>
      <ReviewList items={items} />
    </>
  );
}

export default App;
