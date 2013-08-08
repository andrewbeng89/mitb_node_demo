var todoApp = angular.module('todoApp', []);

todoApp.controller('TodoController', function($scope, $http) {

  $scope.todos = [];

  $scope.addTodo = function(title) {
    $scope.newTodoTitle = '';
    $scope.todos.push({
        title: title,
        completed: false
    });
  };

  $scope.changeCompleted = function(todo) {
    // Update the todo
    var message = (todo.completed === true) ? 'Task Completed!' : 'Task Uncompleted!';
  };

  $scope.removeCompletedItems = function() {
    $scope.todos.forEach(function(todo) {
        if (todo.completed === true) {
            deleteTodo(todo);
        }
    });
  };

  function deleteTodo(todo) {
      if ($scope.todos.indexOf(todo) !== -1) {
        var index = $scope.todos.indexOf(todo);
        $scope.todos.splice(index, 1);
      }
  }

});