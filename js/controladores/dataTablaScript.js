var vm = this;
vm.settingTabla = {
		pathList: 'tablas/tiposervicios/controlador.php?tipo=seleccionarTodo&token='+$rootScope.localStorage.usuario.token,
		path: 'tablas/tiposervicios/controlador.php',
		campos: {
			editables: function(col1,col2){
				return {
					Id: col1,
					Nombre: col2
				}
			},
			someClickHandler: function(info){
				vm.indexX = info[0];
				vm.person2Add = this.editables(Number(info[2]),info[3]);
			},
			formTabla: function(){
				return [
					{col:'Nombre', tituloInput:'Nombre del tipo de servicio'}
				]
			},
			limpiarCampos: function(){
				return this.editables('','');
			}
		},
		tituloModalAdd: 'Agregar Tipo de servicio',
		tituloModalEdit: 'Editar Tipo de servicio'
	}

	vm.dtColumnDefs = [
		DTColumnDefBuilder.newColumnDef(0).notVisible().notSortable(),
		DTColumnDefBuilder.newColumnDef(1).notSortable(),
		DTColumnDefBuilder.newColumnDef(2).notVisible().notSortable(),
		DTColumnDefBuilder.newColumnDef(3).withTitle('Nombre del tipo de servicio')
	];
vm.campos = vm.settingTabla.campos.formTabla();
vm.tituloModal = vm.settingTabla.tituloModalAdd;
vm.editarDatoTabla = false;
vm.indexX = 1;
vm.someClickHandler = vm.settingTabla.campos.someClickHandler;
vm.person2Add = vm.settingTabla.campos.limpiarCampos();
vm.addPerson = addPerson;
vm.modifyPerson = modifyPerson;
vm.removePerson = removePerson;
vm.dtInstance = {};
vm.selected = {};
vm.selectAll = false;
vm.toggleAll = toggleAll;
vm.toggleOne = toggleOne;
vm.arrayDelete = arrayDelete;
vm.rerender = rerender;
vm.itemsDelete = [];
vm.fnSeleccionViews = fnSeleccionViews;
vm.selectedViews = false;
vm.stateChanged = stateChanged;
vm.resaltarItem = resaltarItem;
vm.cerrarModal = fnCerrarModal;


if ($(document).width()<600) {
	vm.dtOptions = DTOptionsBuilder.newOptions()
	.withDisplayLength(9999)
	.withPaginationType('simple')
	.withOption('stateSave', false)
	.withOption('responsive', true)
	.withOption('rowCallback', rowCallback)
	.withOption('retrieve', true)
	.withDOM('f');
}else{
	vm.dtOptions = DTOptionsBuilder.newOptions()
	.withDisplayLength(12)
	.withPaginationType('full_numbers')
	.withOption('responsive', true)
	.withOption('rowCallback', rowCallback)
	.withOption('stateSave', true)
	.withOption('retrieve', true)
	.withDOM('ptrftp');
}

$resource($rootScope.setting.dominio+vm.settingTabla.pathList).query().$promise.then(function(response) {
	if (response[0].x === false) {
		$rootScope.localStorage.usuario = response;
		fnMsj(response[0].mensaje,'toastDanger',5000);
		fnProgress(0);
		$location.path('/');
		$('.btnSidebar').removeClass('active');
	}else{
		vm.datos = response[0].data;
		fnProgress(0);
	}
},function(response){
	if (response.status === 401) {
		fnMsj(response.statusText,'toastDanger', 10000);
		fnProgress(0);
		$rootScope.localStorage.usuario = response.data.data;
	}
	$location.path('/');
	$('.btnSidebar').removeClass('active');
});
function addPerson() {
	fnProgress(1);
	$('*').removeClass('classInputFail');
	$http({
		url: $rootScope.setting.dominio+vm.settingTabla.path, 
		method: "GET",
		params: {'token':$rootScope.localStorage.usuario.token,'tipo': 'registrar','objetos': angular.toJson([vm.person2Add])}
	}).then(function(response) {
		if (response.data[0].mensaje === true ) {				
			vm.dtInstance.DataTable.page(0).draw();
			vm.dtInstance.DataTable.order([1, '']).draw();
			setTimeout(function(){
				vm.rerender(0,'Se agrego satisfactoriamente');
				$rootScope.fnModal('#modalFormTable','close','10%','10%');
				vm.person2Add = vm.settingTabla.campos.limpiarCampos();
			},500);
		}
		if (response.status === 201) {
			console.log(response.data[0].data[0].mensaje);

			fnProgress(0);
			fnMsj(response.data[0].data[0].mensaje,'toastDanger', 5000);
			$('input[name='+response.data[0].data[0].campo+']').addClass('classInputFail');
		}
	},function(){
		Materialize.toast('No hay respuesta del servidor' , 4000 ,'toastDanger');
		$rootScope.fnModal('#modalFormTable','close','10%','10%');
		vm.person2Add = vm.settingTabla.campos.limpiarCampos();
		fnProgress(0);
	});
}

