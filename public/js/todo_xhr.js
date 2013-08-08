var todoApp = angular.module('todoApp', []);

todoApp.controller('TodoController', function($scope, $http) {

  $scope.todos = [];

  // Get all todos
  /*$http.get('/todos')
    .success(function(todos) {
      $scope.loaded = true;
      $scope.todos = todos;
    }).error(function(err) {
      alert(err);
    });*/

  $scope.addTodo = function(title) {
    /*$http.post('/todos', {
      title: title
    }).success(function(todo) {
      $scope.newTodoTitle = '';
      $scope.todos.push(todo);
    }).error(function(err) {
      // Alert if there's an error
      return alert(err.message || "an error occurred");
    });*/
    $scope.newTodoTitle = '';
    $scope.todos.push({
        title: title,
        completed: false
    });
  };

  $scope.changeCompleted = function(todo) {
    // Update the todo
    var message = (todo.completed === true) ? 'Task Completed!' : 'Task Uncompleted!';
    /*$http.put('/todos/' + todo.id, {
      completed: todo.completed
    }).error(function(err) {
      return alert(err.message || (err.errors && err.errors.completed) || "an error occurred");
    });*/
  };

  $scope.removeCompletedItems = function() {
    /*$http.get('/todos', {
      params: {
        completed: true
      }
    }).success(function(todos) {
      todos.forEach(function(t) { deleteTodo(t); });
    });*/
    $scope.todos.forEach(function(todo) {
        if (todo.completed === true) {
            deleteTodo(todo);
        }
    });
  };

  function deleteTodo(todo) {
    // Find the index of an object with a matching id
      /*var index = $scope.todos.indexOf(
          $scope.todos.filter(function(t) {
            return t.id === todo.id;
          })[0]);*/

      if ($scope.todos.indexOf(todo) !== -1) {
        var index = $scope.todos.indexOf(todo);
        $scope.todos.splice(index, 1);
      }
    
    /*$http.delete('/todos/' + todo.id, {
      params: {
        completed: true
      }
    }).success(function() {
      // Find the index of an object with a matching id
      var index = $scope.todos.indexOf(
          $scope.todos.filter(function(t) {
            return t.id === todo.id;
          })[0]);

      if (index !== -1) {
        $scope.todos.splice(index, 1);
      }
    }).error(function(err) {
      alert(err.message || "an error occurred");
    });*/
  }

});