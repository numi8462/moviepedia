import { useState } from "react";
import "./ReviewForm.css";
import FileInput from "./FileInput";
import RatingInput from "./RatingInput";
import useAsync from "./hooks/useAsync";

const INITIAL_VALUES = {
  title: "",
  rating: 0,
  content: "",
  imgFile: null,
};

function ReviewForm({
  initialValues = INITIAL_VALUES,
  initialPreview,
  onSubmitSuccess,
  onCancel,
  onSubmit,
}) {
  const [isSubmitting, submittingError, onSubmitAsync] = useAsync(onSubmit);
  const [values, setValues] = useState(initialValues);

  const handleChange = (name, value) => {
    setValues((prevValues) => ({
      ...prevValues,
      [name]: value,
    }));
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    handleChange(name, value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("title", values.title);
    formData.append("rating", values.rating);
    formData.append("content", values.content);
    formData.append("imgFile", values.imgFile);
    console.log(values);

    const result = await onSubmitAsync(formData);
    if (!result) return;
    // console.log(result);
    const { review } = result;
    onSubmitSuccess(review);
    setValues(INITIAL_VALUES);
  };

  return (
    <form>
      <FileInput
        name="imgFile"
        value={values.imgFile}
        initialPreview={initialPreview}
        onChange={handleChange}
      />

      <label htmlFor="title">제목</label>
      <input name="title" value={values.title} onChange={handleInputChange} />
      <label htmlFor="rating">평점</label>
      <RatingInput
        name="rating"
        value={values.rating}
        onChange={handleChange}
      />
      <label htmlFor="content">설명</label>
      <textarea
        name="content"
        value={values.content}
        onChange={handleInputChange}
      />
      <button type="submit" disabled={isSubmitting} onClick={handleSubmit}>
        확인
      </button>
      {onCancel && <button onClick={onCancel}>취소</button>}
      {submittingError?.message && <div>{submittingError.message}</div>}
    </form>
  );
}

export default ReviewForm;
