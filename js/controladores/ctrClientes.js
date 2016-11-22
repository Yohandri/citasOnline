app.controller("clientes", function($scope, $routeParams, $rootScope){
	$rootScope.btnBack = true;
	$rootScope.$titulo = 'Lista de clientes';
	$scope.clientes = [{ci:'12345678',nombre:'Pedro'},{ci:'98765432',nombre:'Luis'},{ci:'67894321',nombre:'José'}];
});
app.controller("datatableCliente", datatable);
function datatable(DTOptionsBuilder, DTColumnDefBuilder, $resource, $scope, $rootScope) {
	var vm = this;
	vm.tituloModal = 'Editor de la tabla clientes';
	vm.editarDatoTabla = false;
	vm.indexX = 1;
	vm.someClickHandler = someClickHandler;
	vm.dtOptions = DTOptionsBuilder.newOptions()
	.withDisplayLength(7)
	.withPaginationType('full_numbers')
	.withOption('stateSave', true)
	.withOption('responsive', true)
	.withOption('rowCallback', rowCallback)
.withDOM('ptp');//p:paginacion i:información trf:busqueda global l:numero de items defaul:lpfrtip
vm.dtColumnDefs = [
DTColumnDefBuilder.newColumnDef(0).notVisible(),
DTColumnDefBuilder.newColumnDef(1),
DTColumnDefBuilder.newColumnDef(2).withTitle('Nombre'),
DTColumnDefBuilder.newColumnDef(3).withTitle('Apellido')
];
$resource('https://l-lin.github.io/angular-datatables/data.json').query().$promise.then(function(persons) {
	vm.persons = persons;
});

vm.person2Add = _buildPerson2Add('','','');
vm.addPerson = addPerson;
vm.modifyPerson = modifyPerson;
vm.removePerson = removePerson;
function _buildPerson2Add(col1,col2,col3) {
	return {
		id: col1,
		firstName: col2,
		lastName: col3
	};
}
function addPerson() {
	vm.persons.push(angular.copy(vm.person2Add));

	Materialize.toast('Se agrego '+vm.person2Add.firstName , 4000 ,'toastSuccess');
	vm.person2Add = _buildPerson2Add('','','');
	$rootScope.fnModal('#modalFormTable','close','10%','10%');
//vm.person2Add = _buildPerson2Add(vm.person2Add.id + 1);
}
function modifyPerson(index) {
	vm.persons.splice(index, 1, angular.copy(vm.person2Add));
	Materialize.toast('Se modifico '+vm.person2Add.firstName , 4000 ,'toastSuccess');
	$rootScope.fnModal('#modalFormTable','close','10%','10%');
	vm.person2Add = _buildPerson2Add('','','');
	vm.editarDatoTabla = false;
}
function removePerson(index) {
	vm.persons.splice(index, 1);
	Materialize.toast('Se elimino '+vm.person2Add.firstName , 4000 ,'toastSuccess');
	vm.person2Add = _buildPerson2Add('','','');
}
function someClickHandler(info) {
	vm.indexX = info[0];
	vm.person2Add = _buildPerson2Add(Number(info[1]),info[2],info[3])
}
function rowCallback(nRow, aData, iDisplayIndex, iDisplayIndexFull) {
// Unbind first in order to avoid any duplicate handler (see https://github.com/l-lin/angular-datatables/issues/87)
$('td.c', nRow).unbind('click');
$('td.c', nRow).bind('click', function() {
	$scope.$apply(function() {
		vm.editarDatoTabla = true;
		$rootScope.fnModal('#modalFormTable','open','10%','10%');
		vm.someClickHandler(aData);
	});
});
return nRow;
}
if ($(document).width()<600) {
	vm.dtOptions = DTOptionsBuilder.newOptions()
	.withDisplayLength(9999)
	.withPaginationType('full_numbers')
	.withOption('stateSave', true)
	.withOption('responsive', true)
	.withOption('rowCallback', rowCallback)
	.withDOM('fptp');
}

setTimeout(function(){
	$('.tooltipped').tooltip({delay: 50});
},2000)

}