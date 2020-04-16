from django.shortcuts import render
from django.http import HttpResponse, JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.core.exceptions import ObjectDoesNotExist
from django.views.decorators.http import require_http_methods
from diagnose.models import Symptom, Condition, Report, UserCondition, ConditionSymptom
import json
import csv
from random import randint

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
  conditions = ConditionSymptom.objects.filter(symptomId=symptom_id)

  relevant_conditions = []
  for condition in conditions:
    relevant_conditions.append({
      'condition_id': condition.conditionId,
      'score': condition.relevanceScore
    })
  relevant_conditions.sort(key=lambda x: x['score'], reverse=True)

  condition_id = relevant_conditions[0]['condition_id']
  condition = Condition.objects.get(id=condition_id)

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
  relevant_conditions.sort(key=lambda x: x['score'], reverse=True)
  # drop the first condition since that will be the one that will have been the condition in the first phase of the form
  relevant_conditions = relevant_conditions[1:limit+1]

  top_conditions = Condition.objects.filter(id__in=[relevent_condition['condition_id'] for relevent_condition in relevant_conditions])
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
  condition_id = payload['conditionId']
  submittedCondition = UserCondition(conditionId=condition_id)
  submittedCondition.save()
  return JsonResponse({"success": True})

# just doing this because other options I found were difficult
def load_db(request):
  # drop everything
  Symptom.objects.all().delete()
  Condition.objects.all().delete()
  ConditionSymptom.objects.all().delete()
  Report.objects.all().delete()
  UserCondition.objects.all().delete()

  # insert all new data
  with open('symptoms.csv', newline='') as csvfile:
    reader = csv.reader(csvfile, delimiter=',')
    for row in reader:
      # first record is symptom
      # the rest are conditions
      s = Symptom(name=row[0])
      s.save()
      s = Symptom.objects.get(name=row[0])
      symptom_id = s.id
      for r in row[1:]:
        try:
          c = Condition.objects.get(name=r)
        except ObjectDoesNotExist as e:
          c = Condition(name=r)
          c.save()
          c = Condition.objects.get(name=r)
        condition_id = c.id
        score = randint(1,10)
        cs = ConditionSymptom(symptomId=symptom_id, conditionId=condition_id, relevanceScore=score)
        cs.save()
  return HttpResponse('db setup')