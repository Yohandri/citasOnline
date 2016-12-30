app.controller("servicio", function($scope, $routeParams, $rootScope, $location,DTOptionsBuilder, DTColumnDefBuilder, $resource,$http,datosSelect){
	$rootScope.btnBack = true;
	$rootScope.$titulo = 'Lista de servicios';
	$scope.key = $routeParams.key;
	if ($scope.key != 'tbSE'+$rootScope.localStorage.usuario.token+'Lista') {
		$location.path('/');
	}
	$rootScope.settingTabla = {
			pathList: 'tablas/servicio/controlador.php?tipo=seleccionarTodo&token='+$rootScope.localStorage.usuario.token,
			path: 'tablas/servicio/controlador.php',
			campos: {
				formTabla: function(){
					return [
						{col:'Nombre', tituloInput:'Nombre del servicio'},
						{col:'Descripcion', tituloInput:'descripcion'},
						{col:'IdTipoServicio', tituloInput:'Tipo de servicio asociado', foreignKey:true, tipo:'select',option: datosSelect.renderSelect($rootScope.$selectTipoServicio)},
						{col:'Favorito', tituloInput:'favorito'},
						{col:'Codigo', tituloInput:'codigo'}
					]
				}
			},
			tituloModalAdd: 'Agregar servicio',
			tituloModalEdit: 'Editar servicio'
		};
});
app.controller("dataTable", dataTableTB);
