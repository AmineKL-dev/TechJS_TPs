// src/models/Book.ts — Book class module

export type BookStatus =
  | "Read"
  | "Re-read"
  | "DNF"
  | "Currently reading"
  | "Returned Unread"
  | "Want to read";

export type BookFormat = "Print" | "PDF" | "Ebook" | "AudioBook";

export interface BookData {
  title: string;
  author: string;
  numberOfPages: number;
  status: BookStatus;
  price: number;
  pagesRead: number;
  format: BookFormat;
  suggestedBy: string;
  finished: boolean;
}

// ─── Book Class ──────────────────────────────────────────────────────────────

export class Book {
  title: string;
  author: string;
  numberOfPages: number;
  status: BookStatus;
  price: number;
  pagesRead: number;
  format: BookFormat;
  suggestedBy: string;
  finished: boolean;

  constructor(data: Omit<BookData, "finished"> & { pagesRead?: number }) {
    this.title = data.title;
    this.author = data.author;
    this.numberOfPages = data.numberOfPages;
    this.status = data.status;
    this.price = data.price;
    this.format = data.format;
    this.suggestedBy = data.suggestedBy;
    this.pagesRead = data.pagesRead ?? 0;

    // finished defaults to false; auto-set to true when pages are complete
    this.finished = this.pagesRead >= this.numberOfPages && this.numberOfPages > 0;
  }

  /**
   * Update the number of pages read.
   * Automatically marks the book as finished when pagesRead reaches numberOfPages.
   */
  currentlyAt(pages: number): void {
    if (pages < 0) throw new RangeError("Pages read cannot be negative.");
    if (pages > this.numberOfPages) {
      throw new RangeError(
        `Pages read (${pages}) cannot exceed total pages (${this.numberOfPages}).`
      );
    }
    this.pagesRead = pages;
    this.finished = this.pagesRead >= this.numberOfPages;
  }

  /**
   * Returns a plain object representation of the book (for persistence).
   */
  toJSON(): BookData {
    return {
      title: this.title,
      author: this.author,
      numberOfPages: this.numberOfPages,
      status: this.status,
      price: this.price,
      pagesRead: this.pagesRead,
      format: this.format,
      suggestedBy: this.suggestedBy,
      finished: this.finished,
    };
  }

  /**
   * Percentage of the book read (0–100).
   */
  get readingProgress(): number {
    if (this.numberOfPages === 0) return 0;
    return Math.round((this.pagesRead / this.numberOfPages) * 100);
  }

  /**
   * Static factory: build a Book instance from a plain object.
   */
  static fromJSON(data: BookData): Book {
    const book = new Book(data);
    book.finished = data.finished;
    return book;
  }

  /**
   * deleteBook — removes the book from MongoDB via the API.
   * (Thin client-side helper; actual deletion is handled server-side.)
   */
  static async deleteBook(id: string): Promise<boolean> {
    const res = await fetch(`/api/books/${id}`, { method: "DELETE" });
    return res.ok;
  }
}
