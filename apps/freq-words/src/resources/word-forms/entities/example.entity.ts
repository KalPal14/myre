import { Entity, PrimaryGeneratedColumn, ManyToOne, Column } from 'typeorm';

import { Definition } from './definition.entity';

@Entity()
export class Example {
	@PrimaryGeneratedColumn()
	id: number;

	@Column()
	phrase: string;

	@ManyToOne(() => Definition, (definition) => definition.examples)
	definition: Definition;
}
