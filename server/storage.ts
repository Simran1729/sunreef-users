import { users, tickets, type User, type InsertUser, type Ticket, type InsertTicket } from "@shared/schema";

export interface IStorage {
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  getAllUsers(): Promise<User[]>;
  createUser(user: InsertUser): Promise<User>;
  createTicket(ticket: InsertTicket): Promise<Ticket>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private tickets: Map<number, Ticket>;
  private currentUserId: number;
  private currentTicketId: number;

  constructor() {
    this.users = new Map();
    this.tickets = new Map();
    this.currentUserId = 1;
    this.currentTicketId = 1;

    // Add some demo users
    this.createUser({ username: "john.doe" });
    this.createUser({ username: "jane.smith" });
    this.createUser({ username: "bob.wilson" });
  }

  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async getAllUsers(): Promise<User[]> {
    return Array.from(this.users.values());
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentUserId++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  async createTicket(insertTicket: InsertTicket): Promise<Ticket> {
    const id = this.currentTicketId++;
    const ticket: Ticket = { ...insertTicket, id };
    this.tickets.set(id, ticket);
    return ticket;
  }
}

export const storage = new MemStorage();