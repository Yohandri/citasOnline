app.controller("search", function ($scope, $routeParams, $rootScope, NgMap) {
	$rootScope.btnBack = true;
	$rootScope.$titulo = 'Busqueda ';
	$scope.$data  = 'data search';
	$scope.busqueda = $routeParams.q;
	$scope.center = [10.0739, -69.3228];
	NgMap.getMap().then(function(map) {

	});
	setTimeout(function(){
		$('select').material_select();
		$('.tooltipped').tooltip({delay: 50});
	},200);
	$scope.centerChanged = function(event) {
		$timeout(function() {

		}, 3000);
	}
	$scope.fnPerfil = function(){
		$rootScope.fnModal('#modalPerfil', 'open','1%','1%');
		$('.carousel').carousel();

	}
	$scope.fnConsultorios = function(){
		$rootScope.fnModal('#modalConsultorios', 'open','1%','1%');
	}
	$scope.fnListaC = function(self){
		var target = self.target;
		$('.collection-item').removeClass('active');
		$(target).addClass('active');
	}
	$scope.fnExpandirTr = function(obj){
		var tr = obj.target.parentNode.parentNode.parentNode;
		angular.element(tr).toggleClass('mostrar');
	}
});