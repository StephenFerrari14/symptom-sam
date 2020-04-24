# Web App that allows a user to enter their symptom and get a diagnosis.

Created with React and Django

## Development
For this web app you will need Python3, Yarn, and Node installed

## Installation
```
git clone git@github.com:StephenFerrari14/symptom-sam.git  
```

To start api:  
```
cd symptom-sam  
python3 -m venv venv  
source venv/bin/activate  
pip install  
cd symptom_sam_api  
python manage.py runserver
```  

To setup database schema:  
```
curl localhost:8000/diagnose/db  
```

To start frontend:  
```
yarn install  
yarn start  
```

## Tests
Run React tests
```
yarn run test
```

Run Django tests
```
python manage.py test diagnose
```