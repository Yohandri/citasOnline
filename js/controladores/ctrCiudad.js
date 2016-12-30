app.controller("ciudades", function($scope, $routeParams, $rootScope, $location,DTOptionsBuilder, DTColumnDefBuilder, $resource,$http){
	$rootScope.btnBack = true;
	$rootScope.$titulo = 'Lista de ciudades';
	$scope.key = $routeParams.key;
	if ($scope.key != 'tbZC'+$rootScope.localStorage.usuario.token+'Lista') {
		$location.path('/');
	}
	$rootScope.settingTabla = {
			pathList: 'tablas/zonaciudad/controlador.php?tipo=seleccionarTodo&token='+$rootScope.localStorage.usuario.token,
			path: 'tablas/zonaciudad/controlador.php',
			campos: {
				formTabla: function(){
					return [
						{col:'Zona', tituloInput:'Zona'},
						{col:'Ciudad', tituloInput:'Ciudad'}
					]
				}
			},
			tituloModalAdd: 'Agregar Zona Ciudad',
			tituloModalEdit: 'Editar Zona Ciudad'
		};
});
app.controller("dataTableTB", dataTableTB);

