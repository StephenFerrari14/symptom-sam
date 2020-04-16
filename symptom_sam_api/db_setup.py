import csv
from diagnose.models import Symptom, Condition, ConditionSymptom
from random import randint

with open('symptoms.csv', newline='') as csvfile:
  reader = csv.reader(csvfile, delimiter=',')
  for row in reader:
    # first record is symptom
    # the rest are conditions
    s = Symptom(name=row[0])
    s.save()
    s = Symptom.objects.get(name=row[0])
    symptom_id = s.id
    print(symptom_id)
    for r in row[1:]:
      c = Condition(name=r)
      c.save()
      c = Condition.objects.get(name=r)
      condition_id = c.id
      print(condition_id)
      score = randint(1,10)
      cs = ConditionSymptom(symptomId=symptom_id, conditionId=condition_id, relevanceScore=score)
      cs.save()