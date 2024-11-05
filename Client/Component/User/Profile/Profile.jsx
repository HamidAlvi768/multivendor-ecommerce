import React, { useState, useEffect } from 'react'
import Server from '../../Config/Server'

const Profile = () => {
    const [userData, setUserData] = useState(null)

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const response = await Server.get('/users/profile')
                console.log('User Profile Data:', response.data)
                setUserData(response.data)
            } catch (error) {
                console.error('Profile Error:', error.response?.data || error.message)
            }
        }
        fetchUserData()
    }, [])

    return (
        <div>
            {/* Render your profile components here */}
        </div>
    )
}

export default Profile 