import { IsInt, IsOptional, IsString, MaxLength, Min } from 'class-validator';

export class CreateConcertDto {
  @IsString()
  @MaxLength(120)
  name!: string;

  @IsOptional()
  @IsString()
  @MaxLength(2000)
  description?: string;

  @IsInt()
  @Min(0)
  totalSeats!: number;
}