function modifyPerson(index) {
	fnProgress(1);
	$('*').removeClass('classInputFail');
	$http({
		url: $rootScope.setting.dominio+vm.settingTabla.path, 
		method: "GET",
		params: {'token':$rootScope.localStorage.usuario.token,'tipo': 'modificar', 'objetos': angular.toJson([vm.person2Add])}
	}).then(function(response) {
		if (response.data[0].mensaje === true ) {
			setTimeout(function(){
				vm.rerender(index,'Se modifico satisfactoriamente');
				$rootScope.fnModal('#modalFormTable','close','10%','10%');
				vm.editarDatoTabla = false;
				vm.tituloModal = vm.settingTabla.tituloModalAdd;
				vm.person2Add = vm.settingTabla.campos.limpiarCampos();
			},500);
		}
		if (response.status === 201) {
			console.log(response.data[0].data[0].mensaje);

			fnProgress(0);
			fnMsj(response.data[0].data[0].mensaje,'toastDanger', 5000);
			$('input[name='+response.data[0].data[0].campo+']').addClass('classInputFail');
		}
	},function(response){
		console.log(response);
		fnMsj('No hay respuesta del servidor','toastDanger',5000);
		fnProgress(0);
	});
}
function removePerson(index,id) {
	fnProgress(1);
	$http({
		url: $rootScope.setting.dominio+vm.settingTabla.path, 
		method: "GET",
		params: {'tipo': 'eliminar','Id': id}
	}).then(function(response) {
		var respuesta = response.data;
		if (respuesta === 'true' ) {
			vm.datos.splice(index, 1);
			vm.person2Add = vm.settingTabla.campos.limpiarCampos();
			setTimeout(function(){
				vm.rerender();
				Materialize.toast('Se elimino ' , 4000 ,'toastSuccess');
			},500);
		}else{
			Materialize.toast('no se elimino' , 4000 ,'toastDanger');
		}
	});
}
function rowCallback(nRow, aData, iDisplayIndex, iDisplayIndexFull) {
	$('td.c', nRow).unbind('click');
	$('td.c', nRow).bind('click', function() {
		$scope.$apply(function() {
			vm.editarDatoTabla = true;
			vm.tituloModal = vm.settingTabla.tituloModalEdit;
			$rootScope.fnModal('#modalFormTable','open','10%','10%');
			vm.settingTabla.campos.someClickHandler(aData);
		});
	});
	return nRow;
}
function toggleAll (selectAll, selectedItems) {
	for (var id in selectedItems) {
		if (selectedItems.hasOwnProperty(id)) {
			selectedItems[id] = selectAll;
		}
	}
}
function toggleOne (selectedItems,$index) {
	for (var id in selectedItems) {
		if (selectedItems.hasOwnProperty(id)) {
			if(!selectedItems[id]) {
				vm.selectAll = false;
				return;
			}
		}
	}
	vm.selectAll = true;
}
function stateChanged(qId,index) {
	if(vm.selected[qId]){
		$('.tabTr'+index).addClass('seleccion');
	}else{
		$('.tabTr'+index).removeClass('seleccion');
	}
}
function fnSeleccionViews(self,index){
	vm.selectedViews = false;
	$.each( vm.selected, function( key, value ) {
		if (value === true) {
			vm.selectedViews = true;
			return;
		}
	});
}
function arrayDelete(obj,index){
	vm.itemsDelete = [];
	$.each( obj, function( key, value ) {
		if (value === true) {
			vm.itemsDelete.push(Number(key));
		}
	});
	alert('Se eliminará estos ids: '+vm.itemsDelete);
	$http({
		url: $rootScope.setting.dominio+vm.settingTabla.path, 
		method: "GET",
		params: {'token':$rootScope.localStorage.usuario.token,'tipo': 'eliminar','Id': vm.itemsDelete.toString() }
	}).then(function(response) {
		var respuesta = response.data;
		if (respuesta[0].mensaje === true ) {				
			rerender(null,'Se elimino satisfactoriamente');
			vm.person2Add = vm.settingTabla.campos.limpiarCampos();
			vm.selectedViews = false;
		}else{
			fnMsj('No se puede eliminar','toastDanger');
		}
	});


}
function rerender(index,msj) {
	$resource($rootScope.setting.dominio+vm.settingTabla.pathList).query().$promise.then(function(response) {
		vm.datos = response[0].data;
		vm.resaltarItem(index);
		fnProgress(0);
		fnMsj(msj,'toastSuccess');	
	},function(){
		fnMsj('No hay respuesta del servidor','toastDanger',5000);
	});

};
function resaltarItem(index){
	setTimeout(function(){
		$('.tabTr'+index).addClass('accionSuccess');
	},500);
	setTimeout(function(){
		$('.tabTr'+index).removeClass('accionSuccess');
	},4000);
}
function fnCerrarModal() {
	vm.person2Add = vm.settingTabla.campos.limpiarCampos();
	vm.tituloModal = vm.settingTabla.tituloModalAdd;
	vm.editarDatoTabla = false;
}


