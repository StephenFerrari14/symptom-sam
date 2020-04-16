from django.shortcuts import render
from django.http import HttpResponse, JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_http_methods
from diagnose.models import Symptom, Condition, Report, UserCondition, ConditionSymptom
import json

def index(request):
  return HttpResponse("Status up")

def get_all_symptoms(request):
  symptoms = []
  for symptom in Symptom.objects.all():
    symptoms.append({
      'id': symptom.id,
      'name': symptom.name
    })

  data = {
    'symptoms': symptoms
  }
  return JsonResponse(data)

def get_condition_for_symptom(request):
  symptom_id = request.GET['symptom']
  print(symptom_id)
  # get condition data
  join = ConditionSymptom.objects.get(symptomId=symptom_id)
  condition = Condition.objects.get(id=join.conditionId)
  data = {
    'condition': {'id': condition.id, 'name': condition.name}
  }
  return JsonResponse(data)

def get_condition_by_id(request):
  condition_id = request.GET['id']
  condition = Condition.objects.get(id=condition_id)
  data = {
    'condition': {'id': condition.id, 'name': condition.name}
  }
  return JsonResponse(data)

def get_report_for_condition(request):
  condition_id = request.GET['condition']
  submittedConditions = UserCondition.objects.filter(conditionId=condition_id)
  data = {
    'report': {
      'frequency': len(submittedConditions)
    }
  }
  return JsonResponse(data)

def get_top_conditions_for_symptom(request):
  symptom_id = request.GET['symptom']
  if 'limit' in request.GET:
    limit = request.GET['limit']
  else:
    limit = 5
  conditions = ConditionSymptom.objects.filter(symptomId=symptom_id)

  relevant_conditions = []
  for condition in conditions:
    relevant_conditions.append({
      'condition_id': condition.conditionId,
      'score': condition.relevanceScore
    })
  print(relevant_conditions)
  relevant_conditions.sort(key=lambda x: x['score'], reverse=True)
  print(relevant_conditions)
  # drop the first condition since that will be the one that will have been the condition in the first phase of the form
  top_condition_ids = relevant_conditions[1:limit+1]
  top_conditions = Condition.objects.filter(id__in=top_condition_ids)
  results = []
  for condition in top_conditions:
    results.append({
      'id': condition.id,
      'name': condition.name
    })
  data = {
    'conditions': results
  }
  return JsonResponse(data)

# update with csrf token and get rid of excemption
@csrf_exempt
@require_http_methods(["POST"])
def save_condition_diagnosis(request):
  payload = json.loads(request.body)
  print(payload)
  condition_id = payload['conditionId']
  print(condition_id)
  submittedCondition = UserCondition(conditionId=condition_id)
  submittedCondition.save()
  return JsonResponse({"success": True})

