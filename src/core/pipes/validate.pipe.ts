import {
  Injectable,
  ArgumentMetadata,
  BadRequestException,
  ValidationPipe,
  UnprocessableEntityException,
} from '@nestjs/common';
import { ValidationError } from 'class-validator';

@Injectable()
export class ValidateInputPipe extends ValidationPipe {
  public async transform(value, metadata: ArgumentMetadata) {
    try {
      return await super.transform(value, metadata);
    } catch (e) {
      if (e instanceof BadRequestException) {
        throw new UnprocessableEntityException(
          this.handleError(JSON.parse(JSON.stringify(e.getResponse())).message),
        );
      }
    }
  }

  private handleError(errors) {
    console.log(errors);
    return errors.map((target: ValidationError) => ({
      [target.property]: {
        errors: Object.values(target.constraints),
      },
    }));
  }
}
