export const prismaMock = {
    concert: {
      create: jest.fn(),
      findMany: jest.fn(),
      findUnique: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
    reservation: {
      create: jest.fn(),
      findFirst: jest.fn(),
      findUnique: jest.fn(),
      count: jest.fn(),
      deleteMany: jest.fn(),
      update: jest.fn(),
    },
    $transaction: jest.fn(async (cb: any) => cb(prismaMock)),
  };
  