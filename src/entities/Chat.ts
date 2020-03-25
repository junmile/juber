import {
  BaseEntity,
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  Column
} from 'typeorm';

import Message from './Message';
import User from './User';

@Entity()
class Chat extends BaseEntity {
  @PrimaryGeneratedColumn() id: number;

  @OneToMany(
    (type) => Message,
    (message) => message.chat
  )
  messages: Message[];

  @Column({ nullable: true })
  passengerId: number;

  @OneToMany(
    (type) => User,
    (user) => user.chatsAsPassenger
  )
  passenger: User;

  @Column({ nullable: true })
  driverid: number;

  @OneToMany(
    (type) => User,
    (user) => user.chatsAsDriver
  )
  driver: User;

  @CreateDateColumn()
  createdAt: string;

  @UpdateDateColumn() updatedAt: string;
}

export default Chat;
