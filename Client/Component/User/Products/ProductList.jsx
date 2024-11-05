import { validateAPIResponse } from '@/Utils/validation'

const ProductList = () => {
    const [products, setProducts] = useState([])
    const [error, setError] = useState(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                setLoading(true)
                const response = await Server.get('/products')
                
                if (!validateAPIResponse(response.data, 'array')) {
                    throw new Error('Invalid product data received')
                }

                setProducts(response.data)
                setError(null)
            } catch (error) {
                console.error('Failed to fetch products:', error)
                setError('Unable to load products')
                setProducts([]) // Set empty array as fallback
            } finally {
                setLoading(false)
            }
        }

        fetchProducts()
    }, [])

    if (loading) return <div>Loading...</div>
    if (error) return <div>{error}</div>
    
    return (
        <div>
            {products.length > 0 ? (
                products.map(product => (
                    <ProductCard key={product._id} product={product} />
                ))
            ) : (
                <div>No products found</div>
            )}
        </div>
    )
} 