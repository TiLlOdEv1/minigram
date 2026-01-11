// services/cacheService.js
class CacheService {
  constructor() {
    this.cache = new Map();
    this.defaultTTL = 5 * 60 * 1000; // 5 minutes
  }

  // Set cache with TTL
  set(key, value, ttl = this.defaultTTL) {
    const expiresAt = Date.now() + ttl;
    this.cache.set(key, { value, expiresAt });
    return true;
  }

  // Get from cache
  get(key) {
    const item = this.cache.get(key);
    
    if (!item) {
      return null;
    }

    // Check if expired
    if (Date.now() > item.expiresAt) {
      this.cache.delete(key);
      return null;
    }

    return item.value;
  }

  // Delete from cache
  delete(key) {
    return this.cache.delete(key);
  }

  // Clear cache
  clear() {
    this.cache.clear();
  }

  // Check if exists
  has(key) {
    const item = this.cache.get(key);
    if (!item) return false;
    
    if (Date.now() > item.expiresAt) {
      this.cache.delete(key);
      return false;
    }
    
    return true;
  }

  // Get all keys
  keys() {
    return Array.from(this.cache.keys());
  }

  // Get cache size
  size() {
    return this.cache.size;
  }

  // Set multiple items
  setMultiple(items, ttl = this.defaultTTL) {
    items.forEach(([key, value]) => {
      this.set(key, value, ttl);
    });
  }

  // Get multiple items
  getMultiple(keys) {
    return keys.map(key => this.get(key));
  }

  // Auto-clean expired items
  startCleanup(interval = 60000) {
    this.cleanupInterval = setInterval(() => {
      this.cleanup();
    }, interval);
  }

  stopCleanup() {
    if (this.cleanupInterval) {
      clearInterval(this.cleanupInterval);
    }
  }

  cleanup() {
    const now = Date.now();
    for (const [key, item] of this.cache.entries()) {
      if (now > item.expiresAt) {
        this.cache.delete(key);
      }
    }
  }

  // Memory usage
  getMemoryUsage() {
    const size = JSON.stringify(Array.from(this.cache.entries())).length;
    return {
      items: this.cache.size,
      approximateSize: `${(size / 1024).toFixed(2)} KB`,
    };
  }
}

// Singleton instance
const cacheService = new CacheService();
export default cacheService;