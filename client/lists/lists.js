angular.module("crowdcart.lists", [])

.controller("ListsController", function ($scope, Lists, $window, $location, $rootScope, $routeParams, $route) {
  // Your code here
  $scope.data = {};

  $scope.list = {};
  $scope.list.delivery_address = {};
  $scope.list.items = [];

  // store userid into local storage (same level as auth token)
  $scope.userid = $window.localStorage.getItem('crowdcartuser');

  var initialize = function () {
    // console.log('userId: ',$scope.userid)
    // console.log($rootScope)

    console.log($routeParams)
    console.log($routeParams.listid)
    console.log($route.current.params.listid)
    console.log($scope)

    Lists.getLists($scope.userid)
      .then(function (lists) {
        $scope.data.lists = lists;
      })
      .catch(function (error) {
        console.error(error);
      });

    Lists.getAllList()
      .then(function(allLists){
        $scope.data.allLists = allLists.filter(function(list){
          return (!list.deliverer_id || list.deliverer_id === '') && list.creator_id !== $scope.userid;
        });
        // console.log('ALL LISTS: ', allLists);
      })
      .catch(function(error){
        console.error(error);
      });

  };

  // $scope.newListId = $routeParams.listid

  $scope.displayDetail = function(listid) {
    $location.path("/listdetail/" + listid)
    $rootScope.displayList = this.list
  }

  //TODO add new list method, will be attached into createnewlist.html

  $scope.addList = function () {
    $scope.list.creator_id = $scope.userid;
    // Defaulting deliverer_id to empty string
    $scope.list.deliverer_id = '';
    // console.log('list', $scope.list);
    Lists.newList($scope.list)
      .then(function () {
        console.log('rediction');
        $location.path('/alllist.html');
      })
      .catch(function (error) {
        console.log(error);
      });
  };

  $scope.addJob = function(list) {

    // Prefix 786 for all new jobs
    // Note: Prior to this method.. deliverer_id = userid
    // causing issues where every list was being displayed
    // in My Jobs
    list.deliverer_id = '786' + $scope.userid;

    // Update DB list with new deliverer_id
    Lists.updateList(list)
      .then(function () {
        //$location.path('/mylists.html');
      })
      .catch(function (error) {
        console.log(error);
      });
  }


  initialize();

});

// .controller(ListsController, function($scope) {

//   //TODO: What methods do we need?

// })
