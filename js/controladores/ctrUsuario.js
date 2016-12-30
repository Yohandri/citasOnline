app.controller("usuario", function($scope, $routeParams, $rootScope, $location,DTOptionsBuilder, DTColumnDefBuilder, $resource,$http,datosSelect){
	$rootScope.btnBack = true;
	$rootScope.$titulo = 'Lista de usuarios';
	$scope.key = $routeParams.key;
	if ($scope.key != 'tbUS'+$rootScope.localStorage.usuario.token+'Lista') {
		$location.path('/');
	}
	$rootScope.settingTabla = {
			pathList: 'tablas/usuario/controlador.php?tipo=seleccionarTodo&token='+$rootScope.localStorage.usuario.token,
			path: 'tablas/usuario/controlador.php',
			campos: {
				formTabla: function(){
					return [
						{col:'Usuario', tituloInput:'Usuario'},
						{col:'TipoUsuario', tituloInput:'Tipo',foreignKey:true, tipo:'select',option:datosSelect.renderSelect($rootScope.$selectTipoUsuario)},
						{col:'Nombre', tituloInput:'Nombre'},
						{col:'Apellido', tituloInput:'Apellido'},
						{col:'IdAps', tituloInput:'IdAps',foreignKey:true, tipo:'select',option:datosSelect.renderSelect($rootScope.$selectSucursal)},
						{col:'Estatus', tituloInput:'Estatus'},
						{col:'IdPregunta', tituloInput:'IdPregunta'},
						{col:'Respuesta', tituloInput:'Respuesta'},
						{col:'Codigo', tituloInput:'Codigo'},
						{col:'Email', tituloInput:'Email'},
						{col:'Telefono', tituloInput:'Telefono'}
					]
				}
			},
			tituloModalAdd: 'Agregar usuario',
			tituloModalEdit: 'Editar usuario'
		};

});
app.controller("dataTable", dataTableTB);


