from django.urls import path

from . import views

urlpatterns = [
  path('', views.index, name="index"),
  path('symptoms', views.get_all_symptoms),
  path('conditionForSymptom', views.get_condition_for_symptom, name="get_condition_by_id"),
  path('condition', views.get_condition_by_id, name="get_condition_for_symptom"),
  path('report', views.get_report_for_condition, name="get_report_for_condition"),
  path('conditions', views.get_top_conditions_for_symptom, name="get_top_conditions_for_symptom"),
  path('save', views.save_condition_diagnosis, name="save_diagnosis"),
  path('db', views.load_db, name="setup"),
]