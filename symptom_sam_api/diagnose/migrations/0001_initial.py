# Generated by Django 3.0.5 on 2020-04-16 03:09

from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='Condition',
            fields=[
                ('id', models.IntegerField(primary_key=True, serialize=False)),
                ('name', models.CharField(max_length=100)),
            ],
        ),
        migrations.CreateModel(
            name='ConditionSymptom',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('symptomId', models.IntegerField(default=0)),
                ('conditionId', models.IntegerField(default=0)),
                ('relevanceScore', models.IntegerField(default=0)),
            ],
        ),
        migrations.CreateModel(
            name='Report',
            fields=[
                ('id', models.IntegerField(primary_key=True, serialize=False)),
                ('frequency', models.IntegerField(default=0)),
            ],
        ),
        migrations.CreateModel(
            name='Symptom',
            fields=[
                ('id', models.IntegerField(primary_key=True, serialize=False)),
                ('name', models.CharField(max_length=100)),
            ],
        ),
        migrations.CreateModel(
            name='UserCondition',
            fields=[
                ('id', models.IntegerField(primary_key=True, serialize=False)),
                ('conditionId', models.IntegerField(default=0)),
                ('insertedData', models.DateTimeField(auto_now=True)),
            ],
        ),
    ]