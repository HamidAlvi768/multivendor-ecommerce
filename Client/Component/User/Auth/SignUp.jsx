import Server from '@/Config/Server'

const handleSubmit = async (e) => {
    try {
        const response = await Server.post('/users/sentOtpSignUp', {
            email: email
        })
        console.log('OTP Response:', response.data)
        // rest of your code
    } catch (error) {
        console.error('OTP Error:', error.response?.data || error.message)
    }
}