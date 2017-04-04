from google.appengine.api import users
import webapp2
import os
import datetime, time
import urllib, urllib2
import json
from google.appengine.ext.webapp import template

# Pretty much, you use this to grab the assignments and post the data to another website


class MainPage(webapp2.RequestHandler):
    def get(self):
        template_values = {
            'title': "Ozone"
        }
        path = os.path.join(os.path.dirname(__file__), 'templates/', 'index.html')
        page = template.render(path, template_values)
        self.response.out.write(page)


class Scouting(webapp2.RequestHandler):
    def post(self):
        dataraw = self.request.body
        dataloads = json.loads(dataraw)
        data = json.dumps(dataloads)
        # Enter in a url where you can submit your JSON data
        # url = ''
        request = urllib2.Request(url)
        request.add_header('Content-Type', 'application/json')
        try:
            response = urllib2.urlopen(request, data)
            searchresponse = response.read().find('everything')
            if (response.code == 200 and searchresponse != -1):
                page = 'success'
            else:
                page = 'Drupal' + response.code
            response.close()
        except:
            page = 'Drupal Fail'
        self.response.out.write(page)


# class Assignments(webapp2.RequestHandler):
#     def get(self):
#         mydata = [ {"scouter": "Ryan2", "match": "45", "assignment": "team", "team_number":"4611"},
#                  {"scouter": "Ryan", "match": "46", "assignment": "watch", "team_number": "4611"},
#                  {"scouter": "Ben", "match": "45", "assignment": "team", "team_number": "6666"},
#                  {"scouter": "Blaine", "match": "45", "assignment": "defense"},
#                  {"scouter": "Rob", "match": "45", "assignment": "defense"},
#                  {"scouter": "Rob", "match": "46", "assignment": "team", "team_number": "5555"}]
#         page = json.dumps(mydata)
#         self.response.headers['Content-Type'] = 'application/json'
#         self.response.out.write(page)


class Assignments(webapp2.RequestHandler):
    def get(self):
        # Enter in a url where you grab the JSON assignments of a user
        # url = ''
        request = urllib2.Request(url)
        try:
            response = urllib2.urlopen(request)
            json_string = response.read()
            parsed_json = json.loads(json_string)
            response.close()
            page = json.dumps(parsed_json)
            self.response.headers['Content-Type'] = 'application/json'
            self.response.out.write(page)
        except:
            page = 'could not reach drupal'


application = webapp2.WSGIApplication([
    ('/', MainPage),
    ('/drupal', Drupal),
    ('/assignments', Assignments),
    ('/scouting', Scouting)
], debug=True)