fnProgress(1);
setTimeout(function(){
	$('.tooltipped').tooltip({delay: 50});
},2000);


function datatableCiudad(DTOptionsBuilder, DTColumnDefBuilder, $resource, $scope, $rootScope,$http,$location) {
	var vm = this;

	vm.settingTabla = {
		pathList: 'tablas/zonaciudad/controlador.php?tipo=seleccionarTodo&token='+$rootScope.localStorage.usuario.token,
		path: 'tablas/zonaciudad/controlador.php',
		campos: {
			editables: function(col1,col2,col3){
				return {
					Id: col1,
					Zona: col2,
					Ciudad: col3
				}
			},
			someClickHandler: function(info){
				vm.indexX = info[0];
				vm.person2Add = vm.settingTabla.campos.editables(Number(info[2]),info[3],info[4]);
			},
			formTabla: function(){
				return [
					{col:'Zona', tituloInput:'Zona'},
					{col:'Ciudad', tituloInput:'Ciudad'}
				]
			},
			limpiarCampos: function(){
				return vm.settingTabla.campos.editables('','','');
			}
		},
		tituloModalAdd: 'Agregar zona ciudad',
		tituloModalEdit: 'Editar zona ciudad'
	}

	vm.dtColumnDefs = [
		DTColumnDefBuilder.newColumnDef(0).notVisible().notSortable(),
		DTColumnDefBuilder.newColumnDef(1).notSortable(),
		DTColumnDefBuilder.newColumnDef(2).notVisible().notSortable(),
		DTColumnDefBuilder.newColumnDef(3).withTitle('Zona'),
		DTColumnDefBuilder.newColumnDef(4).withTitle('Ciudad')
	];

	vm.campos = vm.settingTabla.campos.formTabla();
	vm.tituloModal = vm.settingTabla.tituloModalAdd;
	vm.editarDatoTabla = false;
	vm.indexX = 1;
	vm.someClickHandler = vm.settingTabla.campos.someClickHandler;
	vm.person2Add = vm.settingTabla.campos.limpiarCampos();
	vm.addPerson = addPerson;
	vm.modifyPerson = modifyPerson;
	vm.removePerson = removePerson;
	vm.dtInstance = {};
	vm.selected = {};
	vm.selectAll = false;
	vm.toggleAll = toggleAll;
	vm.toggleOne = toggleOne;
	vm.arrayDelete = arrayDelete;
	vm.rerender = rerender;
	vm.itemsDelete = [];
	vm.fnSeleccionViews = fnSeleccionViews;
	vm.selectedViews = false;
	vm.stateChanged = stateChanged;
	vm.resaltarItem = resaltarItem;
	vm.cerrarModal = fnCerrarModal;

	if ($(document).width()<600) {
		vm.dtOptions = DTOptionsBuilder.newOptions()
		.withDisplayLength(9999)
		.withPaginationType('simple')
		.withOption('stateSave', false)
		.withOption('responsive', true)
		.withOption('rowCallback', rowCallback)
		.withOption('retrieve', true)
		.withDOM('f');
	}else{
		vm.dtOptions = DTOptionsBuilder.newOptions()
		.withDisplayLength(12)
		.withPaginationType('full_numbers')
		.withOption('responsive', true)
		.withOption('rowCallback', rowCallback)
		.withOption('stateSave', true)
		.withOption('retrieve', true)
		.withDOM('ptrftp');
	}

	$resource($rootScope.setting.dominio+vm.settingTabla.pathList).query().$promise.then(function(response) {
		if (response[0].x === false) {
			$rootScope.localStorage.usuario = response;
			fnMsj(response[0].mensaje,'toastDanger',5000);
			fnProgress(0);
			$location.path('/');
			$('.btnSidebar').removeClass('active');
		}else{
			vm.datos = response[0].data;
			fnProgress(0);
		}
	},function(response){
		if (response.status === 401) {
			fnMsj(response.statusText,'toastDanger', 10000);
			fnProgress(0);
			$rootScope.localStorage.usuario = response.data.data;
		}
		$location.path('/');
		$('.btnSidebar').removeClass('active');
	});
	function addPerson() {
		$('*').removeClass('classInputFail');
		fnProgress(1);
			$http({
				url: $rootScope.setting.dominio+vm.settingTabla.path, 
				method: "GET",
				params: {'token':$rootScope.localStorage.usuario.token,'tipo': 'registrar','objetos': angular.toJson([vm.person2Add])}
			}).then(function(response) {
				console.log(response);
				if (response.status === 201) {
					console.log(response.data[0].data[0].mensaje);

					fnProgress(0);
					fnMsj(response.data[0].data[0].mensaje,'toastDanger', 5000);
						$('input[name='+response.data[0].data[0].campo+']').addClass('classInputFail');
				}
				if (response.data[0].mensaje === true ) {				
					vm.dtInstance.DataTable.page(0).draw();
					vm.dtInstance.DataTable.order([1, '']).draw();
					setTimeout(function(){
						vm.rerender(0,'Se agrego satisfactoriamente');
						$rootScope.fnModal('#modalFormTable','close','10%','10%');
						vm.person2Add = vm.settingTabla.campos.limpiarCampos();
					},500);

				}
			},function(response){
				console.log(response);
				Materialize.toast('No hay respuesta del servidor' , 4000 ,'toastDanger');
				fnProgress(0);
			});
	
	}

	function modifyPerson(index) {
		fnProgress(1);
		$('*').removeClass('classInputFail');
		$http({
			url: $rootScope.setting.dominio+vm.settingTabla.path, 
			method: "GET",
			params: {'token':$rootScope.localStorage.usuario.token,'tipo': 'modificar', 'objetos': angular.toJson([vm.person2Add])}
		}).then(function(response) {
			if (response.data[0].mensaje === true ) {
				vm.datos.splice(index, 1, angular.copy(vm.person2Add));
				setTimeout(function(){
					vm.rerender(index,'Se modifico satisfactoriamente');
					$rootScope.fnModal('#modalFormTable','close','10%','10%');
					vm.editarDatoTabla = false;
					vm.tituloModal = vm.settingTabla.tituloModalAdd;
					vm.person2Add = vm.settingTabla.campos.limpiarCampos();
				},500);
			}
			if (response.status === 201) {
						console.log(response.data[0].data[0].mensaje);

						fnProgress(0);
						fnMsj(response.data[0].data[0].mensaje,'toastDanger', 5000);
							$('input[name='+response.data[0].data[0].campo+']').addClass('classInputFail');
					}
		},function(response){
			console.log(response);
				fnMsj('No hay respuesta del servidor','toastDanger',5000);
				fnProgress(0);
		});
	}
	function removePerson(index,id) {
		fnProgress(1);
		$http({
			url: $rootScope.setting.dominio+vm.settingTabla.path, 
			method: "GET",
			params: {'tipo': 'eliminar','Id': id}
		}).then(function(response) {
			var respuesta = response.data;
			if (respuesta === 'true' ) {
				vm.datos.splice(index, 1);
				vm.person2Add = vm.settingTabla.campos.limpiarCampos();
				setTimeout(function(){
					vm.rerender();
					Materialize.toast('Se elimino ' , 4000 ,'toastSuccess');
				},500);
			}else{
				Materialize.toast('no se elimino' , 4000 ,'toastDanger');
			}
		});
	}
	function rowCallback(nRow, aData, iDisplayIndex, iDisplayIndexFull) {
		$('td.c', nRow).unbind('click');
		$('td.c', nRow).bind('click', function() {
			$scope.$apply(function() {
				vm.editarDatoTabla = true;
				vm.tituloModal = vm.settingTabla.tituloModalEdit;
				$rootScope.fnModal('#modalFormTable','open','10%','10%');
				vm.settingTabla.campos.someClickHandler(aData);
			});
		});
		return nRow;
	}
	function toggleAll (selectAll, selectedItems) {
		for (var id in selectedItems) {
			if (selectedItems.hasOwnProperty(id)) {
				selectedItems[id] = selectAll;
			}
		}
	}
	function toggleOne (selectedItems,$index) {
		for (var id in selectedItems) {
			if (selectedItems.hasOwnProperty(id)) {
				if(!selectedItems[id]) {
					vm.selectAll = false;
					return;
				}
			}
		}
		vm.selectAll = true;
	}
	function stateChanged(qId,index) {
		if(vm.selected[qId]){
			$('.tabTr'+index).addClass('seleccion');
		}else{
			$('.tabTr'+index).removeClass('seleccion');
		}
	}
	function fnSeleccionViews(self,index){
		vm.selectedViews = false;
		$.each( vm.selected, function( key, value ) {
			if (value === true) {
				vm.selectedViews = true;
				return;
			}
		});
	}
	function arrayDelete(obj,index){
		vm.itemsDelete = [];
		$.each( obj, function( key, value ) {
			if (value === true) {
				vm.itemsDelete.push(Number(key));
			}
		});
		alert('Se eliminará estos ids: '+vm.itemsDelete);
		$http({
			url: $rootScope.setting.dominio+vm.settingTabla.path, 
			method: "GET",
			params: {'token':$rootScope.localStorage.usuario.token,'tipo': 'eliminar','Id': vm.itemsDelete.toString() }
		}).then(function(response) {
			var respuesta = response.data;
			if (respuesta[0].mensaje === true ) {				
				rerender(null,'Se elimino satisfactoriamente');
				vm.person2Add = vm.settingTabla.campos.limpiarCampos();
				vm.selectedViews = false;
			}else{
				fnMsj('No se puede eliminar','toastDanger');
			}
		});


	}
	function rerender(index,msj) {
		$resource($rootScope.setting.dominio+vm.settingTabla.pathList).query().$promise.then(function(response) {
			vm.datos = response[0].data;
			vm.resaltarItem(index);
			fnProgress(0);
			fnMsj(msj,'toastSuccess');	
		},function(){
			fnMsj('No hay respuesta del servidor','toastDanger',5000);
		});

	};
	function resaltarItem(index){
		setTimeout(function(){
				$('.tabTr'+index).addClass('accionSuccess');
			},500);
			setTimeout(function(){
				$('.tabTr'+index).removeClass('accionSuccess');
			},4000);
	}
	function fnCerrarModal() {
		vm.person2Add = vm.settingTabla.campos.limpiarCampos();
		vm.tituloModal = vm.settingTabla.tituloModalAdd;
		vm.editarDatoTabla = false;
	}
	fnProgress(1);
	setTimeout(function(){
		$('.tooltipped').tooltip({delay: 50});
	},2000);

}
