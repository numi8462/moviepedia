import { useState, useEffect } from "react";
import "./App.css";
import ReviewList from "./components/ReviewList";
import { getReviews } from "./api";
// import mockItems from "./mocks/mock.json";

function App() {
  const [items, setItems] = useState([]);
  const [sortOrder, setSortOrder] = useState("createdAt");
  const sortedItems = items.sort((a, b) => b[sortOrder] - a[sortOrder]);

  const handleClick = (order) => {
    setSortOrder(order);
  };

  const handleDelete = (id) => {
    const nextItems = items.filter((item) => item.id !== id);
    setItems(nextItems);
  };

  const handleLoad = async (orderQuery) => {
    const { reviews } = await getReviews(orderQuery);
    console.log(reviews);
    setItems(reviews);
  };

  useEffect(() => {
    handleLoad(sortOrder);
  }, [sortOrder]);

  return (
    <>
      <div className="filter">
        <button onClick={() => handleClick("createdAt")}>최신순</button>
        <button onClick={() => handleClick("rating")}>평점순</button>
      </div>

      <ReviewList items={sortedItems} onDelete={handleDelete} />
    </>
  );
}

export default App;
