import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { Subject, timer } from 'rxjs';
import { switchMap, takeUntil } from 'rxjs/operators';

import { Prompt } from '../models/prompt.model';
import { PromptsApiService } from '../services/prompts-api.service';

@Component({
  selector: 'app-prompt-detail',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <section class="page">
      <a routerLink="/prompts" class="back-link">Back to Prompt List</a>

      <div class="state-card" *ngIf="isLoading">Loading prompt...</div>
      <div class="state-card error" *ngIf="errorMessage">{{ errorMessage }}</div>

      <article class="detail-card" *ngIf="prompt && !isLoading && !errorMessage">
        <h1>{{ prompt.title }}</h1>
        <p class="meta">
          Complexity {{ prompt.complexity }}/10
          <span aria-hidden="true">•</span>
          Views {{ prompt.view_count }}
        </p>
        <p class="content">{{ prompt.content }}</p>
      </article>
    </section>
  `,
  styles: [
    `
      .page {
        display: grid;
        gap: 1rem;
      }

      .back-link {
        color: #12463f;
        text-decoration: none;
        font-weight: 600;
      }

      .state-card {
        padding: 0.95rem;
        border-radius: 12px;
        border: 1px solid #95aa9f;
        background: #f9fcf4;
      }

      .detail-card {
        border: 1px solid #95aa9f;
        background: #f9fcf4;
        border-radius: 14px;
        padding: 1.1rem;
      }

      .detail-card h1 {
        margin: 0;
        font-size: clamp(1.6rem, 2.7vw, 2.25rem);
      }

      .meta {
        margin: 0.55rem 0 0;
        color: #42534b;
        display: flex;
        gap: 0.45rem;
        flex-wrap: wrap;
      }

      .content {
        margin: 1.1rem 0 0;
        line-height: 1.55;
        white-space: pre-wrap;
      }

      .error {
        border-color: #c35d4f;
        background: #ffeae4;
      }
    `
  ]
})
export class PromptDetailComponent implements OnInit, OnDestroy {
  prompt?: Prompt;
  isLoading = true;
  errorMessage = '';
  private readonly destroy$ = new Subject<void>();

  constructor(
    private readonly route: ActivatedRoute,
    private readonly promptsApiService: PromptsApiService
  ) {}

  ngOnInit(): void {
    const promptId = Number(this.route.snapshot.paramMap.get('id'));

    if (!Number.isFinite(promptId)) {
      this.errorMessage = 'Invalid prompt id.';
      this.isLoading = false;
      return;
    }

    timer(0, 4000)
      .pipe(
        switchMap(() => this.promptsApiService.getPrompt(promptId)),
        takeUntil(this.destroy$)
      )
      .subscribe({
        next: (prompt) => {
          this.prompt = prompt;
          this.isLoading = false;
          this.errorMessage = '';
        },
        error: () => {
          this.errorMessage = 'Prompt could not be loaded.';
          this.isLoading = false;
        }
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
