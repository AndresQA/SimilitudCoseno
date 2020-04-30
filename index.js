$(document).ready(function () {
  $('select').formSelect();
});

//Cargar el archivo
$.ajax({
  url: "./db.csv",
  dataType: "text"
}).done(successFunction);



var titulares = [];



var app = new Vue({
  el: '#app',
  data: {
    listaPersonas: [],
    listaPersonasOriginal: [],
    seleccionA: undefined,
    seleccionB: [],
    actualResult: undefined,
    resultVisible: false,
    titulares: []
  },

  methods: {
    onSeleccionA(e) {
      this.seleccionA = this.listaPersonas[e.target.selectedIndex - 1];

    }

  },
  filters: {
    fixed(numero) {
      return numero.toFixed(2);
    }
  },
  computed: {
    actualizar() {
      var resultSimilar = formulaCoseno();
      return resultSimilar;
    },
    getUserSimilitud() {

      var userSimilar = "Ninguno";
      var listUserSimilaridad = [];

      listUserSimilaridad = Object.assign([], this.listaPersonas);

      if (this.seleccionA) {

        var contSuficiente = 0;
        this.seleccionA.propiedades.forEach(p => {
          contSuficiente += p.importancia > 0 ? 1 : 0;
        })
        if (contSuficiente > 1) {
          this.seleccionA.suficiente = true;
        } else {
          this.seleccionA.suficiente = false;
        }

        listUserSimilaridad.forEach((user) => {
          if (user != this.seleccionA) {
            calcularCoseno(this.seleccionA, user);
          }
        });

        listUserSimilaridad.sort((a, b) => {
          if (a.similitud < b.similitud) {
            return 1;
          } else {
            return -1;
          }
        })

        var indexCurrent = -1;
        listUserSimilaridad.forEach((user, index) => {
          if (this.seleccionA.nombre == user.nombre) {
            indexCurrent = index;
          }

          this.listaPersonas.forEach((u) => {

            if (user.nombre === u.nombre) {
              u.orden = index;
              return;
            }

          });
        });

        listUserSimilaridad.splice(indexCurrent, 2);


      }
      setTimeout(() => {
        $('.tooltipped').tooltip();
      }, 10)

      //return this.listaPersonas;
      return listUserSimilaridad;
    }
  }
}
);



var calcularCoseno = (usuarioA, usuarioB) => {

  var numerador = 0;
  var denominadorA = 0;
  var denominadorB = 0;

  var objectA = usuarioA.propiedades;
  var objectB = usuarioB.propiedades;

  for (let index = 0; index < objectA.length; index++) {

    var userA = objectA[index];
    var userB = objectB[index];

    //producto punto
    numerador += userA.importancia * (parseFloat(userA.value) * parseFloat(userB.value));
    //magnitud
    denominadorA += userA.importancia * (parseFloat(userA.value) * parseFloat(userA.value));

    denominadorB += userA.importancia * (parseFloat(userB.value) * parseFloat(userB.value));

  }

  //similitud coseno
  //Math.sqrt es para sacar raiz cuadrada
  denominadorA = Math.sqrt(denominadorA);
  denominadorB = Math.sqrt(denominadorB);

  var valorK = numerador / (denominadorA * denominadorB);
  var valorFinalK = valorK * 100;

  usuarioA.similitud = valorFinalK;
  usuarioB.similitud = valorFinalK;

  return valorFinalK;

}



var formulaCoseno = () => {
  var _this = app._data;

  let objetoA = _this.seleccionA;
  let objetoB = _this.seleccionB;

  if (objetoA.length > 0 && objetoB.length > 0) {
    _this.resultVisible = true;
  } else {
    _this.resultVisible = false;
  }

  var numerador = 0;
  var denominadorA = 0;
  var denominadorB = 0;


  for (let index = 1; index < objetoA.length; index++) {

    console.log(index)
    //producto punto
    numerador += objetoA.importancia * (parseInt(objetoA[index]) * parseInt(objetoB[index]));
    //magnitud
    denominadorA += objetoA.importancia * (parseInt(objetoA[index]) * parseInt(objetoA[index]));

    denominadorB += objetoA.importancia * (parseInt(objetoB[index]) * parseInt(objetoB[index]));

  }

  //similitud coseno
  //Math.sqrt es para sacar raiz cuadrada
  denominadorA = Math.sqrt(denominadorA);
  denominadorB = Math.sqrt(denominadorB);
  var valorK = numerador / (denominadorA * denominadorB);
  var valorFinalK = valorK * 100;
  console.log(denominadorA)
  console.log(denominadorB)
  console.log(valorK)
  //console.log('Similitud Coseno entre:' + objetoA[0] + ' ' + 'y' + ' ' + objetoB[0] + ' ' + 'es:' + ' ' + valorFinalK + '%');

  return valorFinalK;

}





function successFunction(data) {
  //Division por saltos de linea
  var datosFila = data.split("\n");
  //Arreglo donde se guarda la nueva información
  var informacion = [];


  for (let index = 0; index < datosFila.length; index++) {

    var usuario = {
      propiedades: [],
      suficiente: true
    };

    //Lectura de una linea
    let dataLinea = datosFila[index];
    let arregloDeLista = dataLinea.split(",");

    if (index == 0) {
      titulares = arregloDeLista;
      app._data.titulares = titulares;
    } else {

      arregloDeLista.forEach((name, i) => {

        if (i == 0) {

          usuario.nombre = name;

        } else {
          //los numeros los convierte en numero y los textos los almacena
          var title = titulares[i];

          usuario.propiedades.push({ titulo: title, value: parseInt(name), importancia: 1 });
        }
      });

      informacion.push(usuario);
    }
  }

  var listNormalizado = Object.assign([], informacion);

  var valsMin = {};
  var valsMax = {};

  listNormalizado.forEach(user => {

    user.propiedades.forEach(prop => {


      if (valsMin[prop.titulo] != undefined) {

        if (prop.value < valsMin[prop.titulo]) {
          valsMin[prop.titulo] = prop.value;
        }

      } else {
        valsMin[prop.titulo] = prop.value;
      }


      if (valsMax[prop.titulo] != undefined) {

        if (prop.value > valsMax[prop.titulo]) {
          valsMax[prop.titulo] = prop.value;
        }

      } else {
        valsMax[prop.titulo] = prop.value;
      }
    });
  });

  console.log(valsMin, valsMax)

  listNormalizado.forEach(user => {
    user.propiedades.forEach(prop => {

      prop.value = map_range(prop.value, valsMin[prop.titulo], valsMax[prop.titulo], 0, 1);

    });

  });



  app._data.listaPersonasOriginal = informacion;
  app._data.listaPersonas = listNormalizado;




}



function map_range(value, low1, high1, low2, high2) {
  return low2 + (high2 - low2) * (value - low1) / (high1 - low1);
}
