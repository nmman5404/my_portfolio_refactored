/** Persistence is optional: browser settings or storage quotas must not stop the UI. */
function createStorage(name) {
    return {
        getItem(key) {
            try {
                return globalThis[name].getItem(key);
            } catch (_) {
                return null;
            }
        },
        setItem(key, value) {
            try {
                globalThis[name].setItem(key, value);
            } catch (_) {
                // Features retain their current state in memory when persistence fails.
            }
        },
        removeItem(key) {
            try {
                globalThis[name].removeItem(key);
            } catch (_) {
                // An unavailable store has no state that this page can remove.
            }
        },
    };
}

export const localStore = createStorage('localStorage');
export const sessionStore = createStorage('sessionStorage');
