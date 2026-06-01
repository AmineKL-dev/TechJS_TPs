// src/routes/books.ts

import { Router, Request, Response } from "express";
import { BookModel } from "../models/BookSchema";
import { Book } from "../models/Book";

const router = Router();

// GET /api/books — list all books
router.get("/", async (_req: Request, res: Response) => {
  try {
    const books = await BookModel.find().sort({ createdAt: -1 });
    res.json(books);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch books" });
  }
});

// GET /api/books/stats — global stats
router.get("/stats", async (_req: Request, res: Response) => {
  try {
    const books = await BookModel.find();
    const totalBooks = books.length;
    const booksRead = books.filter((b) => b.finished).length;
    const totalPages = books.reduce((sum, b) => sum + b.numberOfPages, 0);
    const pagesRead = books.reduce((sum, b) => sum + b.pagesRead, 0);
    res.json({ totalBooks, booksRead, totalPages, pagesRead });
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch stats" });
  }
});

// POST /api/books — create a book
router.post("/", async (req: Request, res: Response) => {
  try {
    const data = req.body;
    // Use Book class to validate and compute finished
    const bookInstance = new Book(data);
    const doc = new BookModel(bookInstance.toJSON());
    await doc.save();
    res.status(201).json(doc);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Validation error";
    res.status(400).json({ error: message });
  }
});

// PUT /api/books/:id — update a book
router.put("/:id", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const update = req.body;

    // Re-compute finished flag server-side
    if (update.pagesRead !== undefined) {
      const existing = await BookModel.findById(id);
      if (!existing) {
        res.status(404).json({ error: "Book not found" });
        return;
      }
      const totalPages = update.numberOfPages ?? existing.numberOfPages;
      update.finished = update.pagesRead >= totalPages;
    }

    const updated = await BookModel.findByIdAndUpdate(id, update, {
      new: true,
      runValidators: true,
    });
    if (!updated) {
      res.status(404).json({ error: "Book not found" });
      return;
    }
    res.json(updated);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Update error";
    res.status(400).json({ error: message });
  }
});

// DELETE /api/books/:id
router.delete("/:id", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const deleted = await BookModel.findByIdAndDelete(id);
    if (!deleted) {
      res.status(404).json({ error: "Book not found" });
      return;
    }
    res.json({ message: "Book deleted" });
  } catch (err) {
    res.status(500).json({ error: "Delete failed" });
  }
});

export default router;
