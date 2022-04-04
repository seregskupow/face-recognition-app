import {
  IsNotEmpty,
  IsString,
  IsEmail,
  MinLength,
  MaxLength,
  IsOptional,
  Length,
} from 'class-validator';

export class UpdateUserDto {
  @IsOptional()
  @IsString({ message: 'Name should be STRING type' })
  @MinLength(3)
  @MaxLength(25)
  name?: string;

  @IsOptional()
  @IsString({ message: 'Email should be STRING type' })
  @IsEmail()
  email?: string;

  @IsOptional()
  @IsString({ message: 'Password should be STRING type' })
  password?: string;

  @IsOptional()
  @IsString({ message: 'Avatar should be STRING type' })
  avatar?: string;
}
