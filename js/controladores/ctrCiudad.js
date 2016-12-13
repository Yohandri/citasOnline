app.controller("ciudades", function($scope, $routeParams, $rootScope){
	$rootScope.btnBack = true;
	$rootScope.$titulo = 'Lista de ciudades';
});
app.controller("dataTableCiudades", datatableCiudad);

function datatableCiudad(DTOptionsBuilder, DTColumnDefBuilder, $resource, $scope, $rootScope,$http) {
	var vm = this;

		if ($(document).width()<600) {
			vm.dtOptions = DTOptionsBuilder.newOptions()
			.withDisplayLength(9999)
			.withPaginationType('simple')
			.withOption('stateSave', true)
			.withOption('responsive', true)
			.withOption('rowCallback', rowCallback)
			.withDOM('f');
		}else{
			vm.dtOptions = DTOptionsBuilder.newOptions()
			.withDisplayLength(9)
			.withPaginationType('full_numbers')
			.withOption('responsive', true)
			.withOption('rowCallback', rowCallback)
			.withOption('stateSave', false)
			.withOption('retrieve', true)
			.withDOM('ptrftp');
		}

	

	vm.dtColumnDefs = [
	DTColumnDefBuilder.newColumnDef(0).notSortable(),
	DTColumnDefBuilder.newColumnDef(1).notVisible().notSortable(),
	DTColumnDefBuilder.newColumnDef(2).withTitle('Zona'),
	DTColumnDefBuilder.newColumnDef(3).withTitle('Ciudad'),
	DTColumnDefBuilder.newColumnDef(4).notVisible()
	];

	vm.settingTabla = {
		pathList: 'json/ciudad/controlador.php?tipo=seleccionarTodo',
		path: 'json/ciudad/controlador.php',
		campos: {
			editables: function(col1,col2,col3){
				return {
					Id: col1,
					Zona: col2,
					Ciudad: col3
				}
			},
			someClickHandler: function(info){
				vm.indexX = info[4];
				vm.person2Add = vm.settingTabla.campos.editables(Number(info[1]),info[2],info[3]);
			}
		},
		tituloModalAdd: 'Agregar zona ciudad',
		tituloModalEdit: 'Editor de la tabla ciudad'
	}


	vm.tituloModal = vm.settingTabla.tituloModalAdd;
	vm.editarDatoTabla = false;
	vm.indexX = 1;
	vm.someClickHandler = vm.settingTabla.campos.someClickHandler;
	vm.person2Add = vm.settingTabla.campos.editables('','','');
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

	$resource($rootScope.setting.dominio+vm.settingTabla.pathList).query().$promise.then(function(response) {
		vm.datos = response;
		fnProgress(0);
	},function(){
		Materialize.toast('No hay respuesta del servidor' , 10000 ,'toastDanger');
		fnProgress(0);
	});
	function addPerson() {
		$http({
			url: $rootScope.setting.dominio+vm.settingTabla.path, 
			method: "GET",
			params: {'tipo': 'registrar','objetos': angular.toJson([vm.person2Add])}
		}).then(function(response) {
			var respuesta = response.data;
			if (respuesta === 'true' ) {
				//vm.datos.push(angular.copy(vm.person2Add));
				Materialize.toast('Se agrego '+vm.person2Add.Zona , 4000 ,'toastSuccess');
				$rootScope.fnModal('#modalFormTable','close','10%','10%');
				vm.person2Add = vm.settingTabla.campos.editables('','','');
				vm.dtInstance.DataTable.page(0).draw();
				vm.dtInstance.DataTable.order([0, 'desc']).draw();
				setTimeout(function(){
					vm.rerender(0);
				},500);
			}else{
				Materialize.toast('no se puede registrar' , 4000 ,'toastDanger');
			}
		},function(){
			Materialize.toast('No hay respuesta del servidor' , 4000 ,'toastDanger');
		});

	}

	function modifyPerson(index) {
		$http({
			url: $rootScope.setting.dominio+vm.settingTabla.path, 
			method: "GET",
			params: {'tipo': 'modificar', 'objetos': angular.toJson([vm.person2Add])}
		}).then(function(response) {
			var respuesta = response.data;
			if (respuesta === 'true' ) {
				vm.datos.splice(index, 1, angular.copy(vm.person2Add));
				Materialize.toast('Se modifico '+vm.person2Add.Zona+' '+vm.person2Add.Ciudad , 4000 ,'toastSuccess');
				$rootScope.fnModal('#modalFormTable','close','10%','10%');
				vm.person2Add = vm.settingTabla.campos.editables('','','');
				vm.editarDatoTabla = false;
				vm.tituloModal = vm.settingTabla.tituloModalAdd;
				//vm.dtOptions = DTOptionsBuilder.newOptions().withPaginationType('simple').draw();
				//vm.dtOptions.sPaginationType = 'simple';
				console.log(vm.dtOptions);
				setTimeout(function(){
					vm.rerender(index);
				},500);
			}else{
				Materialize.toast('no se puede editar' , 4000 ,'toastDanger');
			}
		});
	}
	function removePerson(index,id) {
		$http({
			url: $rootScope.setting.dominio+vm.settingTabla.path, 
			method: "GET",
			params: {'tipo': 'eliminar','Id': id}
		}).then(function(response) {
			var respuesta = response.data;
			if (respuesta === 'true' ) {
				vm.datos.splice(index, 1);
				Materialize.toast('Se elimino ' , 4000 ,'toastSuccess');
				vm.person2Add = vm.settingTabla.campos.editables('','','');
				setTimeout(function(){
					vm.rerender();
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
			params: {'tipo': 'eliminar','Id': vm.itemsDelete.toString() }
		}).then(function(response) {
			var respuesta = response.data;
			if (respuesta === 'true' ) {
				Materialize.toast('Se elimino ' , 4000 ,'toastSuccess');
				vm.person2Add = vm.settingTabla.campos.editables('','','');
				rerender();
			}else{
				Materialize.toast('no se elimino' , 4000 ,'toastDanger');
			}
		});


	}
	function rerender(index) {
		$resource($rootScope.setting.dominio+vm.settingTabla.pathList).query().$promise.then(function(response) {
			vm.datos = response;
			vm.resaltarItem(index);
			
		},function(){
			Materialize.toast('No hay respuesta del servidor' , 10000 ,'toastDanger');
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
		fnProgress(1);
	setTimeout(function(){
		$('.tooltipped').tooltip({delay: 50});
	},2000);

}
app.filter('filterByProperty', function () {
        /* array is first argument, each addiitonal argument is prefixed by a ":" in filter markup*/
        return function (dataArray, searchTerm, propertyName) {
            if (!dataArray) return;
            /* when term is cleared, return full array*/
            if (!searchTerm) {
                return dataArray
            } else {
                /* otherwise filter the array */
                var term = searchTerm.toLowerCase();
                return dataArray.filter(function (item) {
                    return item[propertyName].toLowerCase().indexOf(term) > -1;
                });
            }
        }
    });