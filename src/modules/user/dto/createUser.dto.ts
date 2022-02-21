import {
  IsNotEmpty,
  IsString,
  IsEmail,
  IsBoolean,
  MinLength,
  MaxLength,
  IsOptional,
} from 'class-validator';

export class CreateUserDto {
  @IsNotEmpty()
  @IsString({ message: 'Name should be STRING type' })
  @MinLength(3)
  @MaxLength(25)
  name: string;

  @IsNotEmpty()
  @IsString({ message: 'Email should be STRING type' })
  @IsEmail()
  email: string;

  @IsOptional()
  @IsString({ message: 'Password should be STRING type' })
  password?: string;

  @IsOptional()
  @IsString({ message: 'Avatar should be STRING type' })
  avatar?: string;

  @IsOptional()
  @IsString({ message: 'GoogleId should be STRING type' })
  googleId?: string;

  @IsNotEmpty()
  @IsOptional()
  @IsBoolean()
  readonly activated?: boolean;
}
