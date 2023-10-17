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
          className="flex items-center justify-center h-screen flex-col"
        >
          <h1 className="text-4xl font-bold uppercase">User Profile</h1>
          <div>
            <br /> <br /> <br /> <br />
            <h4 className="text-4xl font-bold uppercase text-center">
              Welcome:
            </h4>
            <br />
            <h4 className="text-4xl font-light uppercase justify-center">
              {session.user.email}
            </h4>
            <br /> <br /> <br />{" "}
          </div>
          <button
            onClick={handleSignOut}
            className="bg-blue-500 content-center hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          >
            Sign out
          </button>
        </div>
      ) : (
        // User is not logged in, display the notLoggedIn div
        <div
          id="notLoggedIn"
          className="flex items-center justify-center h-screen flex-col mx-14 text-center"
        >
          <h3 >You need to </h3>{" "}
          <Link href={"/user/login"} className="uppercase font-bold text-[1.7rem] ">log in</Link>{" "}
          <h3>to see your profile page </h3>
          <Link
            href={"/user/login"}
            className="bg-blue-500 content-center my-8 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          >
            Login
          </Link>
        </div>
      )}
    </>
  );
}

export default Profile;
