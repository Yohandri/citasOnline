app.controller("home", function ($scope, $routeParams, $rootScope, $route) {
	$rootScope.btnBack = false;
	$scope.$routeParams = $routeParams;
	$rootScope.$titulo = 'Bienvenidos a citas online';
	$scope.$data  = 'data home';
	$scope.change = function(obj){
	}
	setTimeout(function(){
		$('select').material_select();
		$('.tooltipped').tooltip('remove');
		fnProgress(0);
	},300);

});