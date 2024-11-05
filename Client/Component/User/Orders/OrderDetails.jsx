import { validateAPIResponse, isValidObject } from '@/Utils/validation'

const OrderDetails = ({ orderId }) => {
    const [orderData, setOrderData] = useState(null)
    const [error, setError] = useState(null)

    useEffect(() => {
        const fetchOrderDetails = async () => {
            try {
                const response = await Server.get(`/orders/${orderId}`)
                
                // Validate main response
                if (!validateAPIResponse(response.data, 'object')) {
                    throw new Error('Invalid order data received')
                }

                // Validate nested arrays/objects if needed
                const { items, shipping } = response.data
                if (!isValidArray(items)) {
                    throw new Error('Order items data is invalid')
                }
                if (!isValidObject(shipping)) {
                    throw new Error('Shipping information is invalid')
                }

                setOrderData(response.data)
                setError(null)
            } catch (error) {
                console.error('Failed to fetch order details:', error)
                setError('Unable to load order details')
                setOrderData(null)
            }
        }

        if (orderId) {
            fetchOrderDetails()
        }
    }, [orderId])

    if (error) return <div className="error-message">{error}</div>
    if (!orderData) return <div>Loading...</div>

    return (
        <div>
            <h2>Order #{orderData.orderNumber}</h2>
            {orderData.items?.length > 0 ? (
                <div className="order-items">
                    {orderData.items.map(item => (
                        <OrderItem 
                            key={item._id} 
                            item={item}
                        />
                    ))}
                </div>
            ) : (
                <div>No items in this order</div>
            )}
            
            {orderData.shipping && (
                <ShippingDetails 
                    shipping={orderData.shipping}
                />
            )}
        </div>
    )
} 