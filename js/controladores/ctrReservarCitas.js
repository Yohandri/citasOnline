app.controller("reservarCitas", function ($scope, $routeParams, $rootScope) {
	$rootScope.btnBack = true;
	$rootScope.$titulo = 'Reservar cita';
	$scope.paciente = {name: 'yo'};
	$scope.resumen = false;
	$scope.resumenBtn = function(){
		$scope.resumen = true;
		Materialize.toast('Cita confirmada', 4000, 'toastSuccess');
	}
	setTimeout(function(){
		$('select').material_select();
		$('input, textarea').characterCounter();
		$('.tooltipped').tooltip({delay: 50});
		$('.datepicker').pickadate();
	},100);
	$scope.fnRpaciente = function(){
		$rootScope.fnModal('#modalPaciente', 'open','1%','1%');
	}
});