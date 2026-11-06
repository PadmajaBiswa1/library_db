import { db } from '../config/database';
import { IBook, BookCategory } from '../types';
import { ApiError } from '../utils/apiError';

export class BookService {
  public static async getAllBooks(query?: {
    search?: string;
    category?: string;
    subject?: string;
    availability?: string; // 'AVAILABLE' | 'ISSUED' | 'ALL'
  }): Promise<IBook[]> {
    let books = [...db.books];

    if (query?.search) {
      const s = query.search.toLowerCase().trim();
      books = books.filter(
        (b) =>
          b.title.toLowerCase().includes(s) ||
          b.author.toLowerCase().includes(s) ||
          b.isbn.toLowerCase().includes(s) ||
          b.publisher.toLowerCase().includes(s) ||
          b.subject.toLowerCase().includes(s)
      );
    }

    if (query?.category && query.category !== 'ALL') {
      books = books.filter((b) => b.category === query.category);
    }

    if (query?.subject && query.subject !== 'ALL') {
      books = books.filter((b) => b.subject.toLowerCase() === query.subject?.toLowerCase());
    }

    if (query?.availability) {
      if (query.availability === 'AVAILABLE') {
        books = books.filter((b) => b.availableCopies > 0);
      } else if (query.availability === 'ISSUED') {
        books = books.filter((b) => b.availableCopies === 0);
      }
    }

    return books;
  }

  public static async getBookById(id: string): Promise<IBook> {
    const book = db.books.find((b) => b.id === id);
    if (!book) {
      throw ApiError.notFound(`Book with ID '${id}' not found`);
    }
    return book;
  }

  public static async createBook(data: {
    isbn: string;
    title: string;
    author: string;
    publisher: string;
    edition: string;
    category: BookCategory;
    subject: string;
    publicationYear: number;
    totalCopies: number;
    block: string;
    rack: string;
    shelf: string;
  }): Promise<IBook> {
    const existing = db.books.find((b) => b.isbn === data.isbn);
    if (existing) {
      throw ApiError.conflict(`Book with ISBN '${data.isbn}' already exists`);
    }

    const shelfLocation = `${data.block} / ${data.rack} / ${data.shelf}`;
    const newBook: IBook = {
      id: `book-${Date.now()}`,
      ...data,
      shelfLocation,
      availableCopies: data.totalCopies,
      conditionGood: data.totalCopies,
      conditionDamaged: 0,
      conditionLost: 0,
      status: 'AVAILABLE',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    db.books.unshift(newBook);
    db.logActivity('NEW_BOOK', 'New Book Cataloged', `Added "${newBook.title}" (${newBook.totalCopies} copies)`, 'Catalog Desk');
    return newBook;
  }

  public static async updateBook(id: string, updates: Partial<IBook>): Promise<IBook> {
    const index = db.books.findIndex((b) => b.id === id);
    if (index === -1) {
      throw ApiError.notFound(`Book with ID '${id}' not found`);
    }

    const current = db.books[index];
    const shelfLocation =
      updates.block || updates.rack || updates.shelf
        ? `${updates.block || current.block} / ${updates.rack || current.rack} / ${updates.shelf || current.shelf}`
        : current.shelfLocation;

    const updatedBook: IBook = {
      ...current,
      ...updates,
      shelfLocation,
      updatedAt: new Date().toISOString(),
    };

    db.books[index] = updatedBook;
    return updatedBook;
  }

  public static async deleteBook(id: string): Promise<void> {
    const index = db.books.findIndex((b) => b.id === id);
    if (index === -1) {
      throw ApiError.notFound(`Book with ID '${id}' not found`);
    }

    const activeLoan = db.loans.find((l) => l.bookId === id && (l.status === 'ISSUED' || l.status === 'OVERDUE'));
    if (activeLoan) {
      throw ApiError.badRequest('Cannot delete book while copies are actively issued to patrons');
    }

    const removed = db.books.splice(index, 1)[0];
    db.logActivity('BOOK_ADDED' as any, 'Book Record Removed', `Deleted catalog record: "${removed.title}"`);
  }
}
