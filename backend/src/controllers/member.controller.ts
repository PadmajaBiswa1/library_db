import { Request, Response, NextFunction } from 'express';
import { MemberService } from '../services/member.service';
import { ApiResponse } from '../utils/apiResponse';
import { HTTP_STATUS } from '../constants';

export class MemberController {
  public static async getAll(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { search, role, department } = req.query;
      const members = await MemberService.getAllMembers({
        search: search as string,
        role: role as string,
        department: department as string,
      });
      res.status(HTTP_STATUS.OK).json(ApiResponse.success(members, 'Members fetched successfully'));
    } catch (error) {
      next(error);
    }
  }

  public static async getById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const member = await MemberService.getMemberById(req.params.id as string);
      res.status(HTTP_STATUS.OK).json(ApiResponse.success(member, 'Member details retrieved'));
    } catch (error) {
      next(error);
    }
  }

  public static async getHistory(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const history = await MemberService.getMemberHistory(req.params.id as string);
      res.status(HTTP_STATUS.OK).json(ApiResponse.success(history, 'Member history retrieved'));
    } catch (error) {
      next(error);
    }
  }

  public static async create(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const member = await MemberService.createMember(req.body);
      res.status(HTTP_STATUS.CREATED).json(ApiResponse.success(member, 'Member registered successfully'));
    } catch (error) {
      next(error);
    }
  }

  public static async updateStatus(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const member = await MemberService.updateMemberStatus(req.params.id as string, req.body.status);
      res.status(HTTP_STATUS.OK).json(ApiResponse.success(member, 'Member status updated'));
    } catch (error) {
      next(error);
    }
  }
}
