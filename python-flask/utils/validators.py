def validate_todo(todo):
    return isinstance(todo,dict) and todo.get("task",False) and todo.get("completed",None) is not None
    