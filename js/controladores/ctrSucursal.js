app.controller("sucursal", function($scope, $routeParams, $rootScope, $location,DTOptionsBuilder, DTColumnDefBuilder, $resource,$http,datosSelect){
	$rootScope.btnBack = true;
	$rootScope.$titulo = 'Lista de sucursales';
	$scope.key = $routeParams.key;
	if ($scope.key != 'tbSU'+$rootScope.localStorage.usuario.token+'Lista') {
		$location.path('/');
	}
	$rootScope.settingTabla = {
			pathList: 'tablas/sucursal/controlador.php?tipo=seleccionarTodo&token='+$rootScope.localStorage.usuario.token,
			path: 'tablas/sucursal/controlador.php',
			campos: {,
				formTabla: function(){
					return [
						{col:'Nombre', tituloInput:'Nombre de sucursal'},
						{col:'Direccion', tituloInput:'Direccion'},
						{col:'Ciudad', tituloInput:'Ciudad'},
						{col:'Region', tituloInput:'Region'},
						{col:'Telefono', tituloInput:'Telefono'},
						{col:'Email', tituloInput:'Email'},
						{col:'Estatus', tituloInput:'Estatus'},
						{col:'Zona', tituloInput:'Zona'},
						{col:'PagoContado', tituloInput:'PagoContado'},
						{col:'Coord', tituloInput:'Coord'},
						{col:'NumCivico', tituloInput:'NumCivico'}
					]
				}
			},
			tituloModalAdd: 'Agregar sucursal',
			tituloModalEdit: 'Editar sucursal'
		};
});
app.controller("dataTable", dataTableTB);
