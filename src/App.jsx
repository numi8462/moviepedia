import { useState, useEffect, useCallback } from "react";
import "./App.css";
import ReviewList from "./components/ReviewList";
import { createReviews, deleteReview, getReviews, updateReview } from "./api";
import ReviewForm from "./components/ReviewForm";
import useAsync from "./components/hooks/useAsync";
import { LocaleProvider } from "./contexts/LocaleContext";
import LocaleSelect from "./components/LocaleSelect";
// import mockItems from "./mocks/mock.json";

function App() {
  const [items, setItems] = useState([]);
  const [sortOrder, setSortOrder] = useState("createdAt");
  const [offset, setOffset] = useState(0);
  const [hasNext, setHasNext] = useState(false);
  const [isLoading, loadingError, getReviewsAsync] = useAsync(getReviews);

  const sortedItems = items.sort((a, b) => b[sortOrder] - a[sortOrder]);

  const handleClick = (order) => {
    setSortOrder(order);
  };

  const handleDelete = async (id) => {
    const result = await deleteReview(id);
    if (!result) return;
    setItems((prevItems) => prevItems.filter((item) => item.id !== id));
  };

  const handleLoad = useCallback(
    async (options) => {
      const result = await getReviewsAsync(options);
      if (!result) return;

      const { reviews, paging } = result;
      if (options.offset === 0) {
        setItems(reviews);
      } else {
        setItems((prevItems) => [...prevItems, ...reviews]);
      }
      setOffset(options.offset + reviews.length);
      setHasNext(paging.hasNext);
    },
    [getReviewsAsync]
  );

  const handleLoadMore = () => {
    handleLoad({ sortOrder, offset, limit: 6 });
  };

  const handleCreateSuccess = (review) => {
    setItems((prevItems) => [review, ...prevItems]);
  };

  const handleUpdateSuccess = (review) => {
    setItems((prevItems) => {
      const splitIdx = prevItems.findIndex((item) => item.id === review.id);
      return [
        ...prevItems.slice(0, splitIdx),
        review,
        ...prevItems.slice(splitIdx + 1),
      ];
    });
  };

  useEffect(() => {
    handleLoad({ sortOrder, offset: 0, limit: 6 });
  }, [sortOrder, handleLoad]);

  return (
    <LocaleProvider defaultValue={"ko"}>
      <div>
        <LocaleSelect />

        <div className="filter">
          <button onClick={() => handleClick("createdAt")}>최신순</button>
          <button onClick={() => handleClick("rating")}>평점순</button>
        </div>
        <ReviewForm
          onSubmit={createReviews}
          onSubmitSuccess={handleCreateSuccess}
        />
        <ReviewList
          items={sortedItems}
          onDelete={handleDelete}
          onUpdate={updateReview}
          onUpdateSuccess={handleUpdateSuccess}
        />
        {hasNext && (
          <button disabled={isLoading} onClick={handleLoadMore}>
            더 보기
          </button>
        )}
        {loadingError?.message && <span>{loadingError.message}</span>}
      </div>
    </LocaleProvider>
  );
}

export default App;
