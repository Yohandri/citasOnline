app.run(function($rootScope, $route, $location, $localStorage, $window, DTDefaultOptions) { 
	$rootScope.fnBuscarCita = function(url){
		$location.path(url);
		Materialize.toast('Buscando citas', 4000, 'toastInfo');
	}

	$rootScope.btnBack = false;
	$rootScope.crearCuenta = false;
	$rootScope.dataSearch = {};

	$rootScope.localStorage = $localStorage.$default({
		cliente:{ci:'Cliente', x:false},usuario:{user: '', pass: '', x: false}
	});
	$rootScope.dataCliente = $rootScope.localStorage.cliente;
	$rootScope.loginBtn = function(btn){				
		if ($rootScope.localStorage.usuario.user === 'admin' && $rootScope.localStorage.usuario.pass === 'admin') {
			$rootScope.localStorage.usuario.x = true;
			if (btn != 'btn') {
				$('.loginCard').toggleClass('mostrarCardLogin');
				$('.cortina').toggleClass('mostrarBlock');				
			}
			Materialize.toast('Bienvenido '+$rootScope.localStorage.usuario.user , 4000, 'toastInfo');
		}else{
			Materialize.toast('Datos incorrectos', 4000, 'toastDanger');
		}
		if ($rootScope.localStorage.usuario.user === '' && $rootScope.localStorage.usuario.pass === '') {
			Materialize.toast('Complete los campos', 4000, 'toastDanger');
		}

	}
	$rootScope.cerrarSession = function(){
		$rootScope.localStorage.usuario.x = false;
		$rootScope.localStorage.usuario.user = '';
		$rootScope.localStorage.usuario.pass = '';
		Materialize.toast('Hasta pronto '+$rootScope.localStorage.usuario.user , 4000, 'toastInfo');
		$('.loginCard').toggleClass('mostrarCardLogin');
		$('.cortina').toggleClass('mostrarBlock');	
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
		if (accion === 'open') {
			$('.modal').modal({
				dismissible: true, 
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
	setTimeout(function(){
		$('select').material_select();
	},100);
	DTDefaultOptions.setLanguage({
		sUrl: 'https://cdn.datatables.net/plug-ins/1.10.12/i18n/Spanish.json'
	});
	DTDefaultOptions.setDisplayLength(25);
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
	});
});