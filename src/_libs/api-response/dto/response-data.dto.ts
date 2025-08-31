import { ApiProperty } from '@nestjs/swagger';

export class ResponseDataDto<T> {
  @ApiProperty({ type: () => Object })
  object!: T;
}
