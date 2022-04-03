import {
  ArrayMinSize,
  IsArray,
  IsBoolean,
  IsNotEmpty,
  IsNumber,
  IsString,
} from 'class-validator';

export class ParseActorsDto {
  @IsArray()
  @IsString({ each: true })
  @ArrayMinSize(1)
  actorNames: string[];
}
