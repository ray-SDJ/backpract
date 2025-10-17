import { LessonData } from "../types";

const database: LessonData = {
  title: "TypeORM Database Integration",
  difficulty: "Intermediate",
  description:
    "Integrate TypeORM with TypeScript for type-safe database operations, entity definitions, and advanced ORM features for production applications.",
  objectives: [
    "Set up TypeORM with TypeScript decorators and configuration",
    "Create strongly-typed database entities with relationships",
    "Implement repositories and custom query methods",
    "Handle database migrations and schema versioning",
    "Build type-safe database services and error handling",
  ],
  content: `<div class="lesson-content">
    <h2>TypeORM with TypeScript Integration</h2>
    
    <p>TypeORM is a powerful Object-Relational Mapping (ORM) library that works exceptionally well with TypeScript. It provides decorators, type safety, and advanced features like migrations, repositories, and query builders.</p>

    <h3>Installation & Configuration</h3>
    
    <pre class="code-block">
      <code>
# Install TypeORM and database driver
npm install typeorm reflect-metadata pg
npm install -D @types/pg

# Install additional dependencies
npm install class-validator class-transformer bcryptjs
npm install -D @types/bcryptjs

# src/config/database.ts - TypeORM Configuration
import { DataSource } from 'typeorm';
import { User } from '../entities/User';
import { Post } from '../entities/Post';
import { Category } from '../entities/Category';

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432'),
  username: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || 'password',
  database: process.env.DB_NAME || 'typescript_app',
  synchronize: process.env.NODE_ENV === 'development',
  logging: process.env.NODE_ENV === 'development',
  entities: [User, Post, Category],
  migrations: ['src/migrations/*.ts'],
  subscribers: ['src/subscribers/*.ts'],
});

export const initializeDatabase = async (): Promise<void> => {
  try {
    await AppDataSource.initialize();
    console.log('✅ Database connection established');
  } catch (error) {
    console.error('❌ Database connection failed:', error);
    process.exit(1);
  }
};
      </code>
    </pre>

    <h3>Entity Definitions with Relationships</h3>
    
    <pre class="code-block">
      <code>
// src/entities/User.ts - User entity with validation
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  BeforeInsert,
  BeforeUpdate,
  Index,
} from 'typeorm';
import { IsEmail, IsNotEmpty, MinLength } from 'class-validator';
import bcrypt from 'bcryptjs';
import { Post } from './Post';

export enum UserRole {
  USER = 'user',
  ADMIN = 'admin',
  MODERATOR = 'moderator',
}

@Entity('users')
@Index(['email'], { unique: true })
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 100 })
  @IsNotEmpty({ message: 'Name is required' })
  name: string;

  @Column({ type: 'varchar', length: 255, unique: true })
  @IsEmail({}, { message: 'Invalid email format' })
  email: string;

  @Column({ type: 'varchar', length: 255 })
  @MinLength(6, { message: 'Password must be at least 6 characters' })
  password: string;

  @Column({
    type: 'enum',
    enum: UserRole,
    default: UserRole.USER,
  })
  role: UserRole;

  @Column({ type: 'boolean', default: false })
  isEmailVerified: boolean;

  @Column({ type: 'timestamp', nullable: true })
  lastLoginAt: Date;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @OneToMany(() => Post, (post) => post.author)
  posts: Post[];

  @BeforeInsert()
  @BeforeUpdate()
  async hashPassword(): Promise<void> {
    if (this.password) {
      this.password = await bcrypt.hash(this.password, 12);
    }
  }

  async comparePassword(plainPassword: string): Promise<boolean> {
    return bcrypt.compare(plainPassword, this.password);
  }

  toJSON() {
    const { password, ...userWithoutPassword } = this;
    return userWithoutPassword;
  }
}

// src/entities/Post.ts - Post entity with relationships
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  ManyToMany,
  JoinTable,
} from 'typeorm';
import { IsNotEmpty, MaxLength } from 'class-validator';
import { User } from './User';
import { Category } from './Category';

@Entity('posts')
export class Post {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 255 })
  @IsNotEmpty({ message: 'Title is required' })
  @MaxLength(255, { message: 'Title must not exceed 255 characters' })
  title: string;

  @Column({ type: 'text' })
  @IsNotEmpty({ message: 'Content is required' })
  content: string;

  @Column({ type: 'varchar', length: 500, nullable: true })
  excerpt: string;

  @Column({ type: 'boolean', default: false })
  published: boolean;

  @Column({ type: 'int', default: 0 })
  viewCount: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(() => User, (user) => user.posts, { onDelete: 'CASCADE' })
  author: User;

  @ManyToMany(() => Category, (category) => category.posts)
  @JoinTable({
    name: 'post_categories',
    joinColumn: { name: 'postId', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'categoryId', referencedColumnName: 'id' },
  })
  categories: Category[];
}

// src/entities/Category.ts - Category entity
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToMany,
} from 'typeorm';
import { Post } from './Post';

@Entity('categories')
export class Category {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 100, unique: true })
  name: string;

  @Column({ type: 'varchar', length: 500, nullable: true })
  description: string;

  @Column({ type: 'varchar', length: 50, unique: true })
  slug: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToMany(() => Post, (post) => post.categories)
  posts: Post[];
}
      </code>
    </pre>

    <h3>Repository Pattern & Services</h3>
    
    <pre class="code-block">
      <code>
// src/repositories/UserRepository.ts - Custom repository methods
import { Repository } from 'typeorm';
import { AppDataSource } from '../config/database';
import { User, UserRole } from '../entities/User';

export class UserRepository extends Repository<User> {
  constructor() {
    super(User, AppDataSource.createEntityManager());
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.findOne({
      where: { email },
      relations: ['posts'],
    });
  }

  async findActiveUsers(): Promise<User[]> {
    return this.createQueryBuilder('user')
      .where('user.isEmailVerified = :verified', { verified: true })
      .andWhere('user.lastLoginAt > :date', {
        date: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // 30 days ago
      })
      .orderBy('user.lastLoginAt', 'DESC')
      .getMany();
  }

  async updateLastLogin(userId: string): Promise<void> {
    await this.update(userId, { lastLoginAt: new Date() });
  }

  async getUserStats(userId: string): Promise<{
    user: User;
    postCount: number;
    totalViews: number;
  }> {
    const user = await this.findOne({
      where: { id: userId },
      relations: ['posts'],
    });

    if (!user) {
      throw new Error('User not found');
    }

    const postCount = user.posts.length;
    const totalViews = user.posts.reduce((sum, post) => sum + post.viewCount, 0);

    return { user, postCount, totalViews };
  }
}

// src/services/UserService.ts - Business logic layer
import { UserRepository } from '../repositories/UserRepository';
import { User, UserRole } from '../entities/User';
import { validate } from 'class-validator';

export interface CreateUserDTO {
  name: string;
  email: string;
  password: string;
  role?: UserRole;
}

export interface UpdateUserDTO {
  name?: string;
  email?: string;
  role?: UserRole;
  isEmailVerified?: boolean;
}

export class UserService {
  private userRepository: UserRepository;

  constructor() {
    this.userRepository = new UserRepository();
  }

  async createUser(userData: CreateUserDTO): Promise<User> {
    const user = new User();
    Object.assign(user, userData);

    // Validate entity
    const errors = await validate(user);
    if (errors.length > 0) {
      throw new Error(\`Validation failed: \${errors.map(e => Object.values(e.constraints || {})).flat().join(', ')}\`);
    }

    // Check if user already exists
    const existingUser = await this.userRepository.findByEmail(userData.email);
    if (existingUser) {
      throw new Error('User with this email already exists');
    }

    return this.userRepository.save(user);
  }

  async getUserById(id: string): Promise<User> {
    const user = await this.userRepository.findOne({
      where: { id },
      relations: ['posts', 'posts.categories'],
    });

    if (!user) {
      throw new Error('User not found');
    }

    return user;
  }

  async updateUser(id: string, updateData: UpdateUserDTO): Promise<User> {
    const user = await this.getUserById(id);
    Object.assign(user, updateData);

    const errors = await validate(user);
    if (errors.length > 0) {
      throw new Error(\`Validation failed: \${errors.map(e => Object.values(e.constraints || {})).flat().join(', ')}\`);
    }

    return this.userRepository.save(user);
  }

  async deleteUser(id: string): Promise<void> {
    const result = await this.userRepository.delete(id);
    if (result.affected === 0) {
      throw new Error('User not found');
    }
  }

  async authenticateUser(email: string, password: string): Promise<User> {
    const user = await this.userRepository.findByEmail(email);
    if (!user) {
      throw new Error('Invalid email or password');
    }

    const isValidPassword = await user.comparePassword(password);
    if (!isValidPassword) {
      throw new Error('Invalid email or password');
    }

    await this.userRepository.updateLastLogin(user.id);
    return user;
  }
}
      </code>
    </pre>

    <h3>Database Migrations</h3>
    
    <pre class="code-block">
      <code>
// Generate migration
npx typeorm migration:generate src/migrations/CreateUserTable -d src/config/database.ts

// src/migrations/1234567890123-CreateUserTable.ts
import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateUserTable1234567890123 implements MigrationInterface {
  name = 'CreateUserTable1234567890123';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(\`
      CREATE TYPE "public"."users_role_enum" AS ENUM('user', 'admin', 'moderator')
    \`);
    
    await queryRunner.query(\`
      CREATE TABLE "users" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "name" character varying(100) NOT NULL,
        "email" character varying(255) NOT NULL,
        "password" character varying(255) NOT NULL,
        "role" "public"."users_role_enum" NOT NULL DEFAULT 'user',
        "isEmailVerified" boolean NOT NULL DEFAULT false,
        "lastLoginAt" TIMESTAMP,
        "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
        "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "UQ_email" UNIQUE ("email"),
        CONSTRAINT "PK_users" PRIMARY KEY ("id")
      )
    \`);

    await queryRunner.query(\`
      CREATE UNIQUE INDEX "IDX_users_email" ON "users" ("email")
    \`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(\`DROP INDEX "public"."IDX_users_email"\`);
    await queryRunner.query(\`DROP TABLE "users"\`);
    await queryRunner.query(\`DROP TYPE "public"."users_role_enum"\`);
  }
}

// Run migrations
npx typeorm migration:run -d src/config/database.ts
      </code>
    </pre>

    <p><strong>TypeORM Benefits:</strong> Full TypeScript support with decorators, automatic migrations, advanced query capabilities, repository pattern, relationship management, and production-ready features like connection pooling and caching.</p>
  </div>`,
  practiceInstructions: [
    "Install TypeORM and PostgreSQL driver with TypeScript types",
    "Create User, Post, and Category entities with proper relationships",
    "Implement custom repository methods with type safety",
    "Build a UserService class with validation and business logic",
    "Generate and run database migrations",
    "Test entity operations and relationships",
  ],
  hints: [
    "Use 'experimentalDecorators' and 'emitDecoratorMetadata' in tsconfig.json",
    "Import 'reflect-metadata' before TypeORM initialization",
    "Use class-validator for entity validation",
    "Implement toJSON() method to exclude sensitive data",
    "Use query builders for complex database operations",
  ],
  solution: `# Install dependencies
npm install typeorm reflect-metadata pg class-validator class-transformer bcryptjs
npm install -D @types/pg @types/bcryptjs

# Generate migration
npx typeorm migration:generate src/migrations/InitialSchema -d src/config/database.ts

# Run migrations
npx typeorm migration:run -d src/config/database.ts`,
};

export default database;
