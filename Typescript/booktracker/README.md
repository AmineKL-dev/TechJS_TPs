# 📚 Folio — Reading Tracker

A full-stack TypeScript book tracking app with MongoDB.

## Project Structure

```
booktracker/
├── src/
│   ├── models/
│   │   ├── Book.ts          ← Book class module (with constructor, currentlyAt, deleteBook)
│   │   └── BookSchema.ts    ← Mongoose schema & model
│   ├── routes/
│   │   └── books.ts         ← REST API routes
│   └── server.ts            ← Express entry point
├── public/
│   └── index.html           ← Frontend (Tailwind CSS)
├── package.json
├── tsconfig.json
└── .env.example
```

## Prerequisites

- Node.js 18+
- MongoDB (local or Atlas)

## Setup

```bash
# 1. Install dependencies
npm install

# 2. Configure environment
cp .env.example .env
# Edit .env with your MongoDB URI

# 3a. Development (ts-node)
npm run dev

# 3b. Production (compile first)
npm run build
npm start
```

The app will be available at **http://localhost:3000**

## API Endpoints

| Method | Path              | Description           |
|--------|-------------------|-----------------------|
| GET    | /api/books        | List all books        |
| GET    | /api/books/stats  | Global reading stats  |
| POST   | /api/books        | Add a new book        |
| PUT    | /api/books/:id    | Update a book         |
| DELETE | /api/books/:id    | Delete a book         |

## Book Class (src/models/Book.ts)

```typescript
import { Book } from './src/models/Book';

const book = new Book({
  title: 'Dune',
  author: 'Frank Herbert',
  numberOfPages: 688,
  status: 'Currently reading',
  price: 15.99,
  pagesRead: 200,
  format: 'Print',
  suggestedBy: 'A friend',
});

book.currentlyAt(688); // marks as finished automatically
book.readingProgress;  // → 100

await Book.deleteBook('mongoId'); // calls DELETE /api/books/:id
```

## Data Model

| Field         | Type        | Notes                                      |
|---------------|-------------|--------------------------------------------|
| title         | string      | Required                                   |
| author        | string      | Required                                   |
| numberOfPages | number      | Required, min 1                            |
| status        | enum        | Read / Re-read / DNF / Currently reading / Returned Unread / Want to read |
| price         | number      | Required, min 0                            |
| pagesRead     | number      | Default 0, must be ≤ numberOfPages         |
| format        | enum        | Print / PDF / Ebook / AudioBook            |
| suggestedBy   | string      | Required                                   |
| finished      | boolean     | Default false; auto-set when pagesRead === numberOfPages |
