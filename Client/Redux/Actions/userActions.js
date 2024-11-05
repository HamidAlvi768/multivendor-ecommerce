import Server from '../Config/Server'

export const fetchUserData = () => async (dispatch) => {
    try {
        const response = await Server.get('/users/data')
        console.log('Redux User Data:', response.data)
        dispatch({
            type: 'SET_USER_DATA',
            payload: response.data
        })
    } catch (error) {
        console.error('Redux Error:', error.response?.data || error.message)
    }
} 