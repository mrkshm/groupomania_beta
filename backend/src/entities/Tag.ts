import {
  Entity as TOEntity,
  Column,
  Index,
  BeforeUpdate,
  BeforeInsert,
  ManyToOne,
  JoinColumn,
  OneToMany
} from "typeorm";
import { slugify } from "../util/helpers";
import Entity from "./Entity";
import User from "./User";
import Post from "./Post";

@TOEntity("tags")
export default class Tag extends Entity {
  constructor(tag: Partial<Tag>) {
    super();
    Object.assign(this, tag);
  }

  @Index()
  @Column({ unique: true })
  name: string;

  @Index()
  @Column({ unique: true })
  slug: string;

  @OneToMany(() => Post, post => post.tag)
  posts: Post[];

  @Column({ type: "text", nullable: true })
  description: string;

  @ManyToOne(() => User, {
    onUpdate: "CASCADE",
    onDelete: "CASCADE"
  })
  @JoinColumn({ name: "username", referencedColumnName: "username" })
  user: User;

  tagCount: number;
  setTagCount(num: number) {
    this.tagCount = num;
  }

  @BeforeInsert()
  @BeforeUpdate()
  makeNewSlug() {
    this.slug = slugify(this.name);
  }
}
