import { validateAPIResponse } from '@/Utils/validation'

export const fetchCartItems = () => async (dispatch) => {
    try {
        dispatch({ type: 'CART_LOADING' })
        
        const response = await Server.get('/cart/items')
        
        if (!validateAPIResponse(response.data, 'array')) {
            throw new Error('Invalid cart data received')
        }

        dispatch({
            type: 'SET_CART_ITEMS',
            payload: response.data
        })
    } catch (error) {
        console.error('Cart fetch error:', error)
        dispatch({
            type: 'CART_ERROR',
            payload: error.message || 'Failed to load cart items'
        })
        // Set empty array as fallback
        dispatch({
            type: 'SET_CART_ITEMS',
            payload: []
        })
    }
} 