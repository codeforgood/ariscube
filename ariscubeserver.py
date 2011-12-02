import cherrypy
import pymongo
import ariscubeprops
import os

from ariscubedbhelper import ARISCUBEDBHelper
from ariscube import ArisCube

class Root(object):
    pass

dbHelper= ARISCUBEDBHelper()
root = Root()
root.ariscube=ArisCube(dbHelper)

conf = {
    'global': {
        'server.socket_host': 'localhost',
        'server.socket_port': 8000,
        'tools.staticdir.root' : '/html'
    },
    '/': {
        'request.dispatch': cherrypy.dispatch.MethodDispatcher(),
    },
    '/style.css': {
        'tools.staticfile.on': True,
        'tools.staticfile.filename': os.path.abspath(os.path.join(os.path.dirname(__file__), 'css/style.css'))
    },
    '/cube.css': {
        'tools.staticfile.on': True,
        'tools.staticfile.filename': os.path.abspath(os.path.join(os.path.dirname(__file__), 'css/cube.css'))
    },
    '/utils.js': {
        'tools.staticfile.on': True,
        'tools.staticfile.filename': os.path.abspath(os.path.join(os.path.dirname(__file__), 'js/utils.js'))
    },
    '/rotate-box.js': {
        'tools.staticfile.on': True,
        'tools.staticfile.filename': os.path.abspath(os.path.join(os.path.dirname(__file__), 'js/rotate-box.js'))
    },
    '/cube.jpg': {
        'tools.staticfile.on': True,
        'tools.staticfile.filename': os.path.abspath(os.path.join(os.path.dirname(__file__), 'images/cube.jpg'))
    },
    '/student.jpg': {
        'tools.staticfile.on': True,
        'tools.staticfile.filename': os.path.abspath(os.path.join(os.path.dirname(__file__), 'images/student.jpg'))
    },
    '/unfollow.png': {
        'tools.staticfile.on': True,
        'tools.staticfile.filename': os.path.abspath(os.path.join(os.path.dirname(__file__), 'images/unfollow.png'))
    },
    '/PoweredMongoDB.png': {
        'tools.staticfile.on': True,
        'tools.staticfile.filename': os.path.abspath(os.path.join(os.path.dirname(__file__), 'images/PoweredMongoDB.png'))
    },
    '/python-powered.png': {
        'tools.staticfile.on': True,
        'tools.staticfile.filename': os.path.abspath(os.path.join(os.path.dirname(__file__), 'images/python-powered.png'))
    },
    '/Hackalot.png': {
        'tools.staticfile.on': True,
        'tools.staticfile.filename': os.path.abspath(os.path.join(os.path.dirname(__file__), 'images/Hackalot.png'))
    }
} 
cherrypy.quickstart(root, '/', conf)