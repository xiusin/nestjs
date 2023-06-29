import { IsNotEmpty, IsString } from 'class-validator';

export class CreateCatDto {
    @IsNotEmpty()
    @IsString()
    readonly name: string;
    readonly age: number;
    readonly breed: number;
}