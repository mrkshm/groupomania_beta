import { IsEmail, Length } from "class-validator";
import bcrypt from "bcrypt";
import { Exclude } from "class-transformer";
import {
  Entity as TOEntity,
  Column,
  Index,
  BeforeInsert,
  OneToMany
} from "typeorm";

import Entity from "./Entity";
import Post from "./Post";
import Comment from "./Comment";
import Vote from "./Vote";

@TOEntity("users")
export default class User extends Entity {
  constructor(user: Partial<User>) {
    super();
    Object.assign(this, user);
  }

  @Index()
  @IsEmail(undefined, { message: "Adresse email valide requise" })
  @Length(1, 200, { message: "Pas d'adresse email renseignée" })
  @Column({ unique: true })
  email: string;

  @Index()
  @Length(3, 35, {
    message: "Le nom d'utilisateur doit contenir au minimum 3 caractères"
  })
  @Column({ unique: true })
  username: string;

  @Exclude()
  @Length(6, 27, {
    message: "Le mot de passe doit contenir au minimum 6 caractères"
  })
  @Column()
  password: string;

  @Column({ nullable: true })
  imageUrn: string;

  @Column({ nullable: true })
  body: string;

  @Column({ default: true })
  isActive: boolean;

  @Column({ default: false })
  isAdmin: boolean;

  @OneToMany(() => Post, post => post.user)
  posts: Post[];

  @OneToMany(() => Comment, comment => comment.user)
  comments: Comment[];

  @OneToMany(() => Vote, vote => vote.user)
  votes: Vote[];

  @BeforeInsert()
  async hashPassword() {
    this.password = await bcrypt.hash(this.password, 7);
  }
}
