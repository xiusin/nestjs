import { EntityManager, MikroORM } from '@mikro-orm/core';
import { Injectable } from '@nestjs/common';
import { Cat } from 'src/interfaces/cats.interface';

@Injectable()
export class CatsService {
    constructor(
        private readonly orm: MikroORM,
        private readonly manager: EntityManager
    ){}

    create(cat: Cat) {
    }

    findAll(): Cat[] {
        return [];
    }
}
