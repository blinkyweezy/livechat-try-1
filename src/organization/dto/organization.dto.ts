import {
  IsString,
  MinLength,
  IsNotEmpty,
  MaxLength,
  Matches,
} from 'class-validator';

/**
 * This dto is a combination of user and organization
 */
export class OrganizationDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(2)
  name: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  website: string;

  @IsString()
  @IsNotEmpty()
  phone: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  @Matches(/^[a-zA-Z0-9_%+-/'*=]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, {
    message: 'invalid email provided',
  })
  email: string;

  @IsString()
  @MinLength(8)
  @MaxLength(20)
  @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
    message: 'password too weak',
  })
  password: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  username: string;
}
