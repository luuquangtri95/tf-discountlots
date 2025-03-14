import localforage from "localforage";


const storage = {
    get: function (key) {
        const item = localStorage.getItem(key);
        if (!item) return null;

        const { value, expiry } = JSON.parse(item);
        if (expiry && Date.now() > expiry) {
            this.delete(key);
            return null;
        }
        return value;
    },
    set: function (key, value, expiryDays = 1) {
        const expiry = expiryDays ? Date.now() + expiryDays * 24 * 60 * 60 * 1000 : null;
        const item = JSON.stringify({ value, expiry });
        localStorage.setItem(key, item);
    },
    delete: function (key) {
        localStorage.removeItem(key);
    },
};

export default storage;