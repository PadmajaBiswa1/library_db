import { db } from '../config/database';
import { ILibraryPolicy } from '../types';

export class PolicyService {
  public static async getPolicies(): Promise<ILibraryPolicy> {
    return db.policies;
  }

  public static async updatePolicies(updates: Partial<ILibraryPolicy>): Promise<ILibraryPolicy> {
    db.policies = {
      ...db.policies,
      ...updates,
      libraryTimings: {
        ...db.policies.libraryTimings,
        ...(updates.libraryTimings || {}),
      },
    };

    // Reflect max book limits to members
    if (updates.studentMaxBooks !== undefined || updates.facultyMaxBooks !== undefined) {
      for (const m of db.members) {
        if (m.role === 'STUDENT' && updates.studentMaxBooks !== undefined) {
          m.maxBooksAllowed = updates.studentMaxBooks;
        } else if (m.role === 'FACULTY' && updates.facultyMaxBooks !== undefined) {
          m.maxBooksAllowed = updates.facultyMaxBooks;
        }
      }
    }

    db.logActivity('NEW_BOOK' as any, 'Library Policies Updated', 'Updated borrowing limits, loan durations, and operational fine rates.');
    return db.policies;
  }
}
