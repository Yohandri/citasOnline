$(document).ready(function(){

//$('select').addClass('browser-default');
fnMsj('Bienvenidos!','toastInfo',4000);
$('.capa').css('display','none');

$(".button-collapse").sideNav();
//$('select').material_select();
$('.datepicker').pickadate({
	selectMonths: true,
	selectYears: 15
});

setTimeout(function(){
	//$('.progress').css('visibility','hidden');
//$('select').addClass('browser-default');
},4000);
setTimeout(function(){
	$('select').material_select();
},0);
$('.btnLogin').click(function(){
	$('.loginCard').toggleClass('mostrarCardLogin');
	$('.cortina').toggleClass('mostrarBlock');
	$('#userLogin').focus();
});
$('.btnChangePass').click(function(){
	$(this).hide();
	$('.passChange').removeClass('hidden');
	setTimeout(function(){
		$('.btnChangePass').show();
		$('.passChange').addClass('hidden');
	},59000);
});

});

$('.btnSidebar').click(function(e){
	$('.btnSidebar').removeClass('active');
	$(this).addClass('active');
	$('.button-collapse').sideNav('hide');
});
function openModalTable(){
	$('select').material_select();
	$('.modal,.modal-content').animate({scrollTop: 0}, 'slow');
	$('*').removeClass('classInputFail');
	$('.modal').modal({
		dismissible: false, 
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
	$('#modalFormTable').modal('open');
}
fnProgress(0);
function fnProgress(accion){
	if (accion === 1) {
		$('.progress').css('visibility','visible');
		$('.capa').css('display','block');
		$('body').css('cursor','wait');
		$('a').css('cursor','wait');
		$('a').attr('disabled','disabled');
	}
	if (accion === 0) {
		$('.progress').css('visibility','hidden');
		$('.capa').css('display','none');
		$('body').css('cursor','default');
		$('a').css('cursor','pointer');
		$('a').removeAttr('disabled');
	}
}
function fnMsj(msj,tipo,time){
	if (time === undefined) {
		time = 4000;
	}
	if (tipo === undefined) {
		tipo = 'toastInfo';
	}
	if (msj === undefined) {
		msj = 'toast';
	}
	Materialize.toast(msj , time ,tipo);
}

