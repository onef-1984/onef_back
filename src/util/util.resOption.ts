import { Injectable } from '@nestjs/common';

@Injectable()
export class UtilFunction {
  constructor() {}

  reportResOption() {
    return {
      include: {
        book: {
          include: { subInfo: { omit: { id: true } } },
          omit: { createdAt: true, updatedAt: true, subInfoId: true },
        },
        user: {
          omit: { password: true, createdAt: true, updatedAt: true },
        },
      },
      omit: { isbn13: true, userId: true },
    };
  }
}
