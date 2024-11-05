# API Connection Troubleshooting Guide

## Common Issues That Cause 404 Errors:

1. CORS Configuration
   - The server needs proper CORS configuration to accept requests from the frontend
   - Add this to your server's app.js:
   ```javascript
   import cors from 'cors';
   
   app.use(cors({
     origin: 'http://localhost:3000',
     credentials: true
   }));
   ```

2. API Base URL Configuration
   - Check your frontend API configuration
   - In Client/Config/Server.js, ensure your base URL is correctly set:
   ```javascript
   const baseURL = 'http://localhost:5000';
   ```

3. Express Router Configuration
   - Ensure your Express app is properly using the routers
   - In your server's app.js, add:
   ```javascript
   import userRoutes from './Routes/users.js';
   import adminRoutes from './Routes/admin.js';
   import vendorRoutes from './Routes/vendor.js';
   
   app.use('/users', userRoutes);
   app.use('/admin', adminRoutes);
   app.use('/vendor', vendorRoutes);
   ```

4. Body Parser Configuration
   - Express needs body-parser to handle POST requests
   - Add to your server's app.js:
   ```javascript
   import bodyParser from 'body-parser';
   
   app.use(bodyParser.json());
   app.use(bodyParser.urlencoded({ extended: true }));
   ```

5. Environment Variables
   - Ensure your .env file is properly configured
   - Create .env in the SERVER directory with:
   ```
   PORT=5000
   DB_URL=your_mongodb_url
   DB_NAME=your_db_name
   JWT_SECRET=your_secret
   ```

## Verification Steps:

1. Server Status Check:
   ```bash
   curl http://localhost:5000
   ```
   Should return a response, not a connection error

2. API Endpoint Test:
   ```bash
   curl http://localhost:5000/users/findCupon
   ```
   Should return a response (even if it's an error), not 404

3. Check Network Tab:
   - Open browser DevTools
   - Go to Network tab
   - Look for:
     - Correct request URL
     - Request headers (especially Origin)
     - Response headers (especially Access-Control-Allow-Origin)

## Quick Fixes:

1. If using Next.js API routes:
   - Create a proxy in next.config.js:
   ```javascript
   module.exports = {
     async rewrites() {
       return [
         {
           source: '/api/:path*',
           destination: 'http://localhost:5000/:path*'
         }
       ]
     }
   }
   ```

2. If using axios:
   - Add withCredentials option:
   ```javascript
   axios.create({
     baseURL: 'http://localhost:5000',
     withCredentials: true
   })
   ```

3. Check server startup:
   - Ensure no errors in server console
   - Verify port 5000 isn't in use:
   ```bash
   lsof -i :5000
   ```

4. Test API endpoints with Postman:
   - If working in Postman but not frontend, likely CORS issue
   - If not working in Postman, likely server route issue

Remember: Always check server console for error messages and ensure both frontend and backend are running simultaneously.
