import UserProfileForm from "@/components/UserProfileForm";
import { signOut, useSession } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/router";

function Profile() {
  const { data: session } = useSession();
  const router = useRouter();

  function handleSignOut() {
    signOut({ callbackUrl: process.env.NEXT_PUBLIC_NEXTAUTH_URL });
  }

  return (
    <>
      {session ? (
        // User is logged in, display the loggedIn div
        <div
          id="loggedIn"
          className="flex items-center justify-center  flex-col"
        >
          {/* <h1 className="text-4xl font-bold uppercase">User Profile</h1> */}
          <div>
            <br /> <br /> <br /> <br />
            <h4 className="text-4xl font-bold uppercase text-center">
              Welcome:
            </h4>
            <br />
            <h4 className="text-center font-light uppercase justify-center">
              {session.user.name}
            </h4>
            <br /> <br /> <br />{" "}
          </div>
          {/* <button
            onClick={handleSignOut}
            className="bg-blue-500 content-center hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          >
            Sign out
          </button> */}
        </div>
      ) : (
        // User is not logged in, display the notLoggedIn div
        <div
          id="notLoggedIn"
          className="flex items-center justify-center  flex-col mx-14 text-center"
        >
          <h3>You need to </h3>{" "}
          <Link
            href={"/user/login"}
            className="uppercase font-bold text-[1.7rem] "
          >
            log in
          </Link>{" "}
          <h3>to see your profile page </h3>
          <Link
            href={"/user/login"}
            className="bg-blue-500 content-center my-8 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          >
            Login
          </Link>
        </div>
      )}

      <div className="flex items-center justify-center  flex-col mx-14 text-center">
        <form className="space-y-4 w-full">
          <div className="w-full bg-gray-50 p-4">
            <label className="block text-sm font-medium text-gray-600 text-left">
              Profile Picture
            </label>
            <input type="file" className="mt-1 p-2 border rounded-md w-full" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600 text-left">
              Name
            </label>
            <input type="text" className="mt-1 p-2 border rounded-md w-full" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600 text-left">
              Address
            </label>
            <input type="text" className="mt-1 p-2 border rounded-md w-full" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600 text-left">
              Bio
            </label>
            <textarea className="mt-1 p-2 border rounded-md w-full"></textarea>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600 text-left">
              Email
            </label>
            <input
              type="email"
              className="mt-1 p-2 border rounded-md w-full"
              readOnly
            />
          </div>
          <div className="flex justify-between">
            <div>
              <label className="block text-sm font-medium text-gray-600">
                Change Password
              </label>
              <a
                href="/change-password"
                className="text-blue-500 hover:underline"
              >
                Change Password
              </a>
            </div>
            <button
              type="submit"
              className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded"
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
      {/* <UserProfileForm /> */}
    </>
  );
}

export default Profile;
