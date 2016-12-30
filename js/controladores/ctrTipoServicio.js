app.controller("tipoServicio", function($scope, $routeParams, $rootScope, $location,DTOptionsBuilder, DTColumnDefBuilder, $resource,$http){
	$rootScope.btnBack = true;
	$rootScope.$titulo = 'Lista de tipos de servicios';
	$scope.key = $routeParams.key;
	if ($scope.key != 'tbTS'+$rootScope.localStorage.usuario.token+'Lista') {
		$location.path('/');
	}
	$rootScope.settingTabla = {
			pathList: 'tablas/tiposervicios/controlador.php?tipo=seleccionarTodo&token='+$rootScope.localStorage.usuario.token,
			path: 'tablas/tiposervicios/controlador.php',
			campos: {
				formTabla: function(){
					return [
						{col:'Nombre', tituloInput:'Nombre del tipo de servicio'}
					]
				},
			},
			tituloModalAdd: 'Agregar Tipo de servicio',
			tituloModalEdit: 'Editar Tipo de servicio'
		};

});
app.controller("dataTable", dataTableTB);


