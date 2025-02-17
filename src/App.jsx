import { useState, useEffect } from "react";
import "./App.css";
import ReviewList from "./components/ReviewList";
import { getReviews } from "./api";
import ReviewForm from "./components/ReviewForm";
// import mockItems from "./mocks/mock.json";

function App() {
  const [items, setItems] = useState([]);
  const [sortOrder, setSortOrder] = useState("createdAt");
  const [offset, setOffset] = useState(0);
  const [hasNext, setHasNext] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingError, setLoadingError] = useState(null);

  const sortedItems = items.sort((a, b) => b[sortOrder] - a[sortOrder]);

  const handleClick = (order) => {
    setSortOrder(order);
  };

  const handleDelete = (id) => {
    const nextItems = items.filter((item) => item.id !== id);
    setItems(nextItems);
  };

  const handleLoad = async (options) => {
    let result;
    try {
      setIsLoading(true);
      setLoadingError(null);
      result = await getReviews(options);
    } catch (error) {
      setLoadingError(error);
      console.log(error);
      return;
    } finally {
      setIsLoading(false);
    }
    const { reviews, paging } = result;
    if (options.offset === 0) {
      setItems(reviews);
    } else {
      setItems((prevItems) => [...prevItems, ...reviews]);
    }
    setOffset(offset + reviews.length);
    setHasNext(paging.hasNext);
  };

  const handleLoadMore = () => {
    handleLoad({ sortOrder, offset, limit: 6 });
  };

  useEffect(() => {
    handleLoad({ sortOrder, offset: 0, limit: 6 });
  }, [sortOrder]);

  return (
    <>
      <div className="filter">
        <button onClick={() => handleClick("createdAt")}>최신순</button>
        <button onClick={() => handleClick("rating")}>평점순</button>
      </div>
      <ReviewForm />
      <ReviewList items={sortedItems} onDelete={handleDelete} />
      {hasNext && (
        <button disabled={isLoading} onClick={handleLoadMore}>
          더 보기
        </button>
      )}
      {loadingError?.message && <span>{loadingError.message}</span>}
    </>
  );
}

export default App;
