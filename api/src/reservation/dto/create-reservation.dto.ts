import { IsString } from 'class-validator';

export class CreateReservationDto {
  @IsString()
  userId!: string;

  @IsString()
  concertId!: string;
}
