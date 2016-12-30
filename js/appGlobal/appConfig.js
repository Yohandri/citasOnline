app.run(function($rootScope, $route, $location, $localStorage, $window, DTDefaultOptions,$http,$interval,datosSelect) { 
	$rootScope.fnBuscarCita = function(url){
		$location.path(url);
		Materialize.toast('Buscando citas', 4000, 'toastInfo');
	}

	$rootScope.btnBack = false;
	$rootScope.crearCuenta = false;
	$rootScope.online = false;
	$rootScope.dataSearch = {};
	$rootScope.setting = {dominio: 'http://192.168.0.102:8080/'};
	$rootScope.errorInput = {userError: '',passError:''};

	$rootScope.localStorage = $localStorage.$default({
		cliente:{ci:'Cliente', x:false},usuario:{x:false}
	});
	$rootScope.dataCliente = $rootScope.localStorage.cliente;
	$rootScope.loginBtn = function(btn){
	fnProgress(1);
	$('#userLogin,#passLogin').removeClass('classInputFail');
		$http({
			url: $rootScope.setting.dominio+'sesion/controlador.php', 
			method: "GET",
			params: {'tipo': 'login', 'objetos': angular.toJson([$rootScope.localStorage.usuario])}
		}).then(function(response) {
			$rootScope.errorInput.userError = '';
			$rootScope.errorInput.passError = '';
			if (response.status === 200) {
				$rootScope.localStorage.usuario = response.data[0].data[0];
				fnProgress(0);
				fnMsj('Bienvenido '+$rootScope.localStorage.usuario.Nombre,'toastSuccess');
				if ($location.path() === '/reservar' || $location.path() === '/search') {

				}
				if (btn === 'btn') {
					if ($location.path() === '/reservar' || $location.path() === '/search') {

					}else{
						$location.path('/');
						$('.btnSidebar').removeClass('active');
					}
					
				}
				if(btn === undefined) {
					if ($location.path() === '/reservar' || $location.path() === '/search') {
						$('.loginCard').toggleClass('mostrarCardLogin');
						$('.cortina').toggleClass('mostrarBlock');
					}else{
						$('.loginCard').toggleClass('mostrarCardLogin');
						$('.cortina').toggleClass('mostrarBlock');
						$location.path('/');
						$('.btnSidebar').removeClass('active');
					}
				}
				
			}
			if (response.status === 201) {
				fnMsj(response.statusText,'toastDanger', 5000);
				fnProgress(0);
				if (response.data[0].data.campo === 'Usuario') {
					$('#userLogin').addClass('classInputFail');
					$rootScope.errorInput.userError = 'classInputFail';
				}
				if (response.data[0].data.campo === 'Clave') {
					$('#passLogin').addClass('classInputFail');
					$rootScope.errorInput.passError = 'classInputFail';
				}
			}
		},function(response){
			if (response.status === 401) {
				$rootScope.errorInput.userError = false;
				$rootScope.errorInput.passError = false;		
				fnMsj(response.statusText,'toastDanger', 5000);
				if (response.data[0].data.campo === 'Usuario') {
					$rootScope.errorInput.userError = 'classInputFail';			
				}
				if (response.data[0].data.campo === 'Clave') {
					$('#passLogin').addClass('classInputFail');
					$rootScope.errorInput.passError = 'classInputFail';	
				}
			}
			fnProgress(0);
		});

	}
	$rootScope.cerrarSession = function(){
		fnProgress(1);
		$http({
			url: $rootScope.setting.dominio+'sesion/controlador.php', 
			method: "GET",
			params: {'tipo': 'logout', 'token': $rootScope.localStorage.usuario.token}
		}).then(function(response) {
			Materialize.toast('Hasta pronto '+$rootScope.localStorage.usuario.Nombre , 4000, 'toastInfo');
			$rootScope.localStorage.usuario = response.data.data;
			fnProgress(0);
			$('.loginCard').toggleClass('mostrarCardLogin');
			$('.cortina').toggleClass('mostrarBlock');
			$location.path('/');
			$('.btnSidebar').removeClass('active');
		},function(){
			fnMsj('No hay respuesta del servidor','toastDanger', 5000);
			fnProgress(0);
		});
	
			
	}
	$rootScope.btnCrearCuenta = function(){
		$rootScope.crearCuenta = true;
	}
	$rootScope.btnCancelar = function(){
		$rootScope.crearCuenta = false;
	}
	$rootScope.cerrarLoginCard = function(){
		$rootScope.crearCuenta = false;
	}
	$rootScope.callBack = function(){
		$window.history.back();
		$('.tooltipped').tooltip('remove');
	}
	$rootScope.fnHome = function(url){
		$location.path(url);
	}
	$rootScope.fnSelectClient = function(){
		$('.modal').modal({
			dismissible: true, 
			opacity: .5, 
			in_duration: 300, 
			out_duration: 200, 
			starting_top: '4%',
			ending_top: '10%', 
			ready: function(modal, trigger) { 
			},
			complete: function() {  } 
		}
		);
		$('#modalSelectClient').modal('open');
		$('#dataClienteN').focus();
	}
	$rootScope.fnCerrarScliente = function(){
		$rootScope.localStorage.cliente = {ci:'Cliente',x:false};
	}
	$rootScope.fnScliente = function(){
		if ($rootScope.localStorage.cliente.ci.length === 8) {
			$rootScope.localStorage.cliente.x = true;
			Materialize.toast('Cliente seleccionado ' + $rootScope.localStorage.cliente.ci + ' ', 4000, 'toastSuccess');
		}else{
			Materialize.toast('La cedula debe tener 8 digitos', 4000, 'toastDanger');
		}

	}
	$rootScope.fnModal = function(id, accion, pt, pb){
		$('*').removeClass('classInputFail');
		$('.modal,.modal-content').animate({scrollTop: 0}, 'slow');
		if (accion === 'open') {
			$('.modal').modal({
				dismissible: false, 
				opacity: .5, 
				in_duration: 300, 
				out_duration: 200, 
				starting_top: pt,
				ending_top: pb, 
				ready: function(modal, trigger) { 
				},
				complete: function() {  } 
			}
			);
			$(id).modal('open');
		}
		if (accion === 'close') {
			$(id).modal(accion);
		}

	}
	$rootScope.fnConexion = function(){
		$http({
				url: $rootScope.setting.dominio+'sesion/controlador.php', 
				method: "GET",
				params: {'tipo': 'online'}
			}).then(function(response) {
				if (response) {
					if (response.status === 200) {
						console.log('online');
						$rootScope.online = true;
					}
				}
			},function(){
			console.log('offline');
			$rootScope.online = false;
			fnProgress(0);
			});
	}
	$rootScope.fnValidarSesion = function(){
	$http({
			url: $rootScope.setting.dominio+'sesion/controlador.php', 
			method: "GET",
			params: {'tipo': 'validarSesion', 'token': $rootScope.localStorage.usuario.token}
		}).then(function(response) {
			if (response) {
				if (response.status === 200) {
					console.log('sesion OK');
				}
			}
		},function(response){
			if (response) {
				if (response.status === 401) {
					console.log('sesion OFF');
					$rootScope.localStorage.usuario = response.data[0].data;
					fnMsj(response.statusText,'toastDanger',5000);
				}
			}
		});
	}
	$rootScope.dataPublico = function(select,url){
			$http({
				url: $rootScope.setting.dominio+'publico', 
				method: "GET"
			}).then(function(response) {
				$rootScope.$selectTipoServicio  = datosSelect.renderDatos(response.data.tiposervicios);
				$rootScope.$selectZonaCiudad  = datosSelect.renderDatos(response.data.zonaciudad);
				$rootScope.$selectSeguro  = datosSelect.renderDatos(response.data.seguro);
				$rootScope.$selectSucursal  = datosSelect.renderDatos(response.data.sucursal);
				$rootScope.$selectTipoUsuario  = datosSelect.renderDatos(response.data.tipousuario);
				//console.log(response);
			});
	}
	$rootScope.fnConexion();
	$rootScope.fnValidarSesion();
	$rootScope.dataPublico();

	$interval(function() {$rootScope.fnConexion();}, 10000);

	setTimeout(function(){
		$('select').material_select();
	},100);
	 DTDefaultOptions.setLanguageSource('js/appGlobal/leng.json');
	// DTDefaultOptions.setLanguage({
	// 	sUrl: 'https://cdn.datatables.net/plug-ins/1.10.12/i18n/Spanish.json'
	// });
	//DTDefaultOptions.setDisplayLength(25);

});
app.config(function($routeProvider) {
	$routeProvider
	.when("/", {
		templateUrl : "templates/home.html",
		controller: 'home'
	})
	.when("/search", {
		templateUrl : "templates/search.html",
		controller: "search",
		controllerAs:"vm"
	})
	.when("/clientes/", {
		templateUrl : "templates/clientes.html",
		controller: 'clientes'
	})
	.when("/reservar", {
		templateUrl : "templates/reservarCita.html",
		controller: "reservarCitas"
	})
	.when("/ciudades/:key", {
		templateUrl : "templates/tablasBasicas.html",
		controller: 'ciudades'
	})
	.when("/tipoServicio/:key", {
		templateUrl : "templates/tablasBasicas.html",
		controller: 'tipoServicio'
	})
	.when("/seguro/:key", {
		templateUrl : "templates/tablasBasicas.html",
		controller: 'seguro'
	}).when("/servicio/:key", {
		templateUrl : "templates/tablasBasicas.html",
		controller: 'servicio'
	}).when("/sucursal/:key", {
		templateUrl : "templates/tablasBasicas.html",
		controller: 'sucursal'
	}).when("/tipousuario/:key", {
		templateUrl : "templates/tablasBasicas.html",
		controller: 'tipousuario'
	}).when("/usuario/:key", {
		templateUrl : "templates/tablasBasicas.html",
		controller: 'usuario'
	})
	.otherwise({template: '<h1>Error 404</h1>'});
});
app.service('datosSelect', function($rootScope,$http) {
	var self = this;
    self.renderDatos = function (datos) {
        return datos;
    }
    self.renderSelect = function (datos) {		
    	return datos;
    }
});
function dataTableTB(DTOptionsBuilder, DTColumnDefBuilder, $resource, $scope, $rootScope,$http,$location) {	
	var vm = this;
	$rootScope.vm = vm;
	fnColumnTabla();
	vm.settingTabla = $rootScope.settingTabla;
	
	vm.dtColumnDefs = $rootScope.columnTabla;

	vm.campos = vm.settingTabla.campos.formTabla();
	vm.tituloModal = vm.settingTabla.tituloModalAdd;
	vm.editarDatoTabla = false;
	vm.indexX = 1;
	vm.someClickHandler = someClickHandler;
	vm.person2Add = limpiarCampos();
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
			vm.campos = vm.settingTabla.campos.formTabla();
			//console.log(vm.datos);

					addForingKey('in');


					

		}
	},function(response){
		if (response.status === 401) {
			fnMsj(response.statusText,'toastDanger', 10000);
			fnProgress(0);
			$rootScope.localStorage.usuario = response.data.data;
		}
		if (response.status === -1) {
			$location.path('/');
			fnMsj('No hay respuesta del servidor','toastDanger', 10000);
			$('.btnSidebar').removeClass('active');
		}
		
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
					vm.person2Add = limpiarCampos();
				},500);
			}
			if (response.status === 201) {
				console.log(response.data[0].data[0].mensaje);

				fnProgress(0);
				fnMsj(response.data[0].data[0].mensaje,'toastDanger', 5000);
				$('input[name='+response.data[0].data[0].campo+']').addClass('classInputFail');
			}
		},function(response){
			$rootScope.fnModal('#modalFormTable','close','10%','10%');
			vm.person2Add = limpiarCampos();
			if (response.status === 401) {
				$rootScope.localStorage.usuario = response.data[0].data;
				fnMsj(response.statusText,'toastDanger',5000);
			}else{
				Materialize.toast('No hay respuesta del servidor' , 4000 ,'toastDanger');
			}
			console.log(response);
			
			fnProgress(0);
		});
	}

	function modifyPerson(index) {
		fnProgress(1);
		$('*').removeClass('classInputFail');
		addForingKey('out');
		console.log(angular.toJson([vm.person2Add]));
		$http({
			url: $rootScope.setting.dominio+vm.settingTabla.path, 
			method: "GET",
			params: {'token':$rootScope.localStorage.usuario.token,'tipo': 'modificar', 'objetos': angular.toJson([vm.person2Add])}
		}).then(function(response) {
			console.log(response);
			if (response.data[0].mensaje === true ) {
				setTimeout(function(){
					vm.rerender(index,'Se modifico satisfactoriamente');
					$rootScope.fnModal('#modalFormTable','close','10%','10%');
					vm.editarDatoTabla = false;
					vm.tituloModal = vm.settingTabla.tituloModalAdd;
					vm.person2Add = limpiarCampos();
				},500);
			}
			if (response.status === 201) {
				console.log(response.data[0].data[0].mensaje);

				fnProgress(0);
				fnMsj(response.data[0].data[0].mensaje,'toastDanger', 5000);
				$('input[name='+response.data[0].data[0].campo+']').addClass('classInputFail');
			}
		},function(response){
			if (response.status === 401) {
				fnMsj(response.statusText,'toastDanger',5000);
				$rootScope.fnModal('#modalFormTable','close','10%','10%');
				$rootScope.localStorage.usuario = response.data[0].data;
			}
			console.log(response);
			
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
				vm.person2Add = limpiarCampos();
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
					setTimeout(function(){
						$('select').material_select();
					},0);
				$('*').removeClass('classInputFail');
				vm.editarDatoTabla = true;
				vm.tituloModal = vm.settingTabla.tituloModalEdit;
				$rootScope.fnModal('#modalFormTable','open','10%','10%');
				someClickHandler(aData);
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
				vm.person2Add = limpiarCampos();
				vm.selectedViews = false;
			}else{
				fnMsj('No se puede eliminar','toastDanger');
			}
		},function(response){
			if (response.status === 401) {
				$rootScope.localStorage.usuario = response.data[0].data;
				fnMsj(response.statusText,'toastDanger',5000);
			}
			console.log(response);
			
			fnProgress(0);
		});


	}
	function rerender(index,msj) {
		$resource($rootScope.setting.dominio+vm.settingTabla.pathList).query().$promise.then(function(response) {
			vm.datos = response[0].data;
			vm.resaltarItem(index);
			fnProgress(0);
			fnMsj(msj,'toastSuccess');
			addForingKey('in');
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
		vm.person2Add = limpiarCampos();
		vm.tituloModal = vm.settingTabla.tituloModalAdd;
		vm.editarDatoTabla = false;
		$('*').removeClass('classInputFail');
	}
	function addForingKey(accion){
		angular.forEach(vm.datos, function(value, key) {
			var interacion = key;
			if (accion === 'out') {
				angular.forEach($rootScope.settingTabla.campos.formTabla(), function(value, key) {
					if (value.foreignKey === true) {
						var campoVariable = eval('vm.person2Add.'+value.col);
						var campoConca = eval('value.col');
						angular.forEach(value.option, function(value, key) {
							if (value.Nombre === campoVariable) {
								eval('vm.person2Add.'+campoConca+' = '+'value.Id');	
							}
						});
					}
				});
			}
			if (accion === 'in') {
				angular.forEach($rootScope.settingTabla.campos.formTabla(), function(value, key) {
					if (value.foreignKey === true) {
						var campoVariable = eval('vm.datos[interacion].'+value.col);
						var campoConca = eval('value.col');
						angular.forEach(value.option, function(value, key) {
							if (value.Id === campoVariable) {
								eval('vm.datos[interacion].'+campoConca+' = '+'value.Nombre');
							}
						});
					}	  
				});
			}
		});
	}
	function fnColumnTabla(){
		var campos = $rootScope.settingTabla.campos.formTabla();
		$rootScope.columnTabla = [
		DTColumnDefBuilder.newColumnDef(0).notVisible().notSortable(),
		DTColumnDefBuilder.newColumnDef(1).notSortable(),
		DTColumnDefBuilder.newColumnDef(2).notVisible().notSortable()
		];
		angular.forEach(campos, function(value, key) {
			var pro = value.tituloInput;
			var position = Number(key+3);
			$rootScope.columnTabla.push(DTColumnDefBuilder.newColumnDef(position).withTitle(pro));				
		});

	}
	function editables(info){
		var i = {};
		var campos = vm.settingTabla.campos.formTabla();
		angular.forEach(campos, function(value, key) {
			var pro = value.col;
			var position = Number(key+1);
			if (key === 0) {
				i['Id'] = info[0];
			}
			angular.forEach(info, function(value, key) {
				if (key === position) {
					i[pro] = info[position];
				}						
			},i);
		});
		return i
	}
	function limpiarCampos(){
		var campos = vm.settingTabla.campos.formTabla();
		var i = {};
		angular.forEach(campos, function(value, key) {
			var pro = value.col;
			var position = Number(key);
			if (key === 0) {
				i['Id'] = '';
			}
			if (key === position) {
				i[pro] = '';
			}						
		}, i );
		console.log(i);
		return editables(i);
	}
	function someClickHandler(info){
		$rootScope.vm.indexX = info[0];
		var informacion = [];
		angular.forEach(info, function(value, key) {
			this.push(eval('info['+(key+2)+']'));
		}, informacion);
		$rootScope.vm.person2Add = editables(informacion);
	}

	fnProgress(1);
	setTimeout(function(){
		$('.tooltipped').tooltip({delay: 50});
		$('select').material_select();
	},2000);
}