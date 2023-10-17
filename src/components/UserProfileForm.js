// components/UserProfileForm.js
import React from 'react';
import axios from 'axios';
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useState } from "react";

const UserProfileForm = () => {


      const { data: session } = useSession();
      const router = useRouter();
      console.log(session?.user.id);
      console.log(session?.user.email);
      console.log(session?.user.name);
      console.log(session?.user.image);
    const [user, setUser] = useState(null);

    useEffect(() => {
        if (session?.user?.id) {
          // Make a GET request to fetch user data including the image
          axios.get(`/api/users?id=${session.user.id}`)
            .then(response => {
              setUser(response.data);
            })
            .catch(error => {
              console.error('Error fetching user data:', error);
            });
        }
      }, [session]); // Re-run the effect whenever the session object changes
    
      if (!session) {
        // Handle the case when the session is not yet loaded
        return <div>Loading...</div>;
      }



  return (
    <div className="max-w-md mx-auto mt-8 p-6 bg-white shadow-lg rounded-lg">
      <h2 className="text-2xl font-semibold mb-4">User Profile</h2>
      {user && (
        <div>
          <img src={user.image} alt="Profile" className="mb-4 rounded-full w-32 h-32 object-cover" />          
      <form className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-600">Profile Picture</label>
          <input type="file" className="mt-1 p-2 border rounded-md w-full" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-600">Name</label>
          <input type="text" className="mt-1 p-2 border rounded-md w-full" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-600">Address</label>
          <input type="text" className="mt-1 p-2 border rounded-md w-full" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-600">Bio</label>
          <textarea className="mt-1 p-2 border rounded-md w-full"></textarea>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-600">Email</label>
          <input type="email" className="mt-1 p-2 border rounded-md w-full" readOnly />
        </div>
        <div className="flex justify-between">
          <div>
            <label className="block text-sm font-medium text-gray-600">Change Password</label>
            <a href="/change-password" className="text-blue-500 hover:underline">Change Password</a>
          </div>
          <button type="submit" className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded">
            Save Changes
          </button>
        </div>
      </form>
      </div>
      )}
    </div>
  );
};

export default UserProfileForm;