# ozone-scouting-2017
# README #

This app was created by Ryan and Mark Schwartz to allow our team to scout during the Buckeye Regional 2017 competition.

Project Start: March 2017

Project End: April 2017

### What is this repository for? ###

* This is for [Ozone Robotics](http://olentangyfrc.org/scouting)

### How to set up the local server ###

* Open up console in PyCharm
* Find dev_appserver.py (Generally in "C:\Program Files (x86)\Google\Cloud SDK\google-cloud-sdk\bin\dev_appserver.py")
* Find the project folder (Generally in "C:\Users\ryan2\Documents\GitHub\frc4611")
* Execute the following command:
~~~
"C:\Program Files (x86)\Google\Cloud SDK\google-cloud-sdk\bin\dev_appserver.py" C:\Users\ryan2\Documents\GitHub\frc4611
~~~
* Go to localhost:8080

### Configure app to deploy ###

* gcloud config set project <project-id>
* gcloud config set project ozone-scouting

### Deploy app ###

* cd "C:\Users\ryan2\Documents\GitHub\frc4611"
* gcloud app deploy
