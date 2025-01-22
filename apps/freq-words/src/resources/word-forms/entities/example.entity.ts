import { Entity, PrimaryGeneratedColumn, ManyToOne, Column } from 'typeorm';

import { Definition } from './definition.entity';

@Entity()
export class Example {
	@PrimaryGeneratedColumn()
	id: number;

	@Column()
	phrase: string;

	// TODO попробовать заменить definition.id
	@ManyToOne(() => Definition, (definition) => definition.id)
	definition: Definition;
}
