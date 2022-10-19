var categorias = [];
var nameDB = 'AmazonAppStoreDatabase';
var idCategory;
var idApp;
var amazonAppStoreDB;

(()=>{
  //Este arreglo es para generar textos de prueba
  let textosDePrueba=[
      "Lorem ipsum, dolor sit amet consectetur adipisicing elit. Dolore, modi!",
      "Quos numquam neque animi ex facilis nesciunt enim id molestiae.",
      "Quaerat quod qui molestiae sequi, sint aliquam omnis quos voluptas?",
      "Non impedit illum eligendi voluptas. Delectus nisi neque aspernatur asperiores.",
      "Ducimus, repellendus voluptate quo veritatis tempora recusandae dolorem optio illum."
  ]
  
  //Genera dinamicamente los JSON de prueba para esta evaluacion,
  //Primer ciclo para las categorias y segundo ciclo para las apps de cada categoria

  
  let contador = 1;
  for (let i=0;i<5;i++){//Generar 5 categorias
      let categoria = {
          nombreCategoria:"Categoria "+i,
          descripcion:textosDePrueba[Math.floor(Math.random() * (5 - 1))],
          aplicaciones:[]
      };
      for (let j=0;j<10;j++){//Generar 10 apps por categoria
          let aplicacion = {
              codigo:contador,
              nombre:"App "+contador,
              descripcion:textosDePrueba[Math.floor(Math.random() * (5 - 1))],
              icono:`img/app-icons/${contador}.webp`,
              instalada:contador%3==0?true:false,
              app:"app/demo.apk",
              calificacion:Math.floor(Math.random() * (5 - 1)) + 1,
              descargas:1000,
              desarrollador:`Desarrollador ${(i+1)*(j+1)}`,
              imagenes:["img/app-screenshots/1.webp","img/app-screenshots/2.webp","img/app-screenshots/3.webp"],
              comentarios:[
                  {comentario:textosDePrueba[Math.floor(Math.random() * (5 - 1))],calificacion:Math.floor(Math.random() * (5 - 1)) + 1,fecha:"12/12/2012",usuario:"Juan"},
                  {comentario:textosDePrueba[Math.floor(Math.random() * (5 - 1))],calificacion:Math.floor(Math.random() * (5 - 1)) + 1,fecha:"12/12/2012",usuario:"Pedro"},
                  {comentario:textosDePrueba[Math.floor(Math.random() * (5 - 1))],calificacion:Math.floor(Math.random() * (5 - 1)) + 1,fecha:"12/12/2012",usuario:"Maria"},
              ]
          };
          contador++;
          categoria.aplicaciones.push(aplicacion);
      }
      categorias.push(categoria);
  }

  (async function(){
      
      //Este método no funciona para Mozilla
      const idxDB = await window.indexedDB.databases()

      console.log(idxDB);

      if((idxDB.filter((collection) => collection.name == nameDB)).length == 0){
          
          const database = new Database({ name: nameDB, categories: categorias })
          await database.createDB()

          console.log( categorias )

          await categorias.forEach(async (category) => {
              await database.add(category);
          });
          
      } else{
          console.log("Ya existe una bd")
          populateDropdownMenuButton();
      }
  })()

})();



function addCarouseItem(images){
    
    //element.classList.add("active"); al primer elemento de la lista
    let carouselItem = [];

    for (let index = 0; index < images.length; index++) {
        carouselItem.push(
            `
            <div class="carousel-item ${ index==0 ? 'active': '' }">
                <img src="${images[index]}" class="d-block w-100" alt="...">
            </div>
            `
        );
    }
    
    return carouselItem.join(' ');
}


async function addApp(form){
    const database = new Database({ db: amazonAppStoreDB });
    const category = await database.getByID(idCategory, 'nombreCategoria');
    const categoryBK = JSON.parse(JSON.stringify(category));

    //toma el elemento con el 'codigo' mayor
    const newApp = (
        category.aplicaciones.sort((a, b)=> {
            if (a.codigo < b.codigo){
                return -1
            }
        })
    )[category.aplicaciones.length - 1];

   newApp.codigo = newApp.codigo + 1;
   newApp.nombre = form.elements["input-app-name"].value;
   newApp.descripcion = form.elements["textarea-description"].value;
   newApp.desarrollador = form.elements["input-developer-name"].value;
   newApp.icono = 'img/app-icons/51.webp';
   newApp.calificacion = form.elements["raiting-select"].value;
   newApp.comentarios = [];

   categoryBK.aplicaciones.push(newApp);

   database.delete(idCategory); 
   database.add(categoryBK)
   populateDataCards();
   
   $('#addAppModal').modal('hide');
}


async function deleteApp(){
    //indexdb
    const database = new Database({ db: amazonAppStoreDB });
    const category = await database.getByID(idCategory, 'nombreCategoria');

    let categoryBK = category;
    let newData  = categoryBK.aplicaciones.filter((app) => app.codigo != idApp);

    database.delete(idCategory); 
    categoryBK.aplicaciones = newData;
    database.add(categoryBK)
    populateDataCards();

    $('#deleteAppModal').modal('hide');
}


async function getCategory(){
    const database = new Database({ db: amazonAppStoreDB });
    const category = await database.getByID(idCategory,  'nombreCategoria');

    return category;
}


