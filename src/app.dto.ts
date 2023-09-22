import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsArray,
  IsDateString,
  ArrayMinSize,
  IsNotEmpty,
} from 'class-validator';

export default class CreateMessageSchedulingDto {
  @ApiProperty({
    description: 'The scheduled time for this message to be send in the future',
    example: '2023-09-20 20:00:00',
    type: 'ISO 8601 Date String',
  })
  @IsNotEmpty()
  @IsDateString()
  runAt: Date;

  @ApiProperty({
    description: 'SMS message want to be send to the recipients',
    example: 'Hello, World!',
    type: 'string',
  })
  @IsNotEmpty()
  @IsString()
  message: string;

  @ApiProperty({
    description: 'Set of recipients that holds in an array of string',
    example: ['+6289514948983', '+6281320190951', '+65821391023'],
    type: 'Array<string>',
  })
  @IsArray()
  @ArrayMinSize(1)
  dnis: string;
}
