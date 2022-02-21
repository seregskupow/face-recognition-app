import {
  Injectable,
  ArgumentMetadata,
  BadRequestException,
  ValidationPipe,
  UnprocessableEntityException,
} from '@nestjs/common';

@Injectable()
export class ValidateInputPipe extends ValidationPipe {
  public async transform(value, metadata: ArgumentMetadata) {
    try {
      return await super.transform(value, metadata);
    } catch (e) {
      if (e instanceof BadRequestException) {
        console.log(e.getResponse());
        throw new UnprocessableEntityException(
          this.handleError(JSON.parse(JSON.stringify(e.getResponse())).message),
        );
      }
    }
  }

  private handleError(errors) {
    return errors.map((error) => error.constraints);
  }
}
