app.controller("tipousuario", function($scope, $routeParams, $rootScope, $location,DTOptionsBuilder, DTColumnDefBuilder, $resource,$http){
	$rootScope.btnBack = true;
	$rootScope.$titulo = 'Lista de tipos de usuarios';
	$scope.key = $routeParams.key;
	if ($scope.key != 'tbTU'+$rootScope.localStorage.usuario.token+'Lista') {
		$location.path('/');
	}
	$rootScope.settingTabla = {
			pathList: 'tablas/tipousuario/controlador.php?tipo=seleccionarTodo&token='+$rootScope.localStorage.usuario.token,
			path: 'tablas/tipousuario/controlador.php',
			campos: {
				formTabla: function(){
					return [
						{col:'Nombre', tituloInput:'Nombre del tipo de usuario'}
					]
				}
			},
			tituloModalAdd: 'Agregar Tipo de usuario',
			tituloModalEdit: 'Editar Tipo de usuario'
		};
});
app.controller("dataTable", dataTableTB);


