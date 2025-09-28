import { Module } from '@nestjs/common';
import { PrismaModule } from './prisma.module';
import { ConcertModule } from './concert/concert.module';
import { ReservationModule } from './reservation/reservation.module';

@Module({
  imports: [PrismaModule, ConcertModule, ReservationModule],
})
export class AppModule {}
