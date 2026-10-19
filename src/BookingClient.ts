import { type APIRequestContext, type APIResponse } from '@playwright/test';
import type { Booking } from './types';

/** Thin wrapper around the Restful-Booker endpoints, so tests read as intent. */
export class BookingClient {
  constructor(private readonly request: APIRequestContext) {}

  async createToken(username: string, password: string): Promise<APIResponse> {
    return this.request.post('/auth', { data: { username, password } });
  }

  async list(filters: Record<string, string> = {}): Promise<APIResponse> {
    return this.request.get('/booking', { params: filters });
  }

  async get(id: number): Promise<APIResponse> {
    return this.request.get(`/booking/${id}`);
  }

  async create(booking: Booking): Promise<APIResponse> {
    return this.request.post('/booking', { data: booking });
  }

  async update(id: number, booking: Booking, token?: string): Promise<APIResponse> {
    return this.request.put(`/booking/${id}`, { data: booking, headers: this.auth(token) });
  }

  async patch(id: number, fields: Partial<Booking>, token?: string): Promise<APIResponse> {
    return this.request.patch(`/booking/${id}`, { data: fields, headers: this.auth(token) });
  }

  async delete(id: number, token?: string): Promise<APIResponse> {
    return this.request.delete(`/booking/${id}`, { headers: this.auth(token) });
  }

  private auth(token?: string): Record<string, string> {
    return token ? { Cookie: `token=${token}` } : {};
  }
}
