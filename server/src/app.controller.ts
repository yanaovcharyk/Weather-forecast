import { Controller, Get } from '@nestjs/common';

@Controller('health')
export class AppHealthController {
  @Get()
  check() {
    return { status: 'ok' };
  }
}

