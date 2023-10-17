// components/UserProfileForm.js
import React from 'react';

const UserProfileForm = () => {
  return (
    <div className="max-w-md mx-auto mt-8 p-6 bg-white shadow-lg rounded-lg">
      <h2 className="text-2xl font-semibold mb-4">User Profile</h2>
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
  );
};

export default UserProfileForm;
