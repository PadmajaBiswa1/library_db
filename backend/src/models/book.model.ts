import { z } from 'zod';
import { BOOK_CATEGORIES } from '../constants';

export const createBookSchema = z.object({
  body: z.object({
    title: z.string().min(1, 'Title is required').max(200),
    author: z.string().min(1, 'Author is required').max(150),
    isbn: z.string().min(10, 'Valid ISBN is required'),
    category: z.enum(BOOK_CATEGORIES as unknown as [string, ...string[]]),
    publicationYear: z
      .number()
      .int()
      .min(1000)
      .max(new Date().getFullYear() + 1),
    totalCopies: z.number().int().min(1, 'Must have at least 1 copy'),
    shelfLocation: z.string().min(1, 'Shelf location is required'),
  }),
});

export const updateBookSchema = z.object({
  params: z.object({
    id: z.string().min(1),
  }),
  body: z.object({
    title: z.string().min(1).optional(),
    author: z.string().min(1).optional(),
    isbn: z.string().optional(),
    category: z.enum(BOOK_CATEGORIES as unknown as [string, ...string[]]).optional(),
    publicationYear: z.number().int().optional(),
    totalCopies: z.number().int().min(1).optional(),
    shelfLocation: z.string().optional(),
  }),
});

export const createLoanSchema = z.object({
  body: z.object({
    bookId: z.string().min(1, 'Book ID is required'),
    memberId: z.string().min(1, 'Member ID is required'),
    notes: z.string().optional(),
  }),
});
