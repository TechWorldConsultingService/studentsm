import React from 'react'
import { useSelector } from 'react-redux'

const Profile = () => {
    const {username,role} = useSelector(state=>state.user)

  return (
    <div className='flex flex-col items-center justify-center bg-purple-800 p-20 text-white'> 
   <h4>Profile</h4>
<span>Username: {username}</span>
<span>Role:{role}</span>
    </div>
  )
}

export default Profile