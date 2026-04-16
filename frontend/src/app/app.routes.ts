import { Routes } from '@angular/router';
import { PromptCreateComponent } from './pages/prompt-create.component';
import { PromptDetailComponent } from './pages/prompt-detail.component';
import { PromptListComponent } from './pages/prompt-list.component';

export const routes: Routes = [
	{
		path: '',
		pathMatch: 'full',
		redirectTo: 'prompts'
	},
	{
		path: 'prompts',
		component: PromptListComponent
	},
	{
		path: 'prompts/new',
		component: PromptCreateComponent
	},
	{
		path: 'prompts/:id',
		component: PromptDetailComponent
	},
	{
		path: '**',
		redirectTo: 'prompts'
	}
];
