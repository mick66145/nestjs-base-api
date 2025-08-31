import { ApiProperty } from '@nestjs/swagger';
import { ResponseDataDto } from './response-data.dto';

export class ResponseDto<T = any> {
  @ApiProperty()
  code!: number;

  @ApiProperty()
  message!: string;

  @ApiProperty({ type: () => Object })
  data!: ResponseDataDto<T>;
}
