import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useState } from "react";

export default function UploadImage(props) {
  const { data: session } = useSession();
  const router = useRouter();
  console.log(session);
  console.log(session?.user.id);
  console.log(session?.user.email);
  console.log(session?.user.name);
  console.log("image is =", session?.user.image);

  const [image, setImage] = useState(null);
  const [createObjectURL, setCreateObjectURL] = useState(null);

  const uploadToClient = (event) => {
    if (event.target.files && event.target.files[0]) {
      const i = event.target.files[0];
      setImage(i);
      setCreateObjectURL(URL.createObjectURL(i));
    }
  };

  const uploadToServer = async (event) => {
    // Check if an image is selected
    if (image) {
      const reader = new FileReader();
      reader.onloadend = async () => {
        const base64Image = reader.result.split(',')[1]; // Extract Base64 data
        const userId = session?.user.id; // Get user ID from the session
  
        const body = {
          id: userId, // Include user ID in the request body
          image: base64Image, // Send the Base64 image data
          // ... other properties if necessary
        };
  console.log(image);
        try {
          const response = await fetch("/api/users", {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(body),
          });
  
          if (response.ok) {
            console.log("Image uploaded successfully!");
          } else {
            console.error("Failed to upload image");
          }
        } catch (error) {
          console.error("Error occurred while uploading image:", error);
        }
      };
      reader.readAsDataURL(image); // Read image as Data URL
    } else {
      console.error("No image selected.");
    }
  };
  
  

  return (
    <div>
      <div>
        <img src={createObjectURL} alt="Preview" />
        <h4>Select Image</h4>
        <input type="file" name="myImage" onChange={uploadToClient} />
        <button className="btn btn-primary" type="submit" onClick={uploadToServer}>
          Send to server
        </button>
      </div>
    </div>
  );
}