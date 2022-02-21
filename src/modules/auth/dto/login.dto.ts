import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

export class LoginDto {
  @IsNotEmpty()
  @IsString({ message: 'Email should be STRING type' })
  @IsEmail()
  readonly email: string;

  @IsNotEmpty()
  @IsString({ message: 'Password should be STRING type' })
  @MinLength(7)
  @MaxLength(25)
  readonly password: string;
}