async function addTitleModal(){

    const p = document.getElementById('title-dody-delete-app-modal');
    const category = await getCategory();

    const app = category.aplicaciones.filter((app) => app.codigo == idApp)[0];

    p.innerHTML = `¿Está seguro que desea eliminar <strong>${app.nombre}</strong> de la Amazon appstore?`;
}

// ----------------------------------------------
//                 POPULATE APP
// ----------------------------------------------

async function populateDataModalApp(idElement){

    const green = '#689f38;';
    const red = '#9f3838;';
    idApp = idElement;

    //indexdb
    const category = await getCategory();
    let apps = category.aplicaciones.filter((app) => app.codigo == idApp)[0];

    document.getElementById('appDataModalContent').innerHTML = `
        <div class="modal-header">
            
            <div id="carouselModal" class="carousel slide" data-ride="carousel">
                <div class="carousel-inner">
                    <!-- AQUI VAN LAS IMAGENES -->
                    ${ addCarouseItem(apps.imagenes) }
                </div>
                <a class="carousel-control-prev" href="#carouselModal" role="button" data-slide="prev">
                    <span class="carousel-control-prev-icon" aria-hidden="true"></span>
                    <span class="sr-only">Previous</span>
                </a>
                <a class="carousel-control-next" href="#carouselModal" role="button" data-slide="next">
                    <span class="carousel-control-next-icon" aria-hidden="true"></span>
                    <span class="sr-only">Next</span>
                </a>
            </div>
        
        </div>
        <hr>
        <div class="modal-body">

            <div class="row">
                <div class="col-4">
                    <img src="${apps.icono}" class="card-img-top ml-2 mt-2 mr-2" style="width:90%">
                </div>
                <div class="col-8">
                    <h6 id="title" class="title-modal"><strong>${apps.nombre}</strong></h6>
                    <div class="subtitle-modal">${apps.desarrollador}</div>
                    <div class="body-modal">${apps.descripcion}</div>
                    <div id="price" class="price">${generatePrice(2000, 1)}</div>
                </div>
            </div>
            
            <hr>
            
            <div class="container" id="raiting">
                <div class="row justify-content-center" id="raiting" style="color: ${apps.calificacion >=3 ? green: red};">
                        ${raiting(apps.calificacion)}&nbsp;<strong>${apps.calificacion}.0</strong>
                </div>  
            </div>
            <br>
            <ul class="list-group list-group-flush" id="app-feedback">
                ${populateAppComments(apps.comentarios)}
            </ul>
        </div>

        <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-dismiss="modal">Cerrar</button>
            <button type="button" class="btn btn-danger" id="btn-delete-app" data-dismiss="modal" onClick="addTitleModal()" data-toggle="modal" data-target="#deleteAppModal">Eliminar</button>
            <button type="button" class="btn btn-success" id="btn-install-app">Instalar</button>
        </div>
    `;

    let button = document.getElementById("btn-install-app");
    apps.instalada ? button.disabled = true : button.disabled = false;
    
}


function populateAppComments(comments){

    let appFeedback = [];

    comments.forEach( element => {
        appFeedback.push(`
        <li class="list-group-item">
            <div class="row">
                <div class="col-2">
                    <img src="/img/user.webp" class="rounded-circle" style="width:100%">
                </div>
                <div class="col-9">
                    <div id="title-comment" class="title-comments">${element.usuario}</div>
                    <div id="body-comment" class="body-comments">${element.comentario}<div/>
                </div>
        </li>
        `)
    } );

    return appFeedback.join(' ');
}


async function populateDropdownMenuButton(){
    
    let selectDropDownMenu = document.getElementById('category');
    let categories = [];
    let request = window.indexedDB.open(nameDB);

    request.onsuccess = function(event){

        amazonAppStoreDB = request.result;
        
        const transaction = amazonAppStoreDB.transaction(['categories']);
        const objectStore = transaction.objectStore('categories');
    
        objectStore.openCursor().onsuccess = function(event) {
            var cursor = event.target.result;
            
            if (cursor) {
                categories.push( (cursor.value) );
                cursor.continue();
            }

            else {
                categories.forEach(element => {
                    selectDropDownMenu.innerHTML += `<option value="${element.nombreCategoria}">${element.nombreCategoria}</option>`;
                });
            }
        }
    }
}


async function populateDataCards(){

    //Activar botón para agregar formulario
    const buttonAddFormApp = document.getElementById("formAddApp");
    buttonAddFormApp.disabled = false;
    
    idCategory = $("#category").val(); 
    
    var apps = document.getElementById('apps');
    apps.innerHTML = '';

    //indexdb
    const category = await getCategory();
    category.aplicaciones.forEach( app => {
        apps.innerHTML += `
        <div class="col-md-2 mt-4" data-toggle="modal" data-target="#appDataModal" onClick="populateDataModalApp(${app.codigo})">
            <div class="card" >
                <img src="${app.icono}" class="card-img-top ml-2 mt-2 mr-2" style="width:90%">
                <div class="card-body">
                    <div id="title" class="title-card"><strong>${app.nombre}</strong></div>
                    <p class="card-text">${app.desarrollador.substr(0, 16)}</p>
                    <div id="raiting" style="color: #F2BC1B;">
                        ${raiting(app.calificacion)} 
                    </div>
                    <div id="price" class="price">${generatePrice(2000, 1)}</div>
                </div>
                </div>
        </div>
    `;
    });
}