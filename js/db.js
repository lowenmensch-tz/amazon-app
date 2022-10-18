class Database {

  constructor(options = {}) {
    if (typeof indexedDB === 'undefined') {
      throw new Error('indexedDB is unsupported!')
      return
    }
    this.name = options.name
    this.data = options.categories
    this.db = options.db || null
    this.version = options.version || 1

  }

  createDB () {
    return new Promise((resolve, reject) => {
      // For local debugging, the database is deleted first and then established
      indexedDB.deleteDatabase(this.name);
      const request = indexedDB.open(this.name);
      // When the database is upgraded, the onupgradened event is triggered.
      // Upgrade means that the database is created for the first time, or the version number of the database specified when calling the open() method is higher than the local existing version.
      request.onupgradeneeded = () => {
        const db = request.result;
        window.db = db
        console.log('db onupgradeneeded')
        // Create a store here
        this.createStore(db)
      };

      // Open successful callback function
      request.onsuccess = () => {
        resolve(request.result)
        this.db = request.result
      };
      // Open failed callback function
      request.onerror = function(event) {
        reject(event)
      }
    })
  }

  createStore(db) {
    if (!db.objectStoreNames.contains('categories')) {
      // Create table
      const objectStore = db.createObjectStore('categories', {
        keyPath: 'nombreCategoria',
        autoIncrement: true
      });
      // nombreCategoria is the index
      objectStore.createIndex('nombreCategoria', 'nombreCategoria');
      //return objectStore;
    }
  }

  add (data) {
    return new Promise((resolve, reject) => {
      const db = this.db;
      const transaction = db.transaction('categories', 'readwrite')
      const store = transaction.objectStore('categories')

      const request = store.add(data);

      request.onsuccess = event => resolve(event.target.result);
      request.onerror = event => reject(event);
    })
  }

  put (data) {
    return new Promise((resolve, reject) => {
      const db = this.db;
      const transaction = db.transaction('categories', 'readwrite')
      const store = transaction.objectStore('categories')

      const request = store.put(data);

      request.onsuccess = event => resolve(event.target.result);
      request.onerror = event => reject(event);
    })
  }

   // eliminar categoria 
   delete (id) {
    return new Promise((resolve, reject) => {
      const db = this.db;
      const transaction = db.transaction('categories', 'readwrite')
      const store = transaction.objectStore('categories')
      const request = store.delete(id)

      request.onsuccess = event => resolve(event.target.result);
      request.onerror = event => reject(event);
    })
  }


  // Query the matching value of the first value``````
  getByID (categoryID, indexName) {
    return new Promise((resolve, reject) => {
      const db = this.db;
      const transaction = db.transaction('categories', 'readwrite')
      const store = transaction.objectStore('categories')
      let request
      // If there is an index, open the index to search, and if there is no index, search as a primary key
      if (indexName) {
        let index = store.index(indexName);
        request = index.get(categoryID)
      } else {
        request = store.get(categoryID)
      }

      request.onsuccess = evt => evt.target.result ?
        resolve(evt.target.result) : resolve(null)
      request.onerror = evt => reject(evt)
    });
  }

}


