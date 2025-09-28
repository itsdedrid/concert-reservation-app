import { Injectable, ConflictException, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';

@Injectable()
export class ReservationService {
  constructor(private prisma: PrismaService) {}

  async reserve(userId: string, concertId: string) {
    const concert = await this.prisma.concert.findUnique({ where: { id: concertId } });
    if (!concert) throw new NotFoundException('Concert not found');

    const existed = await this.prisma.reservation.findFirst({
      where: { userId, concertId, status: 'RESERVED' },
    });
    if (existed) throw new ConflictException('Already reserved');

    const reservedCount = await this.prisma.reservation.count({
      where: { concertId, status: 'RESERVED' },
    });
    if (reservedCount >= concert.totalSeats) throw new ConflictException('Sold out');

    return this.prisma.reservation.create({
      data: { userId, concertId, status: 'RESERVED' },
    });
  }

  async cancel(reservationId: string, userId: string) {
    const res = await this.prisma.reservation.findUnique({ where: { id: reservationId } });
    if (!res) throw new NotFoundException('Reservation not found');
    if (res.userId !== userId) throw new ConflictException('Forbidden');

    return this.prisma.reservation.update({
      where: { id: reservationId },
      data: { status: 'CANCELLED' },
    });
  }

  async history(userId: string) {
    return this.prisma.reservation.findMany({
      where: { userId },
      include: { concert: true },
      orderBy: { createdAt: 'desc' },
    });
  }

  async adminHistory() {
    return this.prisma.reservation.findMany({
      include: { user: true, concert: true },
      orderBy: { createdAt: 'desc' },
    });
  }

  async summary() {
    const totalSeatsAgg = await this.prisma.concert.aggregate({
      _sum: { totalSeats: true },
    });

    const [reserve, cancel] = await Promise.all([
      this.prisma.reservation.count({ where: { status: 'RESERVED' } }),
      this.prisma.reservation.count({ where: { status: 'CANCELED' } }),
    ]);

    return {
      totalSeats: totalSeatsAgg._sum.totalSeats ?? 0,
      reserve,
      cancel,
    };
  }
}
