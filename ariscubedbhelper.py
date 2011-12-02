import ariscubeprops as PROPS

from pymongo import Connection

class ARISCUBEDBHelper(object):
    
    def __init__(self):
        
       
        self.ariscube_con = Connection(PROPS.REMOTE_DB_HOST, PROPS.REMOTE_DB_PORT)
        self.ariscube_DB=self.ariscube_con[PROPS.REMOTE_DB]
        self.ariscube_DB.authenticate(PROPS.REMOTE_DB_USER,PROPS.REMOTE_DB_PASS)
        
    def getCollectionRef(self, collectionName):
        self.colRef=self.ariscube_DB[collectionName]
        return self.colRef