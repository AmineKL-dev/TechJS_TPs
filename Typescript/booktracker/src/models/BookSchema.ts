// src/models/BookSchema.ts — Mongoose schema & model

import mongoose, { Schema, Document } from "mongoose";
import { BookStatus, BookFormat } from "./Book";

export interface IBook extends Document {
  title: string;
  author: string;
  numberOfPages: number;
  status: BookStatus;
  price: number;
  pagesRead: number;
  format: BookFormat;
  suggestedBy: string;
  finished: boolean;
  createdAt: Date;
}

const BookSchema = new Schema<IBook>(
  {
    title: { type: String, required: true, trim: true },
    author: { type: String, required: true, trim: true },
    numberOfPages: { type: Number, required: true, min: 1 },
    status: {
      type: String,
      required: true,
      enum: ["Read", "Re-read", "DNF", "Currently reading", "Returned Unread", "Want to read"],
    },
    price: { type: Number, required: true, min: 0 },
    pagesRead: { type: Number, default: 0, min: 0 },
    format: {
      type: String,
      required: true,
      enum: ["Print", "PDF", "Ebook", "AudioBook"],
    },
    suggestedBy: { type: String, required: true, trim: true },
    finished: { type: Boolean, default: false },
  },
  { timestamps: true }
);

// Auto-set finished when pagesRead == numberOfPages
BookSchema.pre("save", function (next) {
  if (this.pagesRead >= this.numberOfPages) {
    this.finished = true;
  }
  next();
});

BookSchema.pre("findOneAndUpdate", function (next) {
  const update = this.getUpdate() as Partial<IBook>;
  if (
    update.pagesRead !== undefined &&
    update.numberOfPages !== undefined &&
    update.pagesRead >= update.numberOfPages
  ) {
    update.finished = true;
  }
  next();
});

export const BookModel = mongoose.model<IBook>("Book", BookSchema);
