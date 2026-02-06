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

## Troubleshooting

- If stuck at loading tests, the backend might be down. Restart it with `node src/Index.js`.    
    - If this doesn't work, try stopping the servers with `make stop` and then restarting them.
    - If this still doesn't work, try clearing session storage in the browser (DevTools > Application > Session Storage > Clear) and refresh.
