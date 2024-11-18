import { Injectable } from '@nestjs/common';
import { UtilFnOmit, UtilFnPick } from './util.schema';

@Injectable()
export class UtilService {
  omit: UtilFnOmit = (obj, keys) => {
    for (const key of keys) {
      delete obj[key];
    }

    return obj;
  };

  pick: UtilFnPick = (obj, keys) => {
    for (const key in obj) {
      if (!keys.includes(key as never)) {
        delete obj[key];
      }
    }

    return obj;
  };
}
