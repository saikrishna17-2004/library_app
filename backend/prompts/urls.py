from django.urls import path

from .views import prompt_detail, prompt_list_create

urlpatterns = [
    path('prompts/', prompt_list_create, name='prompt-list-create'),
    path('prompts/<int:prompt_id>/', prompt_detail, name='prompt-detail'),
]
