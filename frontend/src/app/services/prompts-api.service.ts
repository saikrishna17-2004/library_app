import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { Prompt } from '../models/prompt.model';

interface CreatePromptRequest {
  title: string;
  content: string;
  complexity: number;
}

@Injectable({
  providedIn: 'root'
})
export class PromptsApiService {
  private readonly apiBaseUrl = 'http://localhost:8000';

  constructor(private readonly http: HttpClient) {}

  getPrompts(): Observable<Prompt[]> {
    return this.http.get<Prompt[]>(`${this.apiBaseUrl}/prompts/`);
  }

  getPrompt(id: number): Observable<Prompt> {
    return this.http.get<Prompt>(`${this.apiBaseUrl}/prompts/${id}/`);
  }

  createPrompt(payload: CreatePromptRequest): Observable<Prompt> {
    return this.http.post<Prompt>(`${this.apiBaseUrl}/prompts/`, payload);
  }
}
