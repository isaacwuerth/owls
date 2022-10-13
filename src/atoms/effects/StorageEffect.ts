import { AtomEffect } from 'recoil'

export function storageEffect<T>(
  key: string,
  storage: Storage<T>
): AtomEffect<T> {
  return ({ setSelf, onSet }) => {
    const savedValue = storage.get(key)
    if (savedValue != null) {
      setSelf(savedValue)
    }

    onSet((newValue, _, isReset) => {
      isReset ? storage.delete(key) : storage.set(key, newValue)
    })
  }
}

interface Storage<T> {
  set: (key: string, value: T) => void
  get: (key: string) => T | null
  delete: (key: string) => void
}

export class LocalStorage<T> implements Storage<T> {
  set(key: string, value: T) {
    localStorage.setItem(key, JSON.stringify(value))
  }

  get(key: string) {
    const value = localStorage.getItem(key)
    return value ? JSON.parse(value) : null
  }

  delete(key: string) {
    localStorage.removeItem(key)
  }
}

export class SessionStorage<T> implements Storage<T> {
  set(key: string, value: T) {
    sessionStorage.setItem(key, JSON.stringify(value))
  }

  get(key: string) {
    const value = sessionStorage.getItem(key)
    return value ? JSON.parse(value) : null
  }

  delete(key: string) {
    sessionStorage.removeItem(key)
  }
}

export class IndexedDBStorage<T> implements Storage<T> {
  private db: IDBDatabase | undefined
  private readonly request

  constructor(dbName: string, storeName: string) {
    const request = indexedDB.open(dbName, 1)
    request.onupgradeneeded = () => {
      this.db = request.result
      this.db.createObjectStore(storeName)
    }
    request.onsuccess = () => {
      this.db = request.result
    }
    this.request = request
  }

  set(key: string, value: T) {
    if (!this.db) return
    const transaction = this.db.transaction([key], 'readwrite')
    const store = transaction.objectStore(key)
    store.put(value, key)
  }

  get(key: string) {
    if (!this.db) return null
    const transaction = this.db.transaction([key], 'readonly')
    const store = transaction.objectStore(key)
    const request = store.get(key)
    return request.result
  }

  delete(key: string) {
    if (!this.db) return
    const transaction = this.db.transaction([key], 'readwrite')
    const store = transaction.objectStore(key)
    store.delete(key)
  }
}

export class CacheStorage<T> implements Storage<T> {
  private cache: Cache | undefined

  constructor(cacheName: string) {
    void caches.open(cacheName).then((cache) => {
      this.cache = cache
    })
  }

  set(key: string, value: T) {
    if (!this.cache) return
    void this.cache.put(key, new Response(JSON.stringify(value)))
  }

  get(key: string) {
    if (!this.cache) return null
    let response: any | undefined
    void this.cache
      .match(key)
      .then(async (res) => await (response = res?.text()))
    return response ? (JSON.parse(response.text()) as T) : null
  }

  delete(key: string) {
    if (!this.cache) return
    void this.cache.delete(key)
  }
}

export class CookieStorage<T> implements Storage<T> {
  set(key: string, value: T) {
    document.cookie = `${key}=${JSON.stringify(value)}`
  }

  get(key: string) {
    const cookies = document.cookie.split(';')
    const cookie = cookies.find((c) => c.startsWith(key))
    return cookie ? JSON.parse(cookie.split('=')[1]) : null
  }

  delete(key: string) {
    document.cookie = `${key}=; expires=Thu, 01 Jan 1970 00:00:00 GMT`
  }
}

export class AnywhereStorage<T> implements Storage<T> {
  localStore: LocalStorage<T> = new LocalStorage<T>()
  sessionStorage: SessionStorage<T> = new SessionStorage<T>()
  indexDB: IndexedDBStorage<T>
  cache: CacheStorage<T>
  cookieStorage: CookieStorage<T> = new CookieStorage<T>()

  constructor(name: string) {
    this.indexDB = new IndexedDBStorage(name, name)
    this.cache = new CacheStorage(name)
  }

  delete(key: string): void {
    if (localStorage) this.localStore.delete(key)
    if (sessionStorage) this.sessionStorage.delete(key)
    if (indexedDB) this.indexDB.delete(key)
    if (caches) this.cache.delete(key)
    if (document.cookie) this.cookieStorage.delete(key)
  }

  get(key: string): T | null {
    let localStorageValue: T | null = null
    if (localStorage) localStorageValue = this.localStore.get(key)

    let sessionStorageValue: T | null = null
    if (sessionStorage) sessionStorageValue = this.sessionStorage.get(key)

    let indexDBValue: T | null = null
    if (indexedDB) indexDBValue = this.indexDB.get(key)

    let cacheValue
    if (caches) cacheValue = this.cache.get(key)

    let cookieValue: T | null = null
    if (document.cookie) cookieValue = this.cookieStorage.get(key)

    const all = [
      localStorageValue,
      sessionStorageValue,
      indexDBValue,
      cacheValue,
      cookieValue,
    ]
    return all.find((value) => value !== null) ?? null
  }

  set(key: string, value: T): void {
    if (localStorage) this.localStore.set(key, value)
    if (sessionStorage) this.sessionStorage.set(key, value)
    if (indexedDB) this.indexDB.set(key, value)
    if (caches) this.cache.set(key, value)
    if (document.cookie) this.cookieStorage.set(key, value)
  }
}
