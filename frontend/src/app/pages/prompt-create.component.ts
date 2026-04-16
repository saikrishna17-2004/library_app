import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';

import { PromptsApiService } from '../services/prompts-api.service';

@Component({
  selector: 'app-prompt-create',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  template: `
    <section class="page">
      <div class="page-heading">
        <h1>Add Prompt</h1>
        <p>Create a new AI image generation prompt.</p>
      </div>

      <form class="form-card" [formGroup]="form" (ngSubmit)="submit()">
        <label>
          Title
          <input formControlName="title" type="text" placeholder="Cyberpunk City" />
        </label>
        <p class="error" *ngIf="form.controls.title.touched && form.controls.title.errors?.['required']">Title is required.</p>
        <p class="error" *ngIf="form.controls.title.touched && form.controls.title.errors?.['minlength']">Title must be at least 3 characters.</p>

        <label>
          Content
          <textarea formControlName="content" rows="6" placeholder="Describe the style, mood, lens, lighting, and details..."></textarea>
        </label>
        <p class="error" *ngIf="form.controls.content.touched && form.controls.content.errors?.['required']">Content is required.</p>
        <p class="error" *ngIf="form.controls.content.touched && form.controls.content.errors?.['minlength']">Content must be at least 20 characters.</p>

        <label>
          Complexity (1-10)
          <input formControlName="complexity" type="number" min="1" max="10" />
        </label>
        <p class="error" *ngIf="form.controls.complexity.touched && form.controls.complexity.errors?.['required']">Complexity is required.</p>
        <p class="error" *ngIf="form.controls.complexity.touched && (form.controls.complexity.errors?.['min'] || form.controls.complexity.errors?.['max'])">Complexity must be between 1 and 10.</p>

        <div class="actions">
          <button type="submit" [disabled]="form.invalid || isSubmitting">{{ isSubmitting ? 'Saving...' : 'Create Prompt' }}</button>
          <a routerLink="/prompts">Cancel</a>
        </div>
      </form>

      <div class="state-card error" *ngIf="errorMessage">{{ errorMessage }}</div>
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
      }

      .page-heading p {
        margin: 0.3rem 0 0;
        color: #3f4d46;
      }

      .form-card {
        border: 1px solid #95aa9f;
        background: #f9fcf4;
        border-radius: 14px;
        padding: 1rem;
        display: grid;
        gap: 0.6rem;
      }

      label {
        display: grid;
        gap: 0.35rem;
        font-weight: 600;
        color: #1d2f2a;
      }

      input,
      textarea {
        border: 1px solid #7f978b;
        border-radius: 10px;
        padding: 0.6rem 0.7rem;
        font: inherit;
      }

      input:focus,
      textarea:focus {
        outline: 2px solid #62a88e;
        outline-offset: 1px;
      }

      .actions {
        margin-top: 0.4rem;
        display: flex;
        align-items: center;
        gap: 0.8rem;
      }

      button {
        border: 0;
        border-radius: 999px;
        background: #0f4e43;
        color: #f8fff8;
        padding: 0.62rem 1rem;
        font-weight: 700;
        cursor: pointer;
      }

      button:disabled {
        opacity: 0.6;
        cursor: not-allowed;
      }

      .actions a {
        color: #0f4e43;
        text-decoration: none;
      }

      .error {
        margin: 0;
        color: #9b2d1d;
        font-size: 0.9rem;
      }

      .state-card {
        padding: 0.95rem;
        border-radius: 12px;
        border: 1px solid #c35d4f;
        background: #ffeae4;
      }
    `
  ]
})
export class PromptCreateComponent {
  isSubmitting = false;
  errorMessage = '';

  readonly form = this.formBuilder.nonNullable.group({
    title: ['', [Validators.required, Validators.minLength(3)]],
    content: ['', [Validators.required, Validators.minLength(20)]],
    complexity: [1, [Validators.required, Validators.min(1), Validators.max(10)]]
  });

  constructor(
    private readonly formBuilder: FormBuilder,
    private readonly promptsApiService: PromptsApiService,
    private readonly router: Router
  ) {}

  submit(): void {
    if (this.form.invalid || this.isSubmitting) {
      this.form.markAllAsTouched();
      return;
    }

    this.isSubmitting = true;
    this.errorMessage = '';

    const payload = this.form.getRawValue();
    this.promptsApiService.createPrompt(payload).subscribe({
      next: () => {
        this.isSubmitting = false;
        this.router.navigate(['/prompts']);
      },
      error: () => {
        this.isSubmitting = false;
        this.errorMessage = 'Failed to create prompt. Please try again.';
      }
    });
  }
}
