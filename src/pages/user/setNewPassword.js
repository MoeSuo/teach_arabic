import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import bcrypt from "bcryptjs";
import Image from "next/image";
import { HiEye, HiEyeOff } from "react-icons/hi";
export default function SetNewPassword() {
  const [passwordVisible, setPasswordVisible] = useState(false); // State to handle password visibility

  const router = useRouter();

  const { token, email } = router.query;
  const [newPassword, setNewPassword] = useState("");
  const [passwordResetCompleted, setPasswordResetCompleted] = useState(false);
  const [verificationError, setVerificationError] = useState("");
  const [userId, setUserId] = useState("");

  //  token verification
  useEffect(() => {
    const verifyToken = async () => {
      try {
        const response = await fetch("/api/verifyResetToken", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email, token }),
        });

        if (response.ok) {
          const data = await response.json();
          setUserId(data.userId);
          setVerificationError("");
        } else {
          const data = await response.json();
          setVerificationError(data.error);
        }
      } catch (error) {
        console.error("Error verifying reset token:", error);
        setVerificationError(
          "An error occurred while verifying the reset token."
        );
      }
    };

    verifyToken();
  }, [token, email]);

  // on success redirect to /users/login
  useEffect(() => {
    if (passwordResetCompleted) {
      router.push("/user/login");
    }
  }, [passwordResetCompleted]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const hashedPassword = await bcrypt.hash(newPassword, 10);

      const response = await fetch("/api/users", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: userId,
          hashedPassword,
        }),
      });

      if (response.ok) {
        setPasswordResetCompleted(true);
      } else {
        const data = await response.json();
        console.log(data);
      }
    } catch (error) {
      console.error('Error while resetting password:', error);
    res.status(500).json({ error: 'An error occurred while resetting password' });
    }
  };

  if (verificationError) {
    return (
      <div>
        <h1>Error</h1>
        <p>{verificationError}</p>
      </div>
    );
  }

  if (passwordResetCompleted) {
    return (
      <div>
        <h1>Password Reset Successful</h1>
        <p>Your password has been successfully reset.</p>
        {/* You can add a link to redirect users to the login page here */}
      </div>
    );
  }

  return (
    <div>
      <section className="bg-gray-50 dark:bg-gray-900">
        <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
          <a
            href="#"
            className="flex items-center mb-6 text-2xl font-semibold text-gray-900 dark:text-white"
          >
            <Image
              className="w-8 h-8 mr-2"
              src="/images/garden-app-logo-120.png"
              alt="logo"
              width={376}
              height={190}
            />
            Garden App
          </a>
          <div className="   w-full p-6  bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md dark:bg-gray-800 dark:border-gray-700 sm:p-8">
            <h2 className="mb-1 text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
              Reset Your Password
            </h2>
            <form
              onSubmit={handleSubmit}
              className="mt-4 space-y-4 lg:mt-5 md:space-y-5"
              action="#"
            >
              <div>
                <div className="relative flex flex-col ">
                  <label
                    htmlFor="password"
                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                  >
                    New Password
                  </label>
                  <div className="relative   ">
                    <input
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      type={passwordVisible ? "text" : "password"} //  toggle the password visibility
                      name="password"
                      id="password"
                      placeholder="••••••••"
                      className=" bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                      required=""
                    />
                    {passwordVisible ? (
                      <button
                        type="button"
                        onClick={() => setPasswordVisible(!passwordVisible)} 
                        className="absolute right-2 top-1/2 transform -translate-y-1/2"
                      >
                        {passwordVisible ? (
                          <HiEyeOff className="w-6 h-6" /> // React icon for hidden eye
                        ) : (
                          <HiEye className="w-6 h-6" /> // React icon for visible eye
                        )}
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={() => setPasswordVisible(!passwordVisible)} // Toggle password visibility  on button click
                        className="absolute right-2 top-1/2 transform -translate-y-1/2"
                      >
                        {passwordVisible ? (
                          <HiEyeOff className="w-6 h-6" /> //  icon for hidden eye
                        ) : (
                          <HiEye className="w-6 h-6" /> //  icon for visible eye
                        )}
                      </button>
                    )}
                  </div>
                </div>
              </div>

              <button
                className="w-full leading-10 rounded-full bg-blue-500 font-bold text-white"
                type="submit"
              >
                Reset Password
              </button>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
}
