import "./ReviewList.css";

function formatDate(value) {
  const date = new Date(value);
  return `${date.getFullYear()}. ${date.getMonth() + 1}. ${date.getDate()}`;
}

function ReviewListItem({ item }) {
  return (
    <div className="ReviewListItem">
      <img className="ReviewListItem-img" src={item.imgUrl} alt={item.title} />
      <div>
        <h1>{item.title}</h1>
        <p>평점: {item.rating}/5</p>
        <p>개봉일: {formatDate(item.createdAt)}</p>
        <p>{item.content}</p>
      </div>
    </div>
  );
}

function ReviewList({ items }) {
  console.log(items);
  return (
    <ul>
      {items.map((item, i) => (
        <li key={i}>
          <ReviewListItem item={item} />
        </li>
      ))}
    </ul>
  );
}

export default ReviewList;
