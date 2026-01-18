import React, { useContext, useState } from 'react'
import { AuthContext } from '../../context/AuthContext'

const ProfileMenu = () => {
    const { user, logout} = useContext(AuthContext);
    const [open, setOpen] = useState(false);
  return (
    <>
        <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="w-9 h-9 rounded-full bg-gray-200 flex items-center justify-center font-semibold"
      >
        {user.name.charAt(0).toUpperCase()}
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-44 bg-white border rounded-lg shadow-md">
          <div className="px-4 py-2 text-sm text-gray-700 border-b">
            {user.name}
          </div>

          <button
            onClick={logout}
            className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50"
          >
            Logout
          </button>
        </div>
      )}
    </div>
    </>
  )
}

export default ProfileMenu
