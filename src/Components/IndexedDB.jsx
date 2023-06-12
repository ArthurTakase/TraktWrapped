const dbName = "TraktWrappedDatabase"
const objectStore = "movies"
let db = null

export class Database {
    async createDatabase() {
        const request = indexedDB.open(dbName, 1)

        request.onerror = function(event) {
            console.error("An error occurred with IndexedDB")
            console.error(event)
        }
    
        request.onupgradeneeded = function() {
            console.log(objectStore)
            const db = request.result
            db.createObjectStore(objectStore, { keyPath: "id" })
        }
    
        request.onsuccess = function() {
            db = request.result
            const transaction = db.transaction(objectStore, "readwrite")
            transaction.objectStore(objectStore)
        }
    }

    async addToDB(id, data) {
        const transaction = db.transaction(objectStore, "readwrite")
        const store = transaction.objectStore(objectStore)
        store.put({ id, data })

        return new Promise((resolve, reject) => {
            transaction.oncomplete = function () {
                resolve()
            }

            transaction.onerror = function (event) {
                console.error("An error occurred with IndexedDB")
                console.error(event)
                reject(event)
            }
        })
    }

    async getFromDB(id) {
        const transaction = db.transaction(objectStore, "readonly")
        const store = transaction.objectStore(objectStore)

        const request = store.getAll()

        return new Promise((resolve, reject) => {
            request.onerror = function (event) {
                console.error("An error occurred with IndexedDB")
                reject(event)
            }

            request.onsuccess = function () {
                if (request.result && request.result.length > 0)
                    for (const movie of request.result)
                        if (movie.id == id) {
                            resolve(movie.data)
                            return
                        }
                resolve(null)
            }
        })
    }

    async deleteFromDB(id) {
        const transaction = db.transaction(objectStore, "readwrite")
        const store = transaction.objectStore(objectStore)
        store.delete(id)

        return new Promise((resolve, reject) => {
            transaction.oncomplete = function () {
                resolve()
            }

            transaction.onerror = function (event) {
                console.error("An error occurred with IndexedDB")
                console.error(event)
                reject(event)
            }
        })
    }
}

export const TraktDB = new Database()
await TraktDB.createDatabase()