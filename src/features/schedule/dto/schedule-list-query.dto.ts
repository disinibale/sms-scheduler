import { ApiProperty } from '@nestjs/swagger';
import { EStatus } from 'src/utils/enums';

export class ScheduleListQuery {
  @ApiProperty({
    type: EStatus,
    description: 'Filter message by status',
    required: false,
  })
  status?: EStatus;
  @ApiProperty({
    type: 'ISO 8601 String Date',
    description: 'Filter message by start date',
    required: false,
  })
  startDate?: string;
  @ApiProperty({
    type: 'ISO 8601 String Date',
    description: 'Filter message by end date',
    required: false,
  })
  endDate?: string;
  @ApiProperty({
    type: 'number',
    description: 'Filter message by page',
    required: false,
  })
  page?: number;
  @ApiProperty({
    type: 'number',
    description: 'Filter message by page size',
    required: false,
  })
  pageSize?: number;
}
