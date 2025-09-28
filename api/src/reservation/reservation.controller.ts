import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { ReservationService } from './reservation.service';
import { CreateReservationDto } from './dto/create-reservation.dto';

@Controller('reservations')
export class ReservationController {
  constructor(private readonly service: ReservationService) {}

  @Post()
  reserve(@Body() dto: CreateReservationDto) {
    return this.service.reserve(dto.userId, dto.concertId);
  }

  @Delete(':id')
  cancel(@Param('id') id: string, @Body() body: { userId: string }) {
    return this.service.cancel(body.userId, id);
  }

  @Get('me/:userId')
  history(@Param('userId') userId: string) {
    return this.service.history(userId);
  }

  @Get('admin/all')
  adminHistory() {
    return this.service.adminHistory();
  }

  @Get('admin/summary')
  async summary() {
    return this.service.summary();
  }
}
