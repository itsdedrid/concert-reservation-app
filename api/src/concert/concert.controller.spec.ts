import { Test, TestingModule } from '@nestjs/testing';
import { ConcertController } from './concert.controller';
import { ConcertService } from './concert.service';

describe('ConcertController', () => {
  let controller: ConcertController;
  const serviceMock = {
    create: jest.fn(),
    findAll: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    jest.clearAllMocks();
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ConcertController],
      providers: [{ provide: ConcertService, useValue: serviceMock }],
    }).compile();

    controller = module.get<ConcertController>(ConcertController);
  });

  it('create() delegates to service', async () => {
    serviceMock.create.mockResolvedValue({ id: 'c1' });
    const res = await controller.create({ name: 'A', totalSeats: 10 });
    expect(serviceMock.create).toHaveBeenCalledWith({ name: 'A', totalSeats: 10 });
    expect(res).toEqual({ id: 'c1' });
  });

  it('findAll() delegates to service', async () => {
    serviceMock.findAll.mockResolvedValue([{ id: 'c1' }]);
    const res = await controller.findAll();
    expect(res).toEqual([{ id: 'c1' }]);
  });

  it('remove() delegates to service', async () => {
    serviceMock.remove.mockResolvedValue({ ok: true });
    const res = await controller.remove('c1');
    expect(serviceMock.remove).toHaveBeenCalledWith('c1');
    expect(res).toEqual({ ok: true });
  });
});
