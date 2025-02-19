import { useState } from "react";
import "./ReviewForm.css";
import FileInput from "./FileInput";
import RatingInput from "./RatingInput";
import useAsync from "./hooks/useAsync";
import useTranslate from "./hooks/useTranslate";

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
  const t = useTranslate();
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
    <form className="review-form">
      <FileInput
        name="imgFile"
        value={values.imgFile}
        initialPreview={initialPreview}
        onChange={handleChange}
      />
      <div className="input-container">
        <div className="input-title">
          <input
            id="title"
            name="title"
            value={values.title}
            placeholder="제목을 입력해주세요."
            onChange={handleInputChange}
          />
          <RatingInput
            name="rating"
            value={values.rating}
            onChange={handleChange}
          />
        </div>

        <textarea
          id="content"
          name="content"
          value={values.content}
          placeholder="리뷰를 입력해주세요."
          onChange={handleInputChange}
        />
        {onCancel && <button onClick={onCancel}>{t("cancel button")}</button>}
        <button
          className="confirm-button"
          type="submit"
          disabled={isSubmitting}
          onClick={handleSubmit}
        >
          {t("confirm button")}
        </button>
        {submittingError?.message && <div>{submittingError.message}</div>}
      </div>
    </form>
  );
}

export default ReviewForm;
