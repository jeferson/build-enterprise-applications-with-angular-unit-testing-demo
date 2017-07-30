import { TodosComponent } from './todos.component';
import { TodoService } from './todo.service';
import { Observable } from 'rxjs/Rx';

describe('TodosComponent', () => {
  let component: TodosComponent;
  let service: TodoService;

  beforeEach(() => {
    service = new TodoService(null);
    component = new TodosComponent(service);
  });

  it('should set todos property with items returned from the server', () => {
    const todos = [
      {id: 1, title: 'a'},
      {id: 2, title: 'b'},
      {id: 3, title: 'c'}
    ];

    spyOn<TodoService>(service, 'getTodos').and.callFake(() => {
      return Observable.from([ todos ]);
    });

    component.ngOnInit();

    expect(component.todos).toBe(todos);
  });

  it('should save the changes when a new todo item is added', () => {
    let spy = spyOn<TodoService>(service, 'add').and.callFake(t => {
      return Observable.empty();
    });

    component.add();

    expect(spy).toHaveBeenCalled();
  });

  it('should add the new todo returned from the server', () => {
    const todo = { id: 1 };
    let spy = spyOn<TodoService>(service, 'add').and.returnValue(Observable.from([ todo ]));

    component.add();

    expect(component.todos.indexOf(todo)).toBeGreaterThan(-1);
  });

  it('should set the message property if server returns an error when addind a new todo', () => {
    const error: string = 'error from the server';
    spyOn<TodoService>(service, 'add').and.returnValue(Observable.throw(error));

    component.add();

    expect(component.message = error);
  });

  it('should call the server to delete a todo item if the user confirms', () => {
    spyOn<Window>(window, 'confirm').and.returnValue(true);
    let spy = spyOn<TodoService>(service, 'delete').and.returnValue(Observable.empty());

    component.delete(1);

    expect(spy).toHaveBeenCalledWith(1);
  });

  it('should NOT call the server to delete a todo item if the user cancels', () => {
    spyOn<Window>(window, 'confirm').and.returnValue(false);
    let spy = spyOn<TodoService>(service, 'delete').and.returnValue(Observable.empty());

    component.delete(1);

    expect(spy).not.toHaveBeenCalled();
  });

});
