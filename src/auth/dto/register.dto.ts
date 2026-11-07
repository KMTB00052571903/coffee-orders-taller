import {
  IsEmail,
  IsNotEmpty,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';

export class RegisterDto {
  @IsEmail()
  @MaxLength(150)
  @IsNotEmpty()
  @IsString()
  email!: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(8)
  @MaxLength(30)
  @Matches(/^[a-zA-Z0-9\s-_]+$/, {
    message: 'El campo solo puede contener letras, números, espacios y guiones',
  }) //Para exigir estos caracteres
  password!: string;
}
