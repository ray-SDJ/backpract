import React from "react";
import { Database } from "lucide-react";

interface CodeExplanationProps {
  code: string;
  explanation: Array<{ label: string; desc: string }>;
}

const CodeExplanation: React.FC<CodeExplanationProps> = ({
  code,
  explanation,
}) => (
  <div className="mt-4 space-y-3">
    <div className="bg-gray-900 rounded-lg p-4 overflow-x-auto">
      <pre className="text-green-400 text-sm font-mono whitespace-pre-wrap">
        <code>{code}</code>
      </pre>
    </div>
    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
      <h4 className="font-semibold text-blue-900 mb-3">Code Explanation:</h4>
      <div className="space-y-2">
        {explanation.map((item, index) => (
          <div key={index} className="flex gap-3">
            <code className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-sm font-mono whitespace-nowrap">
              {item.label}
            </code>
            <span className="text-blue-700 text-sm">{item.desc}</span>
          </div>
        ))}
      </div>
    </div>
  </div>
);

export const DatabaseSection = {
  id: "database",
  title: "TypeORM & Database Integration",
  icon: Database,
  overview:
    "Integrate PostgreSQL database using TypeORM with TypeScript decorators and type safety",
  content: (
    <div className="space-y-6">
      <div>
        <h3 className="font-bold text-lg mb-2">Setting Up TypeORM</h3>
        <p className="text-gray-700 mb-3">
          TypeORM is a TypeScript ORM that works perfectly with
          TypeScript&apos;s decorator syntax and provides excellent type safety
          for database operations.
        </p>
        <CodeExplanation
          code={`# Install TypeORM and database driver
npm install typeorm pg reflect-metadata
npm install -D @types/pg

# Install PostgreSQL (using Docker)
docker run --name postgres-dev -e POSTGRES_PASSWORD=password \\
  -e POSTGRES_DB=myapp -p 5432:5432 -d postgres:14

# Create TypeORM configuration
# src/config/database.ts
import { DataSource } from 'typeorm';
import { User } from '../entities/User';
import { Post } from '../entities/Post';

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432'),
  username: process.env.DB_USERNAME || 'postgres',
  password: process.env.DB_PASSWORD || 'password',
  database: process.env.DB_NAME || 'myapp',
  synchronize: process.env.NODE_ENV === 'development', // Only in dev
  logging: process.env.NODE_ENV === 'development',
  entities: [User, Post],
  migrations: ['src/migrations/*.ts'],
  subscribers: ['src/subscribers/*.ts'],
});

// Initialize database connection
export const initializeDatabase = async (): Promise<void> => {
  try {
    await AppDataSource.initialize();
    console.log('📊 Database connected successfully');
  } catch (error) {
    console.error('❌ Database connection failed:', error);
    process.exit(1);
  }
};`}
          explanation={[
            {
              label: "DataSource",
              desc: "TypeORM's main configuration object for database connection",
            },
            {
              label: "synchronize: true",
              desc: "Automatically creates database schema (only use in development)",
            },
            {
              label: "entities: [User, Post]",
              desc: "Array of entity classes that map to database tables",
            },
            {
              label: "reflect-metadata",
              desc: "Required for TypeScript decorators to work properly",
            },
            {
              label: "logging: true",
              desc: "Shows SQL queries in console for debugging",
            },
          ]}
        />
      </div>

      <div>
        <h3 className="font-bold text-lg mb-2">
          Entity Models with TypeScript
        </h3>
        <CodeExplanation
          code={`// src/entities/User.ts
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  Index,
} from 'typeorm';
import { Post } from './Post';

@Entity('users')
@Index(['email'], { unique: true })
export class User {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ length: 100 })
  name!: string;

  @Column({ unique: true, length: 255 })
  email!: string;

  @Column({ select: false }) // Exclude from default queries
  password!: string;

  @Column({ default: true })
  isActive!: boolean;

  @Column({ type: 'enum', enum: ['user', 'admin'], default: 'user' })
  role!: 'user' | 'admin';

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;

  // Relations
  @OneToMany(() => Post, (post) => post.user)
  posts!: Post[];

  // Virtual properties (not stored in DB)
  get fullInfo(): string {
    return \`\${this.name} (\${this.email})\`;
  }

  // Instance methods
  toJSON(): Partial<User> {
    const { password, ...userWithoutPassword } = this;
    return userWithoutPassword;
  }
}

// src/entities/Post.ts
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  Index,
} from 'typeorm';
import { User } from './User';

@Entity('posts')
export class Post {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ length: 255 })
  title!: string;

  @Column({ type: 'text' })
  content!: string;

  @Column({ default: false })
  published!: boolean;

  @Column({ type: 'timestamp', nullable: true })
  publishedAt!: Date | null;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;

  // Foreign key relation
  @Column()
  userId!: number;

  @ManyToOne(() => User, (user) => user.posts, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  user!: User;

  // Computed properties
  get isPublished(): boolean {
    return this.published && this.publishedAt !== null;
  }

  get excerpt(): string {
    return this.content.substring(0, 150) + '...';
  }
}`}
          explanation={[
            {
              label: "@Entity('users')",
              desc: "Decorator that marks class as database entity with table name",
            },
            {
              label: "@PrimaryGeneratedColumn()",
              desc: "Auto-incrementing primary key column",
            },
            {
              label: "@Column({ unique: true })",
              desc: "Column decorator with constraints and options",
            },
            {
              label: "@OneToMany / @ManyToOne",
              desc: "TypeORM decorators defining table relationships",
            },
            {
              label: "!: type",
              desc: "TypeScript definite assignment assertion for class properties",
            },
          ]}
        />
      </div>

      <div>
        <h3 className="font-bold text-lg mb-2">
          Repository Pattern & Database Operations
        </h3>
        <CodeExplanation
          code={`// src/repositories/UserRepository.ts
import { Repository } from 'typeorm';
import { AppDataSource } from '../config/database';
import { User } from '../entities/User';

export class UserRepository {
  private repository: Repository<User>;

  constructor() {
    this.repository = AppDataSource.getRepository(User);
  }

  // Create user
  async create(userData: Partial<User>): Promise<User> {
    const user = this.repository.create(userData);
    return await this.repository.save(user);
  }

  // Find user by email
  async findByEmail(email: string): Promise<User | null> {
    return await this.repository.findOne({
      where: { email },
      select: ['id', 'name', 'email', 'password', 'role'] // Include password
    });
  }

  // Find user with posts
  async findWithPosts(id: number): Promise<User | null> {
    return await this.repository.findOne({
      where: { id },
      relations: ['posts'],
      order: {
        posts: { createdAt: 'DESC' }
      }
    });
  }

  // Get all active users
  async findActiveUsers(): Promise<User[]> {
    return await this.repository.find({
      where: { isActive: true },
      order: { createdAt: 'DESC' }
    });
  }

  // Advanced query with QueryBuilder
  async searchUsers(searchTerm: string): Promise<User[]> {
    return await this.repository
      .createQueryBuilder('user')
      .where('user.name ILIKE :search OR user.email ILIKE :search', {
        search: \`%\${searchTerm}%\`
      })
      .andWhere('user.isActive = :isActive', { isActive: true })
      .orderBy('user.createdAt', 'DESC')
      .getMany();
  }

  // Update user
  async update(id: number, updateData: Partial<User>): Promise<User | null> {
    await this.repository.update(id, updateData);
    return await this.repository.findOne({ where: { id } });
  }

  // Soft delete (deactivate)
  async deactivate(id: number): Promise<void> {
    await this.repository.update(id, { isActive: false });
  }

  // Hard delete
  async delete(id: number): Promise<void> {
    await this.repository.delete(id);
  }
}

// src/services/UserService.ts
import bcrypt from 'bcrypt';
import { UserRepository } from '../repositories/UserRepository';
import { User } from '../entities/User';

export class UserService {
  private userRepository: UserRepository;

  constructor() {
    this.userRepository = new UserRepository();
  }

  async createUser(userData: {
    name: string;
    email: string;
    password: string;
  }): Promise<User> {
    // Hash password
    const hashedPassword = await bcrypt.hash(userData.password, 12);

    // Create user
    const newUser = await this.userRepository.create({
      ...userData,
      password: hashedPassword,
    });

    return newUser;
  }

  async authenticateUser(email: string, password: string): Promise<User | null> {
    const user = await this.userRepository.findByEmail(email);
    
    if (!user) return null;

    const isPasswordValid = await bcrypt.compare(password, user.password);
    return isPasswordValid ? user : null;
  }

  async getUserProfile(id: number): Promise<User | null> {
    return await this.userRepository.findWithPosts(id);
  }

  async searchUsers(searchTerm: string): Promise<User[]> {
    return await this.userRepository.searchUsers(searchTerm);
  }
}`}
          explanation={[
            {
              label: "Repository<User>",
              desc: "TypeORM repository with type safety for User entity",
            },
            {
              label: "findOne({ where: { email } })",
              desc: "Type-safe query with where conditions",
            },
            {
              label: "relations: ['posts']",
              desc: "Eager loading related entities to avoid N+1 queries",
            },
            {
              label: "createQueryBuilder",
              desc: "Advanced query builder for complex SQL operations",
            },
            {
              label: "ILIKE :search",
              desc: "Case-insensitive search with parameterized queries",
            },
          ]}
        />
      </div>

      <div>
        <h3 className="font-bold text-lg mb-2">
          Database Migrations & Schema Management
        </h3>
        <CodeExplanation
          code={`// Generate migration
npx typeorm migration:generate -n CreateUserAndPostTables

// src/migrations/1234567890123-CreateUserAndPostTables.ts
import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateUserAndPostTables1234567890123 implements MigrationInterface {
  name = 'CreateUserAndPostTables1234567890123';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // Create users table
    await queryRunner.query(\`
      CREATE TABLE "users" (
        "id" SERIAL NOT NULL,
        "name" character varying(100) NOT NULL,
        "email" character varying(255) NOT NULL,
        "password" character varying NOT NULL,
        "isActive" boolean NOT NULL DEFAULT true,
        "role" "public"."users_role_enum" NOT NULL DEFAULT 'user',
        "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
        "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "UQ_users_email" UNIQUE ("email"),
        CONSTRAINT "PK_users_id" PRIMARY KEY ("id")
      )
    \`);

    // Create posts table
    await queryRunner.query(\`
      CREATE TABLE "posts" (
        "id" SERIAL NOT NULL,
        "title" character varying(255) NOT NULL,
        "content" text NOT NULL,
        "published" boolean NOT NULL DEFAULT false,
        "publishedAt" TIMESTAMP,
        "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
        "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
        "userId" integer NOT NULL,
        CONSTRAINT "PK_posts_id" PRIMARY KEY ("id"),
        CONSTRAINT "FK_posts_userId" FOREIGN KEY ("userId") 
          REFERENCES "users"("id") ON DELETE CASCADE
      )
    \`);

    // Create indexes
    await queryRunner.query(\`CREATE INDEX "IDX_users_email" ON "users" ("email")\`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(\`DROP TABLE "posts"\`);
    await queryRunner.query(\`DROP TABLE "users"\`);
  }
}

// Run migrations
npx typeorm migration:run

// Revert migrations
npx typeorm migration:revert

// Update app.ts to initialize database
// src/app.ts
import 'reflect-metadata';
import { initializeDatabase } from './config/database';

class App {
  constructor() {
    this.initializeDatabase();
    // ... rest of constructor
  }

  private async initializeDatabase(): Promise<void> {
    await initializeDatabase();
  }
}`}
          explanation={[
            {
              label: "migration:generate",
              desc: "Creates migration file based on entity changes",
            },
            {
              label: "MigrationInterface",
              desc: "TypeORM interface for creating reversible database changes",
            },
            {
              label: "queryRunner.query",
              desc: "Executes raw SQL for complex schema modifications",
            },
            {
              label: "up() / down()",
              desc: "Methods for applying and reverting migration changes",
            },
            {
              label: "'reflect-metadata'",
              desc: "Must be imported at app entry point for decorators",
            },
          ]}
        />
      </div>

      <div className="bg-green-50 border border-green-200 rounded-lg p-4">
        <h4 className="font-semibold text-green-900 mb-2">
          🎯 TypeORM Benefits
        </h4>
        <ul className="text-sm text-green-800 space-y-1">
          <li>• Full TypeScript integration with decorators and type safety</li>
          <li>• Automatic schema synchronization in development</li>
          <li>• Advanced query builder with SQL-like syntax</li>
          <li>• Migration system for production schema changes</li>
          <li>• Support for relations, transactions, and connection pooling</li>
        </ul>
      </div>
    </div>
  ),
};
