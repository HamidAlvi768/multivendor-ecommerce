import axios from 'axios'

const baseURL = process.env.ServerUrl || 'http://localhost:5000/api'

const Server = axios.create({
    baseURL: baseURL,
    withCredentials: true
})

// Add response interceptor
Server.interceptors.response.use(
    (response) => {
        if (!response.data) {
            console.warn('Empty response data received')
            return Promise.reject(new Error('No data received from server'))
        }
        console.log(`API Response [${response.config.url}]:`, response.data)
        return response
    },
    (error) => {
        console.error(`API Error [${error.config?.url}]:`, error.response?.data || error.message)
        return Promise.reject(error)
    }
)

// Add request interceptor to automatically add auth token
Server.interceptors.request.use(
    // console.log('Request Interceptor'),
    (config) => {
        const token = localStorage.getItem('token')
        if (token) {
            config.headers.Authorization = `Bearer ${token}`
        }
        console.log(`API Request [${config.url}]:`, config.data)
        return config
    },
    (error) => {
        return Promise.reject(error)
    }
)

// User authentication check
export const userCheck = async (token, callback) => {
    console.log('User auth check called')
    try {
        if (!token) {
            callback({ status: false })
            return
        }

        const response = await Server.get('/users/auth-check')
        console.log('User auth check response:', response.data)
        if (response.data?.user) {
            callback({
                status: true,
                ...response.data.user
            })
        } else {
            localStorage.removeItem('token')
            callback({ status: false })
        }
    } catch (error) {
        console.error('User auth check failed:', error)
        localStorage.removeItem('token')
        callback({ status: false })
    }
}

// Similar pattern for vendor and admin checks
export const vendorCheck = async (token, callback) => {
    try {
        if (!token) {
            callback({ status: false })
            return
        }

        const response = await Server.get('/vendor/auth-check')
        console.log('Vendor auth check response:', response.data)
        if (response.data?.vendor) {
            callback({
                status: true,
                ...response.data.vendor
            })
        } else {
            localStorage.removeItem('vendorToken')
            callback({ status: false })
        }
    } catch (error) {
        console.error('Vendor auth check failed:', error)
        localStorage.removeItem('vendorToken')
        callback({ status: false })
    }
}

export const adminCheck = async (token, callback) => {
    try {
        if (!token) {
            callback({ status: false })
            return
        }

        const response = await Server.get('/admin/auth-check')
        console.log('Admin auth check response:', response.data)
        if (response.data?.admin) {
            callback({
                status: true,
                ...response.data.admin
            })
        } else {
            localStorage.removeItem('adminToken')
            callback({ status: false })
        }
    } catch (error) {
        console.error('Admin auth check failed:', error)
        localStorage.removeItem('adminToken')
        callback({ status: false })
    }
}

export const ServerId = process.env.ServerUrl || 'http://localhost:5000'

export default Server