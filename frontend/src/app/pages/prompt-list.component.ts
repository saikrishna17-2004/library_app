import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';

import { Prompt } from '../models/prompt.model';
import { PromptsApiService } from '../services/prompts-api.service';

@Component({
  selector: 'app-prompt-list',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <section class="page">
      <div class="page-heading">
        <h1>Prompt Library</h1>
        <p>Browse AI image generation prompts and their complexity.</p>
      </div>

      <div class="state-card" *ngIf="isLoading">Loading prompts...</div>
      <div class="state-card error" *ngIf="errorMessage">{{ errorMessage }}</div>

      <div class="prompt-grid" *ngIf="!isLoading && !errorMessage">
        <a class="prompt-card" *ngFor="let prompt of prompts" [routerLink]="['/prompts', prompt.id]">
          <h2>{{ prompt.title }}</h2>
          <p>Complexity <strong>{{ prompt.complexity }}/10</strong></p>
        </a>
      </div>

      <div class="state-card" *ngIf="!isLoading && !errorMessage && prompts.length === 0">
        No prompts yet. Create one from the Add Prompt tab.
      </div>
    </section>
  `,
  styles: [
    `
      .page {
        display: grid;
        gap: 1rem;
      }

      .page-heading h1 {
        margin: 0;
        font-size: clamp(1.7rem, 2.8vw, 2.3rem);
      }

      .page-heading p {
        margin: 0.35rem 0 0;
        color: #3f4d46;
      }

      .prompt-grid {
        display: grid;
        gap: 0.85rem;
        grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
      }

      .prompt-card {
        border: 1px solid #94a99d;
        background: #f9fcf4;
        text-decoration: none;
        color: #15231f;
        border-radius: 14px;
        padding: 1rem;
        transition: transform 0.2s ease, box-shadow 0.2s ease;
      }

      .prompt-card:hover {
        transform: translateY(-2px);
        box-shadow: 0 10px 22px rgba(18, 34, 31, 0.12);
      }

      .prompt-card h2 {
        margin: 0;
        font-size: 1.1rem;
      }

      .prompt-card p {
        margin: 0.6rem 0 0;
      }

      .state-card {
        padding: 0.95rem;
        border-radius: 12px;
        border: 1px solid #95aa9f;
        background: #f9fcf4;
      }

      .error {
        border-color: #c35d4f;
        background: #ffeae4;
      }
    `
  ]
})
export class PromptListComponent implements OnInit {
  prompts: Prompt[] = [];
  isLoading = true;
  errorMessage = '';

  constructor(private readonly promptsApiService: PromptsApiService) {}

  ngOnInit(): void {
    this.promptsApiService.getPrompts().subscribe({
      next: (prompts) => {
        this.prompts = prompts;
        this.isLoading = false;
      },
      error: () => {
        this.errorMessage = 'Unable to load prompts right now.';
        this.isLoading = false;
      }
    });
  }
}
