
import '../function/dateFormat';

const customElementsName = 'estimate-arrival-component';
!window.customElements.get(customElementsName) &&
window.customElements.define(customElementsName, class extends HTMLElement{
  constructor(){
    super();
    
    const days = this.dataset.days || 14;
    var fecha = this.sumaFecha(+days);
    let estimated = new Date(fecha);

    if (this.querySelector('.estimated-arrival')) {
        this.querySelector('.estimated-arrival').innerHTML = estimated.format('mmm dS');
    }
  }

  sumaFecha(d){
    var Fecha = new Date();
    var sFecha = fecha || (Fecha.getDate() + "/" + (Fecha.getMonth() +1) + "/" + Fecha.getFullYear());
    var sep = sFecha.indexOf('/') != -1 ? '/' : '-';
    var aFecha = sFecha.split(sep);
    var fecha = aFecha[2]+'/'+aFecha[1]+'/'+aFecha[0];
    fecha= new Date(fecha);
    fecha.setDate(fecha.getDate()+parseInt(d));
    var anno=fecha.getFullYear();
    var mes= fecha.getMonth()+1;
    var dia= fecha.getDate();
    mes = (mes < 10) ? ("0" + mes) : mes;
    dia = (dia < 10) ? ("0" + dia) : dia;
    var fechaFinal = mes+sep+dia+sep+anno;
    return (fechaFinal);
  }
})