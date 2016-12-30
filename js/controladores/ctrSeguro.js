app.controller("seguro", function($scope, $routeParams, $rootScope, $location,DTOptionsBuilder, DTColumnDefBuilder, $resource,$http){
	$rootScope.btnBack = true;
	$rootScope.$titulo = 'Lista de seguros';
	$scope.key = $routeParams.key;
	if ($scope.key != 'tbS'+$rootScope.localStorage.usuario.token+'Lista') {
		$location.path('/');
	}
	$rootScope.settingTabla = {
			pathList: 'tablas/seguro/controlador.php?tipo=seleccionarTodo&token='+$rootScope.localStorage.usuario.token,
			path: 'tablas/seguro/controlador.php',
			campos: {
				formTabla: function(){
					return [
						{col:'Nombre', tituloInput:'Nombre del seguro'},
						{col:'Logo', tituloInput:'Logo del seguro'},
						{col:'Codigo', tituloInput:'Codigo del seguro'}
					]
				}
			},
			tituloModalAdd: 'Agregar seguro',
			tituloModalEdit: 'Editar seguro'
		};
});
app.controller("dataTableTB", dataTableTB);

