### Setup

Install dependencies:

    npm install
    npm install react-cookie

Start MongoDB (if using Docker):

    docker run -d -p 27017:27017 --name readify-mongo mongo

Seed the database:

    node src/seed.js

### Running

Start both servers:

    make dev

Or start them individually:

    node src/Index.js
    npm run dev

- Frontend: http://localhost:5173
- Backend: http://localhost:5000


### Build

    npm run build
