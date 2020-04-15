from django.shortcuts import render
from django.http import HttpResponse, JsonResponse

# Create your views here.

def index(request):
  return HttpResponse("Status up")

def get_all_symptoms(request):
  data = {
    'symptoms': [{'id': 1, 'name': 'iching'}, {'id': 2, 'name': 'runny nose'}]
  }
  return JsonResponse(data)

def get_condition_for_symptom(request):
  symptom_id = request.GET['symptom']
  print(symptom_id)
  # get condition data
  data = {
    'condition': {'id': 1, 'name': 'rash'}
  }
  return JsonResponse(data)

def get_report_for_condition(request):
  data = {
    'report': {
      'frequency': 3
    }
  }
  return JsonResponse(data)

def get_top_conditions_for_symptom(request):
  data = {
    'conditions': [{'id': 1, 'name': 'rash'}, {'id': 2, 'name': 'rash 2'}]
  }
  return JsonResponse({})