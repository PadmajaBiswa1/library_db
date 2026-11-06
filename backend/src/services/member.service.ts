import { db } from '../config/database';
import { IMember, MemberRole, MemberStatus } from '../types';
import { ApiError } from '../utils/apiError';

export class MemberService {
  public static async getAllMembers(query?: {
    search?: string;
    role?: string;
    department?: string;
  }): Promise<IMember[]> {
    let members = [...db.members];

    if (query?.search) {
      const s = query.search.toLowerCase().trim();
      members = members.filter(
        (m) =>
          m.firstName.toLowerCase().includes(s) ||
          m.lastName.toLowerCase().includes(s) ||
          m.identifier.toLowerCase().includes(s) ||
          m.email.toLowerCase().includes(s)
      );
    }

    if (query?.role && query.role !== 'ALL') {
      members = members.filter((m) => m.role === query.role);
    }

    if (query?.department && query.department !== 'ALL') {
      members = members.filter((m) => m.department.toLowerCase() === query.department?.toLowerCase());
    }

    return members;
  }

  public static async getMemberById(id: string): Promise<IMember> {
    const member = db.members.find((m) => m.id === id || m.identifier.toLowerCase() === id.toLowerCase());
    if (!member) {
      throw ApiError.notFound(`Member with identifier '${id}' not found`);
    }
    return member;
  }

  public static async getMemberHistory(id: string) {
    const member = await this.getMemberById(id);
    const history = db.loans.filter((l) => l.memberId === member.id);
    const currentlyIssued = history.filter((l) => l.status === 'ISSUED' || l.status === 'OVERDUE');
    const pastLoans = history.filter((l) => l.status === 'RETURNED');
    const fines = db.fines.filter((f) => f.memberId === member.id);

    return {
      member,
      currentlyIssued,
      pastLoans,
      fines,
    };
  }

  public static async createMember(data: {
    identifier: string; // USN or Faculty ID
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    role: MemberRole;
    department: string;
    semester?: number;
    designation?: string;
  }): Promise<IMember> {
    const existing = db.members.find(
      (m) => m.identifier.toLowerCase() === data.identifier.toLowerCase() || m.email.toLowerCase() === data.email.toLowerCase()
    );
    if (existing) {
      throw ApiError.conflict(`Member with identifier '${data.identifier}' or email already exists`);
    }

    const maxBooksAllowed =
      data.role === 'FACULTY'
        ? db.policies.facultyMaxBooks
        : db.policies.studentMaxBooks;

    const newMember: IMember = {
      id: `mem-${Date.now()}`,
      ...data,
      status: 'ACTIVE',
      joinedDate: new Date().toISOString().split('T')[0],
      maxBooksAllowed,
      borrowedBooksCount: 0,
    };

    db.members.unshift(newMember);
    db.logActivity('NEW_MEMBER', 'Member Registered', `Registered ${newMember.role}: ${newMember.firstName} ${newMember.lastName} (${newMember.identifier})`);
    return newMember;
  }

  public static async updateMemberStatus(id: string, status: MemberStatus): Promise<IMember> {
    const member = await this.getMemberById(id);
    member.status = status;
    return member;
  }
}
