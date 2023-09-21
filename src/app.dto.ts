import { IsString, IsArray, IsDateString, ArrayMinSize } from 'class-validator';

export default class CreateMessageSchedulingDto {
  @IsDateString()
  runAt: Date;

  @IsString()
  message: string;

  @IsArray()
  @ArrayMinSize(1)
  dnis: string;
}
