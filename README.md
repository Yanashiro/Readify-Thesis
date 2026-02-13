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

### Examinee Side

- After submitting a test, answers are compared against correct answers and a score is saved.
- The **Profile** page displays a history table showing: attempt number, test category, type (Main/Practice), score, and date.
- The **Main Test** selection page shows whether a test has been completed, along with the score and band.

### Admin Side

- **View Scores** (under Test Review) lets admins search and browse all examinee accounts.
- Clicking on an account shows that user's full attempt history with scores and dates.
- Clicking on an attempt shows the submitted answers.

### Database

Test attempts are stored in the `testattempts` collection with the following fields:

- `examinee` - username
- `testType` - "Main" or "Practice"
- `testCategory` - e.g. "Multiple Choice", "Identifying Information"
- `submittedAnswers` - the user's answers keyed by question number
- `score` - number of correct answers
- `totalQuestions` - total questions in the test
- `testDate` - timestamp

### API Routes

| Method | Route | Description |
|--------|-------|-------------|
| POST | `/maintestroute/examSubmission` | Score and save a main test submission |
| POST | `/practicetestroute/examSubmission` | Score and save a practice test submission |
| GET | `/maintestAttempts?examinee=` | Get a user's attempt history (Profile page) |
| POST | `/maintestselection/retrieveData` | Get score/band for a specific test |
| GET | `/maintestselection/status?examinee=` | Get overall main test completion status |
| POST | `/accountlist` | Get all examinee accounts (admin) |
| GET | `/accountAttempts?examinee=` | Get a specific user's attempts (admin) |

## Troubleshooting

- If stuck at loading tests, the backend might be down. Restart it with `node src/Index.js`.    
    - If this doesn't work, try stopping the servers with `make stop` and then restarting them.
    - If this still doesn't work, try clearing session storage in the browser (DevTools > Application > Session Storage > Clear) and refresh.
