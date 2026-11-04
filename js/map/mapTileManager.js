import { tileKey } from './mapProjection.js';

export function createMapTileManager({ tileServer, maxConcurrent = 8 }) {
    const cache = new Map();
    const pending = new Map();
    const queued = [];
    let activeDownloads = 0;

    function startNext() {
        if (activeDownloads >= maxConcurrent || queued.length === 0) {
            return;
        }

        const next = queued.shift();
        startTile(next);
    }

    function startTile(entry) {
        activeDownloads += 1;
        const image = new Image();
        image.crossOrigin = 'anonymous';

        image.onload = () => {
            cache.set(entry.key, image);
            pending.delete(entry.key);
            activeDownloads -= 1;
            entry.resolve(image);
            startNext();
        };

        image.onerror = () => {
            const error = new Error(`No s’ha pogut carregar la rajola ${entry.key}.`);
            pending.delete(entry.key);
            activeDownloads -= 1;
            entry.reject(error);
            startNext();
        };

        image.src = `${tileServer}/${entry.z}/${entry.x}/${entry.y}.png`;
    }

    function enqueueTileRequest(entry) {
        if (cache.has(entry.key)) {
            return Promise.resolve(cache.get(entry.key));
        }

        if (pending.has(entry.key)) {
            return pending.get(entry.key);
        }

        const request = new Promise((resolve, reject) => {
            const loadEntry = { ...entry, resolve, reject };
            if (activeDownloads >= maxConcurrent) {
                queued.push(loadEntry);
                return;
            }

            startTile(loadEntry);
        });

        pending.set(entry.key, request);
        return request;
    }

    return {
        getCachedTile(z, x, y) {
            return cache.get(tileKey(x, y, z)) ?? null;
        },

        requestTile(z, x, y) {
            return enqueueTileRequest({
                key: tileKey(x, y, z),
                z,
                x,
                y,
            });
        },

        clear() {
            cache.clear();
            pending.clear();
            queued.length = 0;
            activeDownloads = 0;
        },

        getCacheSize() {
            return cache.size;
        },
    };
}
