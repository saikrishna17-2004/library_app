import json

import redis
from django.conf import settings
from django.http import HttpResponseNotAllowed, JsonResponse
from django.views.decorators.csrf import csrf_exempt

from .models import Prompt


def _redis_client():
	return redis.Redis(host=settings.REDIS_HOST, port=settings.REDIS_PORT, decode_responses=True)


def _prompt_to_dict(prompt: Prompt):
	return {
		'id': prompt.id,
		'title': prompt.title,
		'content': prompt.content,
		'complexity': prompt.complexity,
		'created_at': prompt.created_at.isoformat(),
	}


@csrf_exempt
def prompt_list_create(request):
	if request.method == 'GET':
		prompts = Prompt.objects.all()
		return JsonResponse([_prompt_to_dict(prompt) for prompt in prompts], safe=False)

	if request.method == 'POST':
		try:
			payload = json.loads(request.body.decode('utf-8'))
		except (json.JSONDecodeError, UnicodeDecodeError):
			return JsonResponse({'error': 'Invalid JSON payload.'}, status=400)

		title = str(payload.get('title', '')).strip()
		content = str(payload.get('content', '')).strip()
		complexity = payload.get('complexity')

		if len(title) < 3:
			return JsonResponse({'error': 'Title must be at least 3 characters.'}, status=400)
		if len(content) < 20:
			return JsonResponse({'error': 'Content must be at least 20 characters.'}, status=400)

		try:
			complexity = int(complexity)
		except (TypeError, ValueError):
			return JsonResponse({'error': 'Complexity must be an integer between 1 and 10.'}, status=400)

		if complexity < 1 or complexity > 10:
			return JsonResponse({'error': 'Complexity must be between 1 and 10.'}, status=400)

		prompt = Prompt.objects.create(title=title, content=content, complexity=complexity)
		return JsonResponse(_prompt_to_dict(prompt), status=201)

	return HttpResponseNotAllowed(['GET', 'POST'])


def prompt_detail(request, prompt_id):
	if request.method != 'GET':
		return HttpResponseNotAllowed(['GET'])

	try:
		prompt = Prompt.objects.get(pk=prompt_id)
	except Prompt.DoesNotExist:
		return JsonResponse({'error': 'Prompt not found.'}, status=404)

	redis_client = _redis_client()
	key = f'prompt:{prompt.id}:views'
	view_count = redis_client.incr(key)

	data = _prompt_to_dict(prompt)
	data['view_count'] = view_count
	return JsonResponse(data)
