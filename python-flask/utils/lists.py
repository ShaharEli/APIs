from typing import List,Callable


def find(lst:List,func:Callable):
    for elm in lst:
        if(func(elm)):
            return elm
    return None