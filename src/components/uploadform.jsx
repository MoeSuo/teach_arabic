import axios from "axios";
import { useState, useEffect } from "react";

function Uploadform() {
  const [image, setImage] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);

  // multiple image input change
  const handleMultipleImage = (event) => {
    const files = [...event.target.files];
    setImage(files);

    const previews = [];
    files.forEach((file) => {
      const reader = new FileReader();
      reader.onload = () => {
        previews.push(reader.result);
        if (previews.length === files.length) {
          setImagePreviews(previews);
        }
      };
      reader.readAsDataURL(file);
    });
  };

  // multile image upload
  const miltipleImageUpload = async (e) => {
    e.preventDefault();

    let formData = new FormData();

    Array.from(image).forEach((item) => {
      formData.append("images", item);
    });

    const url = "http://localhost:3000/api/upload";

    axios
      .post(url, formData)
      .then((result) => {
        console.log("Result", result);
      })
      .catch((err) => {
        console.log("Error: ", err);
      });
  };

  return (
    <>
      <div className="upload">
        <h2>Upload Image</h2>

        <div>
          {imagePreviews?.map((preview, index) => (
            <img
              key={index}
              src={preview}
              alt={`Preview ${index}`}
              style={{ width: "200px", height: "auto" }}
            />
          ))}
        </div>

        <form onSubmit={miltipleImageUpload}>
          <input type="file" multiple onChange={handleMultipleImage} />
          <button className="uploadBtn">Upload</button>
        </form>
      </div>
    </>
  );
}

export default Uploadform;