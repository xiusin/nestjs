import { Entity, PrimaryKey, Property } from "@mikro-orm/core";

@Entity()
export class User {
    @PrimaryKey()
    id!: number;

    @Property()
    name!: string;

    @Property()
    age!: number;

    @Property({ onUpdate: () => new Date() })
    update_at = new Date();
    
}
