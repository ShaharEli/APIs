import json
from typing import Dict, List

from utils.lists import find
from utils.validators import validate_todo
from flask import Flask, request,abort, jsonify


from typing import Dict, List
from flask import Flask

app = Flask(__name__)

global database
database: List[Dict] = []
global ids_counter
ids_counter = 1

BASE_PATH = "/todos"



@app.delete(BASE_PATH, defaults={'id': None})
@app.delete(f"{BASE_PATH}/<int:id>")
def todos_delete(id):
    global database
    if id:
        database = [todo for todo in database if todo.get("id")!=id]
        return jsonify({"success" : True})

    else:
        database = []
        return jsonify({"success" : True})


@app.put(f"{BASE_PATH}/<int:id>")
def todos_update(id):
    global database
    data = request.data
    try:
        jsoned = json.loads(data.decode())
    except json.JSONDecodeError:
        abort(400)
        return
    if not validate_todo(jsoned):
        abort(400)
        return
    new_database = []
    found = False
    updated_todo = {**jsoned,"id":id}
    for elm in database:
        if elm.get("id") ==id:
            found = True
            new_database.append(updated_todo)
        else:
            new_database.append(elm)
    if not found:
        abort(404)
        return
    return jsonify(updated_todo)

    
    
    


@app.get(BASE_PATH, defaults={'id': None})
@app.get(f"{BASE_PATH}/<int:id>")
def todos_get(id):
    global database
    if id:
        elm = find(database,lambda x : x.get("id") ==id)
        if elm is None  :
            abort(404)
        return jsonify(elm)
    else:
        return jsonify(database)
    
@app.post(BASE_PATH)
def todos_post():
    global database
    global ids_counter
    data = request.data
    try:
        jsoned = json.loads(data.decode())
    except json.JSONDecodeError:
        abort(400)
        return
    if not isinstance(jsoned, (list, dict)):
        abort(400)
        return
    if isinstance(jsoned,list):
        for todo in jsoned:
            if not validate_todo(todo):
                abort(400)
                return
        for todo in jsoned:
            database.append({**todo,"id":ids_counter})
            ids_counter+=1
        return jsonify (database)
        
    else: 
        if not validate_todo(jsoned):
            abort(400)
            return
        new_todo = {**jsoned,"id":ids_counter}
        database.append(new_todo)
        ids_counter+=1
        return jsonify (new_todo)

    

@app.errorhandler(404)
def not_found(error):
    return jsonify({'error': 'Resource not found', 'status_code': 404}), 404

@app.errorhandler(400)
def bad_request(error):
    return jsonify({'error': 'Bad Request', 'status_code': 400}), 400
