import { Request, Response, NextFunction } from 'express';
import { ReservationService } from '../services/reservation.service';
import { ApiResponse } from '../utils/apiResponse';
import { HTTP_STATUS } from '../constants';

export class ReservationController {
  public static async getAll(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { status } = req.query;
      const reservations = await ReservationService.getAllReservations(status as string);
      res.status(HTTP_STATUS.OK).json(ApiResponse.success(reservations, 'Reservations fetched'));
    } catch (error) {
      next(error);
    }
  }

  public static async create(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const resv = await ReservationService.createReservation(req.body);
      res.status(HTTP_STATUS.CREATED).json(ApiResponse.success(resv, 'Reservation placed successfully'));
    } catch (error) {
      next(error);
    }
  }

  public static async cancel(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const resv = await ReservationService.cancelReservation(req.params.id as string);
      res.status(HTTP_STATUS.OK).json(ApiResponse.success(resv, 'Reservation cancelled'));
    } catch (error) {
      next(error);
    }
  }

  public static async fulfill(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const resv = await ReservationService.fulfillReservation(req.params.id as string);
      res.status(HTTP_STATUS.OK).json(ApiResponse.success(resv, 'Reservation marked as fulfilled'));
    } catch (error) {
      next(error);
    }
  }
}
