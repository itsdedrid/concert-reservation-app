import { Test, TestingModule } from '@nestjs/testing';
import { ReservationService } from './reservation.service';
import { PrismaService } from '../prisma.service';
import { prismaMock } from '../testing/prisma.mock';
import { ConflictException, NotFoundException } from '@nestjs/common';

describe('ReservationService', () => {
  let service: ReservationService;

  beforeEach(async () => {
    jest.clearAllMocks();
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ReservationService,
        { provide: PrismaService, useValue: prismaMock },
      ],
    }).compile();

    service = module.get<ReservationService>(ReservationService);
  });

  describe('reserve', () => {
    it('throws NotFound if concert does not exist', async () => {
      prismaMock.concert.findUnique.mockResolvedValue(null);

      await expect(service.reserve('u1', 'cX'))
        .rejects.toBeInstanceOf(NotFoundException);
    });

    it('throws Conflict if already reserved', async () => {
      prismaMock.concert.findUnique.mockResolvedValue({ id: 'c1', totalSeats: 10 });
      prismaMock.reservation.findFirst.mockResolvedValue({ id: 'r1' });

      await expect(service.reserve('u1', 'c1'))
        .rejects.toBeInstanceOf(ConflictException);
    });

    it('throws Conflict if sold out', async () => {
      prismaMock.concert.findUnique.mockResolvedValue({ id: 'c1', totalSeats: 1 });
      prismaMock.reservation.findFirst.mockResolvedValue(null);
      prismaMock.reservation.count.mockResolvedValue(1);

      await expect(service.reserve('u1', 'c1'))
        .rejects.toBeInstanceOf(ConflictException);
    });

    it('creates reservation when valid', async () => {
      prismaMock.concert.findUnique.mockResolvedValue({ id: 'c1', totalSeats: 10 });
      prismaMock.reservation.findFirst.mockResolvedValue(null);
      prismaMock.reservation.count.mockResolvedValue(0);
      prismaMock.reservation.create.mockResolvedValue({ id: 'r1' });

      const res = await service.reserve('u1', 'c1');
      expect(prismaMock.reservation.create).toHaveBeenCalledWith({
        data: { userId: 'u1', concertId: 'c1', status: 'RESERVED' },
      });
      expect(res).toEqual({ id: 'r1' });
    });
  });

  describe('cancel', () => {
    it('throws NotFound if reservation not exists', async () => {
      prismaMock.reservation.findUnique.mockResolvedValue(null);

      await expect(service.cancel('rX', 'u1'))
        .rejects.toBeInstanceOf(NotFoundException);
    });

    it('throws Conflict if user mismatch', async () => {
      prismaMock.reservation.findUnique.mockResolvedValue({ id: 'r1', userId: 'u2' });

      await expect(service.cancel('r1', 'u1'))
        .rejects.toBeInstanceOf(ConflictException);
    });

    it('updates status to CANCELLED', async () => {
      prismaMock.reservation.findUnique.mockResolvedValue({ id: 'r1', userId: 'u1' });
      prismaMock.reservation.update.mockResolvedValue({ id: 'r1', status: 'CANCELLED' });

      const res = await service.cancel('r1', 'u1');
      expect(prismaMock.reservation.update).toHaveBeenCalledWith({
        where: { id: 'r1' },
        data: { status: 'CANCELLED' },
      });
      expect(res).toEqual({ id: 'r1', status: 'CANCELLED' });
    });
  });
});
