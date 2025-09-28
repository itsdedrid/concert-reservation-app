import { Test, TestingModule } from '@nestjs/testing';
import { ConcertService } from './concert.service';
import { PrismaService } from '../prisma.service';
import { prismaMock } from '../testing/prisma.mock';

describe('ConcertService', () => {
  let service: ConcertService;

  beforeEach(async () => {
    jest.clearAllMocks();
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ConcertService,
        { provide: PrismaService, useValue: prismaMock },
      ],
    }).compile();

    service = module.get<ConcertService>(ConcertService);
  });

  it('create() should call prisma.concert.create with normalized description', async () => {
    prismaMock.concert.create.mockResolvedValue({ id: 'c1' });
    await service.create({ name: 'A', totalSeats: 100 });
    expect(prismaMock.concert.create).toHaveBeenCalledWith({
      data: { name: 'A', totalSeats: 100, description: '' },
    });
  });

  it('findAll() should order by createdAt desc', async () => {
    prismaMock.concert.findMany.mockResolvedValue([{ id: 'c1' }]);
    const res = await service.findAll();
    expect(prismaMock.concert.findMany).toHaveBeenCalledWith({
      orderBy: { createdAt: 'desc' },
    });
    expect(res).toEqual([{ id: 'c1' }]);
  });

  it('update() should pass partial fields to prisma', async () => {
    prismaMock.concert.update.mockResolvedValue({ id: 'c1', name: 'B' });
    const res = await service.update('c1', { name: 'B' });
    expect(prismaMock.concert.update).toHaveBeenCalledWith({
      where: { id: 'c1' },
      data: { name: 'B' },
    });
    expect(res).toEqual({ id: 'c1', name: 'B' });
  });

  it('remove() should delete reservations then concert in a transaction', async () => {
    prismaMock.$transaction.mockImplementation(async (cb) => {
      await cb(prismaMock);
    });

    await service.remove('c1');

    expect(prismaMock.$transaction).toHaveBeenCalled();
    expect(prismaMock.reservation.deleteMany).toHaveBeenCalledWith({
      where: { concertId: 'c1' },
    });
    expect(prismaMock.concert.delete).toHaveBeenCalledWith({
      where: { id: 'c1' },
    });
  });
});
