import { useEffect, useRef, useState } from "react";
import useTranslate from "./hooks/useTranslate";
import "./FileInput.css";

function FileInput({ name, value, initialPreview, onChange }) {
  const [preview, setPreview] = useState(initialPreview);
  const [selectedFile, setSelectedFile] = useState(null);
  const inputRef = useRef();
  const t = useTranslate();

  const handleChange = (e) => {
    const nextValue = e.target.files[0];
    onChange(name, nextValue);
    setSelectedFile(nextValue);
    // console.log(nextValue);
  };

  const handleButtonClick = () => {
    inputRef.current.click();
  };

  const handleClearClick = () => {
    const inputNode = inputRef.current;
    if (!inputNode) {
      return;
    }

    inputNode.value = "";
    onChange(name, null);
    setSelectedFile(null);
  };

  useEffect(() => {
    if (!value) return;
    const nextPreview = URL.createObjectURL(value);
    setPreview(nextPreview);

    return () => {
      console.log("removed!");
      setPreview(initialPreview);
      URL.revokeObjectURL(nextPreview);
    };
  }, [value, initialPreview]);

  return (
    <div className="file-container">
      <div className="preview-container">
        <img
          className="preview-image"
          src={preview}
          alt="preview image"
          width={200}
          height={289}
          onClick={handleButtonClick}
        />
        {/* {selectedFile && <p>{selectedFile.name}</p>} */}
        {value && (
          <button className="remove-button" onClick={handleClearClick}>
            X
          </button>
        )}
      </div>

      <input
        type="file"
        accept="image/png, image/jpeg"
        onChange={handleChange}
        style={{ display: "none" }}
        ref={inputRef}
      />
    </div>
  );
}

export default FileInput;
