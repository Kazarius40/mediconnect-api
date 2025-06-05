import { ApiProperty } from '@nestjs/swagger';

export class MessageResponse {
  @ApiProperty({
    example: 'Operation completed successfully.',
    description: 'Operation result message',
  })
  message: string;
}
