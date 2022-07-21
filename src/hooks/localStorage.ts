export function getLocalStorageByKey<T>(key: string): T {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : null;
  }
  
  export function saveLocalStorageByKey(
    key: string,
    item: string | unknown
  ): void {
    if (item) {
      return localStorage.setItem(key, JSON.stringify(item));
    }
    return localStorage.setItem(key, item as string);
  }
  
  export function removeLocalStorageByKey(key: string): boolean {
    if (key) {
      localStorage.removeItem(key);
      return true;
    }
    return false;
  }
  