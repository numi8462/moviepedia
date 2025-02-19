import { useState, useEffect, useCallback } from "react";
import "./App.css";
import ReviewList from "./components/ReviewList";
import { createReviews, deleteReview, getReviews, updateReview } from "./api";
import ReviewForm from "./components/ReviewForm";
import useAsync from "./components/hooks/useAsync";
import { LocaleProvider } from "./components/contexts/LocaleContext";
import LocaleSelect from "./components/LocaleSelect";
import logo from "./assets/logo.png";
import preview from "./assets/preview-placeholder.png";
import Button from "./components/Button";
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
      <div className="">
        <div className="header">
          <img src={logo} alt="logo image" />
          <LocaleSelect />
        </div>

        <div className="App-container">
          <ReviewForm
            initialPreview={preview}
            onSubmit={createReviews}
            onSubmitSuccess={handleCreateSuccess}
          />

          <div className="filter">
            <Button
              className={`filter-button ${
                sortOrder === "createdAt" ? "selected" : ""
              }`}
              onClick={() => handleClick("createdAt")}
              name={"latest button"}
            />
            <Button
              className={`filter-button ${
                sortOrder === "rating" ? "selected" : ""
              }`}
              onClick={() => handleClick("rating")}
              name={"rating button"}
            />
          </div>

          <div className="reviews-container">
            <ReviewList
              items={sortedItems}
              onDelete={handleDelete}
              onUpdate={updateReview}
              onUpdateSuccess={handleUpdateSuccess}
            />
            {hasNext && (
              <button
                className="more"
                disabled={isLoading}
                onClick={handleLoadMore}
              >
                더 보기
              </button>
            )}
            {loadingError?.message && <span>{loadingError.message}</span>}
          </div>
        </div>
        <div className="App-footer">
          <div className="text">
            <span>서비스 이용약관 </span>
            <span>|</span>
            <span> 개인정보 처리방침</span>
          </div>
        </div>
      </div>
    </LocaleProvider>
  );
}

export default App;
