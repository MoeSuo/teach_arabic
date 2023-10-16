import { signOut, useSession } from "next-auth/react";
import { useRouter } from "next/router";
import Navbar from "../../components/navbar/navBar";

function Profile() {
  const { data: session } = useSession();
  const router = useRouter();

  function handleSignOut() {
    signOut({ callbackUrl: process.env.NEXT_PUBLIC_NEXTAUTH_URL });
    // signOut({ callbackUrl: "https://main.dps6886imp1cr.amplifyapp.com/" });
  }

  return (
    <>
          <Navbar />

      <div className="flex items-center justify-center h-screen flex-col">
        <h1 className="text-4xl font-bold uppercase">User Profile</h1>
        <div>
          <br /> <br /> <br /> <br />
          <h4 className="text-4xl font-bold uppercase text-center">Welcome:</h4>
          <br />
          <h4 className="text-4xl font-light uppercase justify-center">
            {session?.user.email}
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
    </>
  );
}

export default Profile;
