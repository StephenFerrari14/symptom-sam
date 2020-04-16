from django.shortcuts import render
from django.http import HttpResponse, JsonResponse
from django.views.decorators.csrf import csrf_exempt
from diagnose.models import Symptom, Condition, Report, UserCondition, ConditionSymptom

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
  condition_id = request.GET['id']
  submittedConditions = UserCondition.objects.filter(conditionId=condition_id)
  data = {
    'report': {
      'frequency': len(submittedConditions)
    }
  }
  return JsonResponse(data)

def get_top_conditions_for_symptom(request):
  data = {
    'conditions': [{'id': 1, 'name': 'rash'}, {'id': 2, 'name': 'rash 2'}]
  }
  return JsonResponse(data)

# update with csrf token and get rid of excemption
@csrf_exempt
def save_condition_diagnosis(request):
  condition_id = request.POST['id']
  submittedCondition = UserCondition(condition_id=condition_id)
  submittedCondition.save()
  return JsonResponse({"success": True})