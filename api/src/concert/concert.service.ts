import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';

@Injectable()
export class ConcertService {
  constructor(private prisma: PrismaService) {}

  async create(data: { name: string; totalSeats: number; description?: string }) {
    return this.prisma.concert.create({
      data: {
        name: data.name,
        totalSeats: data.totalSeats,
        description: data.description ?? '',
      },
    });
  }

  async findAll() {
    return this.prisma.concert.findMany({
      orderBy: { createdAt: 'desc' },
    });
  }

  async update(
    id: string,
    data: Partial<{ name: string; totalSeats: number; description?: string }>
  ) {
    return this.prisma.concert.update({
      where: { id },
      data: {
        ...(data.name !== undefined ? { name: data.name } : {}),
        ...(data.totalSeats !== undefined ? { totalSeats: data.totalSeats } : {}),
        ...(data.description !== undefined ? { description: data.description } : {}),
      },
    });
  }

  async remove(id: string) {
    await this.prisma.$transaction(async (tx) => {
      await tx.reservation.deleteMany({ where: { concertId: id } });
      await tx.concert.delete({ where: { id } });
    });
    return { ok: true };
  }
}
