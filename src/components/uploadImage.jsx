import { useSession, setUser } from "next-auth/react";
import { useRouter } from "next/router";
import { useState } from "react";
import Head from "next/head";
import styles from "../styles/UploadImage.module.scss";

export default function UploadImage(props) {
  const { data: session } = useSession();
  const router = useRouter();
  console.log(session);
  console.log(session?.user.id);
  console.log(session?.user.email);
  console.log(session?.user.name);
  console.log("image is =", session?.user.image);

  const [imageSrc, setImageSrc] = useState();
  const [uploadData, setUploadData] = useState();

  /**
   * handleOnChange
   * @description Triggers when the file input changes (ex: when a file is selected)
   */

  function handleOnChange(changeEvent) {
    const reader = new FileReader();

    reader.onload = function (onLoadEvent) {
      setImageSrc(onLoadEvent.target.result);
      setUploadData(undefined);
    };

    reader.readAsDataURL(changeEvent.target.files[0]);
  }

  /**
   * handleOnSubmit
   * @description Triggers when the main form is submitted
   */
  let user_avata_url = "";

  // send to db
  const uploadToServer = async (user_avata_url) => {
    // Check if an image is selected
    if (user_avata_url) {
      const body = {
       id: session?.user.id, // Include user ID in the request body
      image: user_avata_url, // Send the Cloudinary image URL
        // ... other properties if necessary
      };

      try {
        const response = await fetch("/api/users", {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(body, session),
        });
        // Update the user's session with the new avatar URL
        console.log(session);
        if (session) {
          setUser(session, { ...session, user: { ...session.user, image: user_avata_url } });
        }


      } catch (error) {}
    }
  };

  // send to db

  async function handleOnSubmit(event) {
    event.preventDefault();
    console.log(event.currentTarget);
    const form = event.currentTarget;
    const fileInput = Array.from(form.elements).find(
      ({ name }) => name === "file"
    );
    console.log(fileInput);

    const formData = new FormData();

    for (const file of fileInput.files) {
      formData.append("file", file);
    }

    formData.append("upload_preset", "my-uploads");

    const data = await fetch(
      "https://api.cloudinary.com/v1_1/dmvv06fno/image/upload",
      {
        method: "POST",
        body: formData,
      }
    ).then((r) => r.json());
    setImageSrc(data.secure_url);
    setUploadData(data);
    user_avata_url = data.secure_url;
    console.log(user_avata_url);
    uploadToServer(user_avata_url);
  }

  return (
    <div className={styles.container}>
      <Head>
        <title>Image Uploader</title>
        <meta name="description" content="Upload your image to Cloudinary!" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <h1 className={styles.title}>Image Uploader</h1>

        <p className={styles.description}>Upload your image to Cloudinary!</p>

        <form
          className={styles.form}
          method="post"
          onChange={handleOnChange}
          onSubmit={handleOnSubmit}
        >
          <p>
            <input type="file" name="file" />
          </p>

          <img src={imageSrc} />

          {imageSrc && !uploadData && (
            <p>
              <button>Upload Files</button>
            </p>
          )}

          {uploadData && (
            <code>
              <pre>{JSON.stringify(uploadData, null, 2)}</pre>
            </code>
          )}
        </form>
      </main>

      <footer className={styles.footer}>
        <p>
          Find the tutorial on{" "}
          <a href="https://spacejelly.dev/">spacejelly.dev</a>!
        </p>
      </footer>
    </div>
  );
}
