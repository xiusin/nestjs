import { ArgumentMetadata, BadRequestException, Injectable, PipeTransform } from "@nestjs/common";

/**
 * 定义枚举验证
 */
@Injectable()
export class EnumPipe implements PipeTransform {
    private static readonly enums: string[] = ['xiusin','yunjie','yifeng'];
    transform(value: any, metadata: ArgumentMetadata) {
        if (!EnumPipe.enums.includes(value)) {
            throw new BadRequestException(`${value} is not in enum`);
        }
        return value;
    }

}