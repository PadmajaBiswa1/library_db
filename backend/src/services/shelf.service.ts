import { db } from '../config/database';
import { IShelfLocation } from '../types';
import { ApiError } from '../utils/apiError';

export class ShelfService {
  public static async getAllShelves(): Promise<IShelfLocation[]> {
    // Recalculate current count of books per shelf
    for (const shelf of db.shelfLocations) {
      const matchCount = db.books
        .filter((b) => b.block === shelf.block && b.rack === shelf.rack)
        .reduce((sum, b) => sum + b.totalCopies, 0);
      shelf.currentCount = matchCount;
    }
    return db.shelfLocations;
  }

  public static async createShelf(data: Omit<IShelfLocation, 'id' | 'currentCount'>): Promise<IShelfLocation> {
    const existing = db.shelfLocations.find(
      (s) => s.block === data.block && s.rack === data.rack && s.shelfNumber === data.shelfNumber
    );
    if (existing) {
      throw ApiError.conflict(`Rack location '${data.block} / ${data.rack} / ${data.shelfNumber}' already exists`);
    }

    const newShelf: IShelfLocation = {
      id: `loc-${Date.now()}`,
      ...data,
      currentCount: 0,
    };

    db.shelfLocations.push(newShelf);
    return newShelf;
  }

  public static async getBooksOnShelf(block: string, rack: string) {
    return db.books.filter((b) => b.block === block && b.rack === rack);
  }
}
