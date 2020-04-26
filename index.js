
var titulares = [];




var app = new Vue({
  el: '#app',
  data: {
    listaPersonas: [],
    seleccionA: undefined,
    seleccionB: [],
    actualResult: undefined,
    resultVisible: false
  },
  methods: {
    onSeleccionA(e) {
      this.seleccionA = this.listaPersonas[e.target.selectedIndex - 1];

    }

  },
  computed: {
    actualizar() {
      return formulaCoseno();
    },
    getUserSimilitud() {

      var userSimilar = "Ninguno";
      var listUserSimilaridad = [];

      if (this.seleccionA) {

        this.listaPersonas.forEach((user) => {
          if (user != this.seleccionA) {
            calcularCoseno(this.seleccionA, user);
          }
        });

        listUserSimilaridad = Object.assign([], this.listaPersonas);

        listUserSimilaridad.sort((a, b) => {
          if (a.similitud <= b.similitud) {
            return 1;
          } else {
            return -1;
          }
        })

        userSimilar = listUserSimilaridad[0];
      }

      userSimilar.similitud = parseFloat(userSimilar.similitud).toFixed(2);

      return userSimilar;
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
    numerador += parseInt(userA.value) * parseInt(userB.value);
    //magnitud
    denominadorA += parseInt(userA.value) * parseInt(userA.value);

    denominadorB += parseInt(userB.value) * parseInt(userB.value);

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
    numerador += (parseInt(objetoA[index]) * parseInt(objetoB[index]));
    //magnitud
    denominadorA += (parseInt(objetoA[index]) * parseInt(objetoA[index]));

    denominadorB += (parseInt(objetoB[index]) * parseInt(objetoB[index]));

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


//Cargar el archivo
$.ajax({
  url: "../db.csv",
  dataType: "text"
}).done(successFunction);



function successFunction(data) {
  //Division por saltos de linea
  var datosFila = data.split("\n");
  //Arreglo donde se guarda la nueva información
  var informacion = [];


  for (let index = 0; index < datosFila.length; index++) {

    var usuario = {
      propiedades: []
    };

    //Lectura de una linea
    let dataLinea = datosFila[index];
    let arregloDeLista = dataLinea.split(",");



    if (index == 0) {
      titulares = arregloDeLista;
    } else {

      arregloDeLista.forEach((name, i) => {

        if (i == 0) {
          usuario.nombre = name;
        } else {
          //los numeros los convierte en numero y los textos los almacena
          var dato = parseInt(name);
          var title = titulares[i + 1];

          if (dato) {
            usuario.propiedades.push({ titulo: title, value: dato });
          } else {
            usuario.propiedades.push({ titulo: title, value: dato });
          }
        }
      });

      informacion.push(usuario);
    }



  }

  app.listaPersonas = informacion;


}



var Metodologiausuario = {
  nombre: "Mi nombre",
  propiedades: [
    1, 2, 3
  ],
  similitud: 90
}

var Metodologiausuario2 = {
  nombre: "Mi nombre",
  propiedades: {
    edad: 1,
    Peso: 2,
    mascora: 3
  },
  similitud: 90
}

var Metodologiausuario3 = {
  nombre: "Mi nombre",
  propiedades: [
    {
      title: "Edad",
      value: 2
    }, {
      title: "Mascora",
      value: 2
    }, {
      title: "Edad",
      value: 2
    }

  ],
  similitud: 90
}



