import { IsString, IsNotEmpty, IsEmail, IsArray, ValidateNested, IsOptional, Min, Max, IsNumber } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class CreatePlayerDto {
    @ApiProperty({ example: 'Иванов Иван Иванович', description: 'ФИО игрока' })
    @IsString()
    @IsNotEmpty({ message: 'ФИО игрока обязательно' })
    fullName: string;

    @ApiProperty({ example: '1995-05-15', description: 'Дата рождения' })
    @IsString()
    @IsNotEmpty({ message: 'Дата рождения обязательна' })
    birthDate: string;

    @ApiProperty({ example: 185, description: 'Рост в см' })
    @IsNumber()
    @IsNotEmpty({ message: 'Рост обязателен' })
    @Min(100, { message: 'Рост должен быть не менее 100 см' })
    @Max(250, { message: 'Рост не должен превышать 250 см' })
    heightCm: number;

    @ApiProperty({ example: 'attacker', enum: ['attacker', 'setter', 'libero', 'blocker'] })
    @IsString()
    @IsNotEmpty({ message: 'Позиция обязательна' })
    position: string;

    @ApiProperty({ example: 'light', enum: ['light', 'light_plus', 'light_plus_plus', 'medium', 'medium_plus', 'hard', 'hard_plus'] })
    @IsString()
    @IsNotEmpty({ message: 'Уровень мастерства обязателен' })
    skillLevel: string;
}

export class CreateApplicationDto {
    @ApiProperty({ example: 'Спартак', description: 'Название команды' })
    @IsString()
    @IsNotEmpty({ message: 'Название команды обязательно' })
    teamName: string;

    @ApiProperty({ example: 'light', enum: ['hard', 'light'] })
    @IsString()
    @IsNotEmpty({ message: 'Лига обязательна' })
    division: string;

    @ApiProperty({ example: 'Иванов Иван Иванович', description: 'ФИО капитана' })
    @IsString()
    @IsNotEmpty({ message: 'ФИО капитана обязательно' })
    captainName: string;

    @ApiProperty({ example: '+7 (999) 123-45-67', description: 'Телефон капитана' })
    @IsString()
    @IsNotEmpty({ message: 'Телефон обязателен' })
    captainPhone: string;

    @ApiProperty({ example: 'captain@spartak.ru', description: 'Email капитана' })
    @IsEmail({}, { message: 'Некорректный email' })
    @IsNotEmpty({ message: 'Email обязателен' })
    captainEmail: string;

    @ApiProperty({ type: [CreatePlayerDto], description: 'Список игроков (максимум 14)' })
    @IsArray({ message: 'Список игроков должен быть массивом' })
    @ValidateNested({ each: true })
    @Type(() => CreatePlayerDto)
    players: CreatePlayerDto[];

    @ApiProperty({ required: false, description: 'URL эмблемы' })
    @IsOptional()
    @IsString()
    emblemUrl?: string;
}