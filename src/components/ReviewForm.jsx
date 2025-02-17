import { useState } from "react";
import "./ReviewForm.css";

function ReviewForm() {
  const [values, setValues] = useState({
    title: "",
    rating: 0,
    content: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setValues((prevValues) => ({
      ...prevValues,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(values);
  };

  return (
    <form>
      <label htmlFor="">제목</label>
      <input name="title" value={values.title} onChange={handleChange} />
      <label htmlFor="">평점</label>
      <input
        name="rating"
        type="number"
        value={values.rating}
        onChange={handleChange}
      />
      <label htmlFor="">설명</label>
      <textarea name="content" value={values.content} onChange={handleChange} />
      <button type="submit" onClick={handleSubmit}>
        확인
      </button>
    </form>
  );
}

export default ReviewForm;
