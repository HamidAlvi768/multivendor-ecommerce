import Server from '@/Config/Server'

// Before
fetch('http://localhost:3000/users/someEndpoint')

// After
fetch('http://localhost:5000/api/users/someEndpoint')

// Or better yet, use the Server instance:
Server.get('/users/someEndpoint')
    .then(response => {
        console.log('Data from someEndpoint:', response.data)
        // rest of your code
    })
    .catch(error => {
        console.error('Error from someEndpoint:', error)
    })