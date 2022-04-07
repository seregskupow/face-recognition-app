import {
  IsBoolean,
  IsEmail,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';
import { Exclude, Transform } from 'class-transformer';
export class UserDto {
  @IsOptional()
  readonly _id?: string;

  @IsNotEmpty()
  @IsString({ message: 'Name should be STRING type' })
  @MinLength(3)
  @MaxLength(25)
  readonly name?: string;

  @IsNotEmpty()
  @IsString({ message: 'Email should be STRING type' })
  @IsEmail()
  readonly email?: string;

  @Exclude({ toPlainOnly: true })
  @IsOptional()
  @IsString({ message: 'Password should be STRING type' })
  readonly password?: string;

  @IsOptional()
  @IsString({ message: 'Avatar should be STRING type' })
  readonly avatar?: string;

  @Exclude()
  @IsOptional()
  @IsString({ message: 'GoogleId should be STRING type' })
  readonly googleId?: string;

  @Exclude()
  @IsNotEmpty()
  @IsOptional()
  @IsBoolean()
  readonly activated?: boolean;
}
