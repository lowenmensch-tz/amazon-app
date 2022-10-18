var dbName = "AmazonAppStoreDatabase";

function createDB(){

    if (!window.indexedDB) {

        alert("Su navegador no soporta una versión estable de indexedDB. Tal y como las características no serán validas");

    }else{

        let db;
        const request = indexedDB.open(dbName);
        
        request.onerror = (event) => {
            console.error(`Database error: ${event.target.errorCode}`);
        };
        

        request.onupgradeneeded = (event)=> {
            
            var db = event.target.result;
            db = event.target.result;

            var objectStore = db.createObjectStore("categories", { keyPath: "nombreCategoria" });

            objectStore.createIndex("nombreCategoria", "nombreCategoria", { unique: true });

            objectStore.transaction.oncomplete = (event) => {

                var categoriesObjectStore = db.transaction("categories", "readwrite").objectStore("categories");

                categorias.forEach( element => {
                    // Crea un almacén de objetos (objectStore) para esta base de datos
                    categoriesObjectStore.add(element);
                });
            }
        }

    }
}


async function getAllCategory(){
    
    let categories = [];
    let db;
    const request = indexedDB.open(dbName);
    
    request.onerror = (event) => {
        console.error(`Database error: ${event.target.errorCode}`);
    };

    return request;

}


async function searchCatregoryByID(idCategory){
    
    let db;
    let category = [];
    const request = indexedDB.open(dbName);
    
    request.onerror = (event) => {
        console.error(`Database error: ${event.target.errorCode}`);
    };
    

    request.onsuccess = function(event) {
        db = request.result;

        const transaction = db.transaction(['categories']);
        const objectStore = transaction.objectStore('categories');

        // Filtrando por 'id'
        let data = objectStore.get(idCategory).onsuccess = function(event){
            category = event.target.result;

            return category;
        }
    };
}