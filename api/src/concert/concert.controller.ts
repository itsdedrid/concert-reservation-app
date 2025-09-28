import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { ConcertService } from './concert.service';
import { CreateConcertDto } from './dto/create-concert.dto';

@Controller('concerts')
export class ConcertController {
  constructor(private readonly service: ConcertService) {}

  @Post()
  create(@Body() dto: CreateConcertDto) {
    return this.service.create(dto);
  }

  @Get()
  findAll() {
    return this.service.findAll();
  }

  @Put(':id')
  update(
    @Param('id') id: string,
    @Body() body: Partial<{ name: string; totalSeats: number; description?: string }>
  ) {
    return this.service.update(id, body);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.service.remove(id);
  }
}
