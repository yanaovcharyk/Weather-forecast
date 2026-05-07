import { Injectable } from '@nestjs/common';

@Injectable()
export class Base64CursorEncoder {
  encode(payload: unknown): string {
    return Buffer.from(
      JSON.stringify(payload),
    ).toString('base64');
  }

  decode<T>(cursor: string): T {
    return JSON.parse(
      Buffer.from(cursor, 'base64').toString(),
    );
  }
}
