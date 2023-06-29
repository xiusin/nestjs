import { Controller, Get } from '@nestjs/common';
import { CatsService } from 'src/cats/cats.service';

@Controller('animals')
export class AnimalsController {

    constructor(private catService: CatsService){}


    @Get('cats')
    findAllCats() {
        return this.catService.findAll();
    }
}
