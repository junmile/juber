import {
  BaseEntity,
  Column,
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne
} from 'typeorm';

import Chat from './Chat';

@Entity()
class Mesaage extends BaseEntity {
  @PrimaryGeneratedColumn() id: number;

  @ManyToOne(
    (type) => Chat,
    (chat) => chat.messages
  )
  chat: Chat;

  @CreateDateColumn() createdAt: string;

  @UpdateDateColumn() updatedAt: string;
}

export default Mesaage;
