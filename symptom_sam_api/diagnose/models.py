from django.db import models

# Create your models here.

class Symptom(models.Model):
  id = models.IntegerField(primary_key=True)
  name = models.CharField(max_length=100)

class Condition(models.Model):
  id = models.IntegerField(primary_key=True)
  name = models.CharField(max_length=100)

class Report(models.Model):
  id = models.IntegerField(primary_key=True)
  frequency = models.IntegerField(default=0)

class UserCondition(models.Model):
  id = models.IntegerField(primary_key=True)
  conditionId = models.IntegerField(default=0)
  insertedData = models.DateTimeField(auto_now=True)

class ConditionSymptom(models.Model):
  class Meta:
    unique_together = (('symptomId', 'conditionId'),)
  symptomId = models.IntegerField(primary_key=True)
  conditionId = models.IntegerField(default=0)
  relevanceScore = models.IntegerField(default=0)