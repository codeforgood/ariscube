import cherrypy
import pymongo
import ariscubeprops as PROPS
import json

from mako.template import Template
from mako.lookup import TemplateLookup
lookup = TemplateLookup(directories=['html'])

from ariscubedbhelper import ARISCUBEDBHelper

class ArisCube(object):

    exposed = True
    
    def __init__(self, dbHelper):
        self.studentsCol= dbHelper.getCollectionRef(PROPS.REMOTE_COL_STUDENTS)
        self.usersCol= dbHelper.getCollectionRef(PROPS.REMOTE_COL_USERS)
        self.feedsCol= dbHelper.getCollectionRef(PROPS.REMOTE_COL_FEEDS)
       
    def GET(self, *vpath, **params):
        self.paramMap = {}
        for k,v in params.items():
            self.paramMap[k] = v
            
        if vpath:
            if (vpath[0] == "student"):
                cherrypy.response.headers["Content-Type"] = "application/json"
                cherrypy.response.status = 200
                #print session['user']
                student_feed=self.feedsCol.find_one({"code": self.paramMap["code"], "year": self.paramMap["year"], "month":self.paramMap["month"]})
                stud=self.studentsCol.find_one({"code": self.paramMap["code"]})
                if student_feed is not None:
                    if student_feed.has_key("comments"):
                        return json.dumps({"updates":"1","data":student_feed["updates"],"name":stud['name'], "comments":student_feed["comments"]})                    
                    else:
                        return json.dumps({"updates":"1","data":student_feed["updates"],"name":stud['name']})                                        
                else:
                    return json.dumps({"updates":"0","name":stud['name']})
        else:
            tmpl = lookup.get_template("index.html")
            user=self.usersCol.find_one({"username": self.paramMap["username"]})
            studentsList=user["following"]
            students_list=[]
            for student in studentsList:
                students_list.append({"name":student})
            allStudents=self.studentsCol.find()
            allStudList=[]
            for stud in allStudents:
                allStudList.append({"name":stud['name'],"code":stud['code']})
            return tmpl.render(students=students_list, students_follow_cnt=len(students_list), allStudList=allStudList)
            
    def DELETE(self, *vpath, **params):
        self.paramMap = {}
        for k,v in params.items():
            self.paramMap[k] = v
            
        if vpath:
            if(vpath[0] == "student" and vpath[1] == "unfollow"):
                cherrypy.response.headers["Content-Type"] = "application/json"
                cherrypy.response.status = 200                
                self.usersCol.update({"username": self.paramMap["username"] }, { "$pull" : { "following": self.paramMap["code"]}})
                user=self.usersCol.find_one({"username": self.paramMap["username"]})
                studentsList=user["following"]
                return json.dumps({"success":1, "students_follow_cnt":len(studentsList)})
    
    def POST(self, *vpath, **params):
        self.paramMap = {}
        for k,v in params.items():
            self.paramMap[k] = v
            
        if vpath:
            if(vpath[0] == "student" and vpath[1] == "comment"):
                cherrypy.response.headers["Content-Type"] = "application/json"
                cherrypy.response.status = 200
                print self.paramMap["username"]
                print self.paramMap["code"]
                print self.paramMap["month"]
                print self.paramMap["year"]
                comment={}
                comment["author"]=self.paramMap["username"]
                comment["text"]=self.paramMap["comment"]
                self.feedsCol.update({"code": self.paramMap["code"], "year": self.paramMap["year"], "month":self.paramMap["month"]},
                {"$push": {"comments":comment}})
                return json.dumps({"success":1})
            elif(vpath[0] == "student" and vpath[1] == "follow"):
                print "follow block"
                print self.paramMap["username"]
                print self.paramMap["code"]
                cherrypy.response.headers["Content-Type"] = "application/json"
                cherrypy.response.status = 200                
                self.usersCol.update({"username": self.paramMap["username"] }, { "$push" : { "following": self.paramMap["code"]}})
                user=self.usersCol.find_one({"username": self.paramMap["username"]})
                studentsList=user["following"]
                return json.dumps({"success":1, "students_follow_cnt":len(studentsList)})