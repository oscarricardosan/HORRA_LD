var vm;
function iniciar(){
    try{
        vm= new Vue({
            el: '#app',
            data: {
                url_apk_android: 'https://play.google.com/store/apps/details?id=savne.arh_soluciones.ahorra_led',
                url_savne: 'https://www.savne.net/',
                url_web: 'https://arhsoluciones.com/',
                error: 'Para hacer el calculo debes completar los campos en rojo',
                calculando: false,
                enviando_email: false,
                sources: {
                    LightBulbs: LightBulbs
                },
                data_email: {
                    name: null,
                    email: null,
                    phone: null
                },
                data_calculator:{
                    kmw_value: 0,
                    light_bulbs: []
                },
                data_result: {},
                show_result: false,
                month_days: 30,
            },
            methods:{
                calcular: function() {
                    this.calculando= true;
                    setTimeout(function(){
                        vm.data_result= {};
                        vm.data_result.costo_aprox_sis_actual= 0;
                        vm.data_result.costo_aprox_sis_led= 0;
                        vm.data_result.porcentaje_ahorro_mes= 0;
                        vm.data_result.val_inversion_reemplazo_por_led= 0;

                        $.each(vm.data_calculator.light_bulbs, function(index, bulb){
                            var convencional_consumo_mes= (bulb.bulb.potenciaW/1000)* bulb.active_hours * vm.month_days * bulb.count_bulbs;
                            var convencional_costo_mes=  convencional_consumo_mes * vm.data_calculator.kmw_value;
                            vm.data_result.costo_aprox_sis_actual+= convencional_costo_mes;

                            var led_consumo_mes= (bulb.bulb.potenciaW_Led/1000)* bulb.active_hours * vm.month_days * bulb.count_bulbs;
                            var led_costo_mes= led_consumo_mes * vm.data_calculator.kmw_value;
                            vm.data_result.costo_aprox_sis_led+= led_costo_mes;

                            var ahorro_costo= led_costo_mes - convencional_costo_mes;
                            var porcentaje_ahorro= (convencional_costo_mes - led_costo_mes)/convencional_costo_mes;
                            vm.data_result.porcentaje_ahorro_mes+= porcentaje_ahorro;

                            var valor_total_led= bulb.count_bulbs * bulb.bulb.valor_aprox_lampara_led;
                            vm.data_result.val_inversion_reemplazo_por_led+= valor_total_led;
                        });

                        vm.data_result.ahorro_aprox_mes= vm.data_result.costo_aprox_sis_actual - vm.data_result.costo_aprox_sis_led;
                        vm.data_result.porcentaje_ahorro_mes= (vm.data_result.porcentaje_ahorro_mes / vm.data_calculator.light_bulbs.length)*100;
                        vm.data_result.num_meses_retorno_inversion= vm.data_result.val_inversion_reemplazo_por_led / vm.data_result.ahorro_aprox_mes;

                        vm.calculando= false;
                        vm.show_result= true;
                    }, 1500);

                },
                enviarEmail: function(){
                    data= this.data_email;
                    data.data_calculator= this.data_calculator;
                    data.data_result= this.data_result;
                    this.enviando_email= true;
                    var request = $.ajax({
                        url: "http://arhsoluciones.com/simple_api/sendMail",
                        jsonp: "callback",
                        dataType: "jsonp",
                        contentType: "application/json",
                        data: vm.data_email,
                        crossDomain: true
                    });
                    request.done(function(respon){
                        alert(respon.message);
                        vm.enviando_email= false;
                    });
                    request.fail(function(jqXHR, textStatus) {
                        var msg = '';
                        if (jqXHR.status === 0) {
                            msg = 'Not connect.\n Verify Network.';
                        } else if (jqXHR.status == 404) {
                            msg = 'Requested page not found. [404]';
                        } else if (jqXHR.status == 500) {
                            msg = 'Internal Server Error [500].';
                        } else if (exception === 'parsererror') {
                            msg = 'Requested JSON parse failed.';
                        } else if (exception === 'timeout') {
                            msg = 'Time out error.';
                        } else if (exception === 'abort') {
                            msg = 'Ajax request aborted.';
                        } else {
                            msg = 'Uncaught Error.\n' + jqXHR.responseText;
                        }
                        alert("Error al enviar email. Intentelo más tarde. \n\n"+msg);
                        vm.enviando_email= false;
                    });
                },
                addBuld: function(bulb, count_bulbs, active_hours){
                    this.data_calculator.light_bulbs.push({
                        bulb: bulb, count_bulbs: count_bulbs, active_hours: active_hours
                    });
                    $('#modalAdd_bulb').modal('hide');
                },
                removeBuld: function(index){
                    this.data_calculator.light_bulbs.splice(
                        this.data_calculator.light_bulbs.indexOf(index), 1
                    );
                }

            },
            filters: {
                formatMoney: function (value) {
                    return accounting.formatMoney(value);
                },
                formatNumber: function (value) {
                    return accounting.formatNumber(value);
                }
            },
            watch: {
            },
            created: function(){
                accounting.settings = {
                    currency: {
                        symbol : "$",   // default currency symbol is '$'
                        format: "%s%v", // controls output: %s = symbol, %v = value/number (can be object: see below)
                        decimal : ",",  // decimal point separator
                        thousand: ".",  // thousands separator
                        precision : 2   // decimal places
                    },
                    number: {
                        precision : 0,  // default precision on numbers is 0
                        thousand: ".",
                        decimal : ","
                    }
                };
            }
        });
    }
    catch(err) {
        alert('Error: '+err.message);
    }
}
iniciar();
$(document).ready(function(){
    $('.select2').select2();

    $('.enlaceExterno').click(function(event){
        event.preventDefault();
        window.open($(this).attr('href'), '_system');
    });

    $('#modalAdd_bulb form').submit(function(event){
        event.preventDefault();
        var buld_id= $(this).find('.bulb_id').val()*1;
        vm.addBuld(
            _.findWhere(vm.sources.LightBulbs, {id: buld_id}),
            $(this).find('.count_bulbs').val(),
            $(this).find('.active_hours').val()
        );
    });

    $('#formEmail').submit(function(event){
        event.preventDefault();
        vm.enviarEmail();
    })

    $('#modalAdd_bulb').on('show.bs.modal', function () {
        $('#modalAdd_bulb').find('input').val('');
        $('#modalAdd_bulb').find('select').val('');
    })


    $('.modalConAnuncio_'+getRandomInt(1, $('.modalConAnuncio').length+1 )).modal('show');

});

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
}



/** Ready on mobiles **/
document.addEventListener("deviceready", onDeviceReady, false);
function onDeviceReady() {
    window.open = cordova.InAppBrowser.open;
}

$(document).bind("mobileinit", function(){
    $.mobile.allowCrossDomainPages = true;
});