// ============================================================
// TEX FOR EVER 
// config.js
// SUPABASE CLOUD SYNC
// LOCAL-FIRST + CLOUD SYNC
// ============================================================
//
// ✅ LocalStorage
// ✅ Supabase Database (PostgreSQL)
// ✅ Offline Local Save
// ✅ Online Cloud Save
// ✅ Pending Queue
// ✅ Automatic Online Sync
// ✅ Existing ERP firebaseSave() compatibility
// ✅ IndexedDB Unlimited Storage Integration
// ✅ Settings Cloud Sync Switch (ON / OFF Guard)
// ✅ Auto-Sync Interceptor for All Pages
// ============================================================

"use strict";

// ============================================================
// SETTINGS SWITCH: CLOUD SYNC CONTROLLER (ON / OFF)
// ============================================================
window.isCloudSyncActive = function () {
    const setting = localStorage.getItem("erp_cloud_sync_enabled");
    // செட்டிங்ஸ் பேஜில் OFF செய்யப்பட்டிருந்தால் false தரும், இல்லையேல் true
    return setting !== "false";
};

// ============================================================
// INDEXED DB STORAGE SYSTEM (GLOBAL UNLIMITED STORAGE)
// ============================================================
window.StorageDB = {
    cache: {},
    db: null,
    isReady: false,
    async init() {
        return new Promise((resolve) => {
            const req = indexedDB.open("TexforeverStorageDB", 1);
            req.onupgradeneeded = (e) => {
                e.target.result.createObjectStore("store");
            };
            req.onsuccess = (e) => {
                this.db = e.target.result;
                const tx = this.db.transaction("store", "readonly");
                const cursorReq = tx.objectStore("store").openCursor();
                cursorReq.onsuccess = (e) => {
                    const cursor = e.target.result;
                    if (cursor) {
                        this.cache[cursor.key] = cursor.value;
                        cursor.continue();
                    } else {
                        this.migrateFromLocalStorage();
                        this.isReady = true;
                        if (typeof window.populateDropdowns === "function") {
                            window.populateDropdowns();
                        }
                        resolve();
                    }
                };
                cursorReq.onerror = () => {
                    this.migrateFromLocalStorage();
                    this.isReady = true;
                    if (typeof window.populateDropdowns === "function") {
                        window.populateDropdowns();
                    }
                    resolve();
                };
            };
            req.onerror = () => {
                this.migrateFromLocalStorage();
                this.isReady = true;
                if (typeof window.populateDropdowns === "function") {
                    window.populateDropdowns();
                }
                resolve();
            };
        });
    },
    migrateFromLocalStorage() {
        let migrated = false;
        for (let i = 0; i < localStorage.length; i++) {
            let key = localStorage.key(i);
            if (this.cache[key] === undefined) {
                let val = localStorage.getItem(key);
                this.cache[key] = val;
                if(this.db) {
                    try { this.db.transaction("store", "readwrite").objectStore("store").put(val, key); } catch(e){}
                }
                migrated = true;
            }
        }
        if(migrated) console.log("✅ Migrated localStorage to IndexedDB successfully");
    },
    getItem(key) {
        if (this.cache[key] !== undefined) return this.cache[key];
        return localStorage.getItem(key);
    },
    setItem(key, value) {
        this.cache[key] = value;
        try { 
            localStorage.setItem(key, value); 
        } catch(e) {
            console.warn("localStorage quota exceeded, safely relying on IndexedDB");
        }
        if(this.db) {
            try { this.db.transaction("store", "readwrite").objectStore("store").put(value, key); } catch(e){}
        }
    },
    removeItem(key) {
        delete this.cache[key];
        try { localStorage.removeItem(key); } catch(e) {}
        if(this.db) {
            try { this.db.transaction("store", "readwrite").objectStore("store").delete(key); } catch(e){}
        }
    },
    clear() {
        this.cache = {};
        try { localStorage.clear(); } catch(e) {}
        if(this.db) {
            try { this.db.transaction("store", "readwrite").objectStore("store").clear(); } catch(e){}
        }
    }
};

// Initialize immediately
window.StorageDB.init();

// ============================================================
// SYSTEM MODE
// ============================================================

window.isDemo = false;

window.TEXFOREVER_CLOUD = {
    ENABLED: true,
    FIRESTORE: false,
    AUTH: false,
    STORAGE: false,
    RTDB: true // Kept for compatibility flags if any
};
// ============================================================
// SUPABASE CONFIG (Settings Page-ல் இருந்து Auto-fetch செய்யும் முறை)
// ============================================================

function readSupabaseStoredValue(primaryKey, alternativeKeys = []) {
    const keysToTry = [primaryKey, ...alternativeKeys];
    for (let key of keysToTry) {
        try {
            const raw = (window.StorageDB && typeof window.StorageDB.getItem === "function")
                ? window.StorageDB.getItem(key)
                : localStorage.getItem(key);
            if (raw !== null && raw !== undefined && raw !== "") {
                try {
                    const parsed = JSON.parse(raw);
                    let val = (typeof parsed === "string") ? parsed : (parsed == null ? "" : String(parsed));
                    if (val.trim() !== "") return val;
                } catch (e) {
                    if (String(raw).trim() !== "") return raw;
                }
            }
        } catch (e) {}
    }
    return "";
}

window.TEXFOREVER_SUPABASE_CONFIG = {
    url: readSupabaseStoredValue("custom_supabase_url", ["supabase_url", "supabaseUrl", "serverUrl", "db_url"]),
    key: readSupabaseStoredValue("custom_supabase_key", ["supabase_key", "supabaseKey", "apiKey", "db_key"])
};

// ============================================================
// GLOBAL SUPABASE VARIABLES
// ============================================================

window.supabaseClient = null;
window.supabaseConnected = false;
window.cloudSyncReady = false;
window.supabaseInitializing = false;
window.supabaseInitStarted = false;
window.cloudSyncPromise = null;

// Compatibility placeholders
window._doc = null;
window._setDoc = null;
window._getDoc = null;
window._deleteDoc = null;
window._collection = null;
window._getDocs = null;


// ============================================================
// CLOUD STATUS HELPERS
// ============================================================
window.isCloudEnabled = function () { return window.isCloudSyncActive(); };
window.isFirestoreEnabled = function () { return false; };
window.isAuthEnabled = function () { return false; };
window.isStorageEnabled = function () { return false; };
window.isRTDBEnabled = function () { return window.isCloudSyncActive(); };

// ============================================================
// LOCAL STORAGE HELPERS (Now Powered by StorageDB)
// ============================================================

window.localLoad = function (key, fallback = null) {
    try {
        const raw = window.StorageDB ? window.StorageDB.getItem(key) : localStorage.getItem(key);
        if (raw === null || raw === "") { return fallback; }
        try {
            const parsed = JSON.parse(raw);
            return (parsed ?? fallback);
        } catch (error) {
            return raw;
        }
    } catch (error) {
        console.error("localLoad Error:", key, error);
        return fallback;
    }
};
// ============================================================
// OFFLINE AUTHENTICATION GUARD (ADDED TO PREVENT LOGOUT)
// ============================================================
(function checkOfflineAuth() {
    if (window.location.pathname.includes("index.html")) return;

    if (!navigator.onLine) {
        const loggedUser = window.localLoad("erp_logged_user");
        if (!loggedUser) {
            console.warn("Offline Auth Failed: No local user found. Redirecting...");
            window.location.href = "index.html"; 
        } else {
            console.log("🟢 Offline Auth Success: User bypass allowed.");
        }
    }
})();

// ============================================================
// LOCAL SAVE (Now Powered by StorageDB)
// ============================================================

window.localSave = function (key, data) {
    try {
        const strData = JSON.stringify(data);
        if (window.StorageDB) {
            window.StorageDB.setItem(key, strData);
        } else {
            localStorage.setItem(key, strData);
        }
        if (key === "design_masters_data" || key === "design_specs" || key === "pre_design_numbers") {
            setTimeout(function () {
                if (typeof window.populateDropdowns === "function") {
                    window.populateDropdowns();
                }
            }, 50);
        }
        return true;
    } catch (error) {
        console.error("localSave Error:", key, error);
        return false;
    }
};

// ============================================================
// INTERNET STATUS
// ============================================================

window.isInternetAvailable = function () {
    return (navigator.onLine === true);
};

// ============================================================
// ERP CLOUD KEYS
// ============================================================

window.erpCloudKeys = [
    "design_specs",
    "pre_design_numbers",
    "design_masters_data",
    "weft_entry_data",
    "warp_entry_data",
    "denting_drawing_data",
    "weave_designs",
    "warping_issue_records",
    "weaving_master_data",
    "weaving_warp_trans",
    "weaving_weft_trans",
    "party_orders_data",
    "dyeing_issue_records",
    "dyeing_receive_records",
    "tex_master_weavers",
    "tex_master_warping_units",
    "washing_issue_records",
    "washing_receive_records",
    "tex_master_washing_units",
    "kora_stock_records",
    "kora_issue_records",
    "tex_master_mills",
    "tex_master_units",
    "tex_master_counts",
    "party_master_db",
    "user_permissions",
    "erp_system_users",
    "master_settings"
];

// ============================================================
// CLOUD ROOT
// ============================================================
window.TEXFOREVER_CLOUD_ROOT = "texforever";

// ============================================================
// DIRTY TRACKING (Powered by StorageDB)
// ============================================================

function getDirtyKey(key) { return ("__texforever_dirty__" + key); }
function getTimeKey(key) { return ("__texforever_local_time__" + key); }

function markLocalDirty(key) {
    try {
        if (window.StorageDB) {
            window.StorageDB.setItem(getDirtyKey(key), "1");
            window.StorageDB.setItem(getTimeKey(key), String(Date.now()));
        } else {
            localStorage.setItem(getDirtyKey(key), "1");
            localStorage.setItem(getTimeKey(key), String(Date.now()));
        }
    } catch (error) {
        console.warn("Unable to mark dirty:", key);
    }
}

function clearLocalDirty(key) {
    try {
        if (window.StorageDB) { window.StorageDB.removeItem(getDirtyKey(key)); } 
        else { localStorage.removeItem(getDirtyKey(key)); }
    } catch (error) {}
}

function isLocalDirty(key) {
    try {
        const val = window.StorageDB ? window.StorageDB.getItem(getDirtyKey(key)) : localStorage.getItem(getDirtyKey(key));
        return (val === "1");
    } catch (error) {
        return false;
    }
}

// ============================================================
// OFFLINE QUEUE (Powered by StorageDB)
// ============================================================

window.offlineSyncQueue = window.offlineSyncQueue || {};

function queueOfflineData(key, data) {
    try {
        window.offlineSyncQueue[key] = data;
        const val = JSON.stringify(window.offlineSyncQueue);
        if (window.StorageDB) { window.StorageDB.setItem("__texforever_offline_queue__", val); } 
        else { localStorage.setItem("__texforever_offline_queue__", val); }
    } catch (error) {
        console.error("Offline Queue Error:", error);
    }
}

function loadOfflineQueue() {
    try {
        const raw = window.StorageDB ? window.StorageDB.getItem("__texforever_offline_queue__") : localStorage.getItem("__texforever_offline_queue__");
        if (!raw) { window.offlineSyncQueue = {}; return; }
        window.offlineSyncQueue = JSON.parse(raw) || {};
    } catch (error) {
        window.offlineSyncQueue = {};
    }
}

function removeQueueItem(key) {
    try {
        delete window.offlineSyncQueue[key];
        const val = JSON.stringify(window.offlineSyncQueue);
        if (window.StorageDB) { window.StorageDB.setItem("__texforever_offline_queue__", val); } 
        else { localStorage.setItem("__texforever_offline_queue__", val); }
    } catch (error) {}
}

loadOfflineQueue();

// ============================================================
// SAFE JSON
// ============================================================

function safeJSONParse(value, fallback = null) {
    try { return JSON.parse(value); } catch (error) { return fallback; }
}

// ============================================================
// NOTIFICATION
// ============================================================

window.showNotification = function (message, type = "success") {
    try {
        const oldNotif = document.getElementById("erp-custom-notification");
        if (oldNotif) { oldNotif.remove(); }
        if (!document.body) { console.log("Notification:", message); return; }

        const notification = document.createElement("div");
        notification.id = "erp-custom-notification";
        notification.innerText = message;
        notification.style.position = "fixed";
        notification.style.bottom = "24px";
        notification.style.left = "50%";
        notification.style.transform = "translateX(-50%)";
        notification.style.zIndex = "999999";
        notification.style.padding = "12px 20px";
        notification.style.borderRadius = "12px";
        notification.style.color = "#FFFFFF";
        notification.style.fontFamily = "sans-serif";
        notification.style.fontSize = "14px";
        notification.style.fontWeight = "700";
        notification.style.textAlign = "center";
        notification.style.boxShadow = "0 6px 25px rgba(0,0,0,0.35)";
        notification.style.maxWidth = "calc(100% - 30px)";
        notification.style.background = type === "success" ? "#10B981" : type === "warning" ? "#F59E0B" : "#EF4444";

        document.body.appendChild(notification);

        setTimeout(function () {
            if (notification && notification.parentNode) {
                notification.style.opacity = "0";
                notification.style.transition = "opacity 0.3s ease";
                setTimeout(function () {
                    if (notification && notification.parentNode) { notification.remove(); }
                }, 300);
            }
        }, 2200);

    } catch (error) {
        console.log("Notification:", message);
    }
};

// ============================================================
// NETWORK STATUS
// ============================================================

function updateNetworkStatus() {
    if (!document.body) { return; }

    if (window._networkStatusTimer) {
        clearTimeout(window._networkStatusTimer);
        window._networkStatusTimer = null;
    }

    try {
        const old = document.getElementById("texforever-network-status");
        if (old && old.parentNode) { old.parentNode.removeChild(old); }
    } catch (e) {}

    const bar = document.createElement("div");
    bar.id = "texforever-network-status";

    if (!window.isCloudSyncActive()) {
        bar.innerHTML = "📴 OFFLINE MODE — Cloud Sync Disabled in Settings";
        bar.style.background = "#64748B";
        bar.style.color = "#FFFFFF";
    } else if (window.supabaseConnected === true) {
        bar.innerHTML = "🟢 ONLINE — Supabase Cloud Connected";
        bar.style.background = "#10B981";
        bar.style.color = "#FFFFFF";
    } else if (navigator.onLine === true) {
        bar.innerHTML = "🌐 ONLINE — Supabase Connecting...";
        bar.style.background = "#3B82F6";
        bar.style.color = "#FFFFFF";
    } else {
        bar.innerHTML = "📴 OFFLINE — Local Data Saved";
        bar.style.background = "#F59E0B";
        bar.style.color = "#111827";
    }

    bar.style.position = "fixed";
    bar.style.left = "0";
    bar.style.right = "0";
    bar.style.top = "0";
    bar.style.padding = "6px";
    bar.style.textAlign = "center";
    bar.style.fontFamily = "sans-serif";
    bar.style.fontSize = "11px";
    bar.style.fontWeight = "700";
    bar.style.zIndex = "999998";

    document.body.appendChild(bar);

    window._networkStatusTimer = setTimeout(function () {
        try {
            const el = document.getElementById("texforever-network-status");
            if (el && el.parentNode) { el.parentNode.removeChild(el); }
        } catch(e) {}
        window._networkStatusTimer = null;
    }, 3000);
}

window.addEventListener("online", function () {
    updateNetworkStatus();
    if (window.isCloudSyncActive()) {
        setTimeout(function () { syncOfflineQueue(); }, 800);
    }
});

window.addEventListener("offline", function () {
    window.supabaseConnected = false;
    updateNetworkStatus();
});

// ============================================================
// LOAD SUPABASE COMPAT SDK
// ============================================================

function loadScript(src) {
    return new Promise(function (resolve, reject) {
        const existing = document.querySelector('script[src="' + src + '"]');
        if (existing) { resolve(); return; }
        
        const script = document.createElement("script");
        script.src = src;
        script.async = true;
        script.onload = function () { resolve(); };
        script.onerror = function () { reject(new Error("Supabase SDK failed to load")); };
        document.head.appendChild(script);
    });
}

// ============================================================
// SUPABASE INITIALIZE (GUARDED)
// ============================================================

window.initializeSupabase = async function (doFullSync) {
    if (!window.isCloudSyncActive()) {
        console.log("📴 Cloud Sync is OFF in Settings. Offline mode active.");
        window.supabaseConnected = false;
        return false;
    }

    if (doFullSync === undefined) { doFullSync = true; }
    if (window.supabaseInitStarted && window.cloudSyncPromise) { return window.cloudSyncPromise; }

    window.supabaseInitStarted = true;
    window.supabaseInitializing = true;

    window.cloudSyncPromise = (async function () {
        try {
            if (!window.TEXFOREVER_SUPABASE_CONFIG.url || !window.TEXFOREVER_SUPABASE_CONFIG.key) {
                console.log("ℹ️ Supabase URL/Key not set yet. Skipping cloud sync (offline/local mode).");
                window.supabaseConnected = false;
                window.cloudSyncReady = false;
                window.supabaseInitializing = false;
                updateNetworkStatus();
                return false;
            }

            await loadScript("https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2");

            if (typeof supabase === "undefined") {
                throw new Error("Supabase SDK unavailable");
            }

            window.supabaseClient = supabase.createClient(
                window.TEXFOREVER_SUPABASE_CONFIG.url,
                window.TEXFOREVER_SUPABASE_CONFIG.key
            );

            window.supabaseConnected = true;
            window.cloudSyncReady = true;
            window.supabaseInitializing = false;
            
            updateNetworkStatus();

            if (navigator.onLine && doFullSync) {
                await syncAllCloudData();
                await syncOfflineQueue();
            }

            console.log("✅ TEX FOR EVER Supabase Cloud initialized");
            return true;

        } catch (error) {
            console.error("❌ Supabase initialization failed:", error);
            window.supabaseConnected = false;
            window.cloudSyncReady = false;
            window.supabaseInitializing = false;
            updateNetworkStatus();
            return false;
        }
    })();

    return window.cloudSyncPromise;
};

window.initializeFirebase = window.initializeSupabase;

// ============================================================
// CLOUD SAVE DIRECT (GUARDED)
// ============================================================

async function cloudSave(key, data) {
    if (!window.isCloudSyncActive()) {
        console.log("📴 Cloud Save blocked by user setting (Offline mode)");
        return false;
    }
    if (!window.supabaseClient || !navigator.onLine) { return false; }
    try {
        const { error } = await window.supabaseClient
            .from('erp_sync_data')
            .upsert({ id: key, json_data: data });

        if (error) throw error;

        clearLocalDirty(key);
        removeQueueItem(key);
        console.log("☁️ Cloud Saved:", key);
        return true;
    } catch (error) {
        console.error("Cloud Save Error:", key, error);
        return false;
    }
}

// ============================================================
// CLOUD LOAD DIRECT (GUARDED)
// ============================================================

async function cloudLoad(key, fallback = null) {
    if (!window.isCloudSyncActive()) {
        return fallback;
    }
    if (!window.supabaseClient) { return fallback; }
    try {
        const { data, error } = await window.supabaseClient
            .from('erp_sync_data')
            .select('json_data')
            .eq('id', key)
            .single();

        if (data && data.json_data) { return data.json_data; }
        return fallback;
    } catch (error) {
        return fallback;
    }
}

// ============================================================
// MAIN SAVE FUNCTION
// ============================================================

window.firebaseSave = async function (key, data) {
    try {
        // ALWAYS SAVE LOCAL FIRST
        const localSaved = window.localSave(key, data);
        if (!localSaved) {
            window.showNotification("❌ Local Save Failed", "error");
            return false;
        }

        // IF CLOUD SYNC IS OFF IN SETTINGS, STOP HERE SAFELY
        if (!window.isCloudSyncActive()) {
            window.showNotification("💾 Local Save (Cloud Disabled) ✓", "success");
            return true;
        }

        // MARK LOCAL CHANGE
        markLocalDirty(key);

        // QUEUE
        queueOfflineData(key, data);

        // TRY SUPABASE
        if (navigator.onLine) {
            if (!window.supabaseClient) {
                await initializeSupabase(false);
            }
            if (window.supabaseClient && window.supabaseConnected) {
                const cloudSaved = await cloudSave(key, data);
                if (cloudSaved) {
                    window.showNotification("☁️ Supabase Cloud Saved ✓", "success");
                    return true;
                }
            }
        }

        // OFFLINE / CLOUD UNAVAILABLE
        window.showNotification("💾 Saved Locally — Cloud Pending", "warning");
        return true;

    } catch (error) {
        console.error("supabaseSave Error:", error);
        try {
            window.localSave(key, data);
            markLocalDirty(key);
            queueOfflineData(key, data);
        } catch (e) {}

        window.showNotification("💾 Local Save — Cloud Pending", "warning");
        return true;
    }
};

window.supabaseSave = window.firebaseSave;

// ============================================================
// AUTO-SYNC INTERCEPTOR (எந்த பக்கத்தில் சேவ் ஆனாலும் ஆட்டோமேட்டிக்காக Supabase erp_sync_data-க்கு அனுப்பும்)
// ============================================================
const originalLocalStorageSet = localStorage.setItem;
localStorage.setItem = function(key, value) {
    originalLocalStorageSet.apply(this, arguments);
    if (key && !key.startsWith("__") && !key.includes("theme") && !key.includes("zoom")) {
        if (window.isCloudSyncActive && window.isCloudSyncActive()) {
            let parsedData = value;
            try { parsedData = JSON.parse(value); } catch(e) {}
            if (window.supabaseClient) {
                cloudSave(key, parsedData);
            } else {
                window.initializeSupabase(false).then(() => {
                    if (window.supabaseClient) cloudSave(key, parsedData);
                });
            }
        }
    }
};

// ============================================================
// COMPATIBILITY SAVE
// ============================================================

window.firebaseSaveIndividual = function (key, data, storageType = "both") {
    return window.firebaseSave(key, data);
};

// ============================================================
// MAIN LOAD FUNCTION
// ============================================================

window.firebaseLoad = function (key, fallback = null) {
    const localData = window.localLoad(key, null);
    if (localData !== null && localData !== undefined) {
        return localData;
    }
    return fallback;
};

window.supabaseLoad = window.firebaseLoad;

// ============================================================
// CLOUD LOAD + LOCAL CACHE (GUARDED)
// ============================================================

window.firebaseLoadCloud = async function (key, fallback = null) {
    try {
        if (!window.isCloudSyncActive()) {
            return window.localLoad(key, fallback);
        }

        if (!window.supabaseClient) {
            await initializeSupabase();
        }
        if (window.supabaseClient && navigator.onLine) {
            const data = await cloudLoad(key, null);
            if (data !== null && data !== undefined) {
                window.localSave(key, data);
                return data;
            }
        }
    } catch (error) {
        console.warn("Cloud load fallback:", error);
    }
    return window.localLoad(key, fallback);
};

window.supabaseLoadCloud = window.firebaseLoadCloud;

// ============================================================
// SYNC ONE LOCAL KEY TO CLOUD (GUARDED)
// ============================================================

async function syncOneKey(key) {
    if (!window.isCloudSyncActive()) { return false; }
    if (!window.supabaseClient || !navigator.onLine) { return false; }
    const data = window.localLoad(key, null);
    if (data === null) { return false; }
    return await cloudSave(key, data);
}

// ============================================================
// OFFLINE QUEUE SYNC (GUARDED)
// ============================================================

window.syncOfflineQueue = async function () {
    if (!window.isCloudSyncActive()) { return false; }
    if (!navigator.onLine) { return false; }
    if (!window.supabaseClient) { await initializeSupabase(); }
    if (!window.supabaseClient) { return false; }

    const queue = Object.assign({}, window.offlineSyncQueue);
    const keys = Object.keys(queue);
    
    if (keys.length === 0) { return true; }

    let successCount = 0;
    for (const key of keys) {
        try {
            const saved = await cloudSave(key, queue[key]);
            if (saved) { successCount++; }
        } catch (error) {
            console.error("Queue sync error:", key, error);
        }
    }

    if (successCount > 0) {
        console.log("☁️ Queue synced:", successCount);
    }
    return (successCount === keys.length);
};

// ============================================================
// INITIAL CLOUD → LOCAL SYNC (GUARDED)
// ============================================================

async function syncAllCloudData() {
    if (!window.isCloudSyncActive()) { return false; }
    if (!window.supabaseClient || !navigator.onLine) { return false; }

    let synced = 0;
    for (const key of window.erpCloudKeys) {
        try {
            if (isLocalDirty(key)) { continue; }

            const cloudData = await cloudLoad(key, null);
            if (cloudData !== null && cloudData !== undefined) {
                window.localSave(key, cloudData);
                synced++;
            }
        } catch (error) {}
    }

    console.log("☁️ Cloud → Local synced:", synced);
    if (synced > 0 && typeof window.populateDropdowns === "function") {
        window.populateDropdowns();
    }
    return true;
}

// ============================================================
// FULL LOCAL → CLOUD SYNC (GUARDED)
// ============================================================

window.syncERPToCloud = async function () {
    if (!window.isCloudSyncActive()) {
        console.log("📴 Cloud sync blocked because mode is OFF.");
        return false;
    }
    if (!navigator.onLine) { return false; }
    if (!window.supabaseClient) { await initializeSupabase(); }
    if (!window.supabaseClient) { return false; }

    let count = 0;
    for (const key of window.erpCloudKeys) {
        try {
            if (isLocalDirty(key)) {
                const result = await syncOneKey(key);
                if (result) { count++; }
            }
        } catch (error) {}
    }

    await syncOfflineQueue();
    console.log("☁️ Local → Cloud completed:", count);
    return true;
};

// ============================================================
// OLD FUNCTION COMPATIBILITY
// ============================================================

window.syncERPFromCloud = async function () {
    if (!window.isCloudSyncActive()) { return false; }
    if (!navigator.onLine) { return false; }
    if (!window.supabaseClient) { await initializeSupabase(); }
    if (!window.supabaseClient) { return false; }
    return await syncAllCloudData();
};

// ============================================================
// WAIT FOR CLOUD
// ============================================================

window.waitForCloudSync = async function (timeout = 15000) {
    if (!window.isCloudSyncActive()) { return false; }
    if (window.cloudSyncReady) { return true; }
    if (!navigator.onLine) { return false; }

    try {
        await Promise.race([
            initializeSupabase(),
            new Promise(function (resolve) { setTimeout(resolve, timeout); })
        ]);
        return (window.cloudSyncReady || !!window.supabaseClient);
    } catch (error) {
        return false;
    }
};

// ============================================================
// FACTORY RESET
// ============================================================

window.factoryResetCloud = async function () {
    const confirmed = window.confirm(
        "⚠️ FACTORY RESET\n\n" +
        "இந்த device-ல் உள்ள TEX FOR EVER data அனைத்தும் அழிக்கப்படும்.\n\n" +
        "Continue செய்ய OK அழுத்தவும்."
    );

    if (!confirmed) { return; }

    const finalConfirm = window.confirm(
        "🚨 FINAL CONFIRMATION 🚨\n\n" +
        "OK = DELETE ALL LOCAL ERP DATA\n\n" +
        "Cancel = KEEP DATA"
    );

    if (!finalConfirm) { return; }

    try {
        if (navigator.onLine && window.isCloudSyncActive()) {
            if (!window.supabaseClient) { await initializeSupabase(); }
            if (window.supabaseClient) {
                for (const key of window.erpCloudKeys) {
                    await window.supabaseClient.from('erp_sync_data').delete().eq('id', key);
                }
            }
        }

        if (window.StorageDB) window.StorageDB.clear();
        localStorage.clear();
        sessionStorage.clear();
        window.offlineSyncQueue = {};

        alert("✅ Local + Supabase ERP Data Cleared!");
        window.location.href = "index.html";

    } catch (error) {
        console.error("Factory Reset Error:", error);
        alert("❌ Factory Reset Failed: " + error.message);
    }
};

window.handleCloudReset = window.factoryResetCloud;

// ============================================================
// CLEAR LOCAL CACHE
// ============================================================

window.clearLocalCache = function () {
    const confirmed = window.confirm(
        "🧹 CLEAR LOCAL CACHE\n\n" +
        "Local ERP data மட்டும் இந்த device-ல் இருந்து அழிக்கப்படும்.\n\n" +
        "Supabase Cloud data அழிக்கப்படாது.\n\n" +
        "Continue செய்ய OK அழுத்தவும்."
    );

    if (!confirmed) { return; }

    try {
        if (window.StorageDB) window.StorageDB.clear();
        localStorage.clear();
        sessionStorage.clear();
        window.offlineSyncQueue = {};

        alert("✅ Local Cache Cleared!");
        window.location.reload();
    } catch (error) {
        alert("❌ Clear Cache Error: " + error.message);
    }
};

window.handleLocalReset = window.clearLocalCache;

// ============================================================
// CROSS PAGE DATA
// ============================================================

window.getCrossPageData = function (designNo, recordKey) {
    const cleanTarget = designNo ? String(designNo).replace("#", "").trim().toLowerCase() : "";
    if (!cleanTarget) { return null; }

    try {
        const records = window.localLoad(recordKey, []);
        if (Array.isArray(records)) {
            const match = records.slice().reverse().find(function (r) {
                if (!r || typeof r !== "object") { return false; }
                const d = r.designNo || r.designNumber || r.design || r.name || "";
                return (String(d).replace("#", "").trim().toLowerCase() === cleanTarget);
            });
            if (match) { return match; }
        }

        const specs = window.localLoad("design_specs", {});
        if (specs && typeof specs === "object") {
            const key = Object.keys(specs).find(function (k) {
                return (String(k).replace("#", "").trim().toLowerCase() === cleanTarget);
            });
            if (key && specs[key]) { return specs[key]; }
        }
    } catch (error) {
        console.error("getCrossPageData Error:", error);
    }
    return null;
};

// ============================================================
// DROPDOWN BUILDER
// ============================================================

window.populateDropdowns = function () {
    try {
        let designSpecs = window.localLoad("design_specs", {});
        if (!designSpecs || typeof designSpecs !== "object") {
            designSpecs = {};
        }

        const designMasters = window.localLoad("design_masters_data", []);
        let preDesignList = window.localLoad("pre_design_numbers", null) || window.localLoad("tex_master_designs", []);
        if (!Array.isArray(preDesignList)) { preDesignList = []; }

        const masterNames = [];
        if (Array.isArray(designMasters)) {
            designMasters.forEach(function (d) {
                if (!d) return;
                const name = (typeof d === "object") ? (d.designNumber || d.designNo || d.design || d.name || "") : d;
                if (name) masterNames.push(String(name).trim());
            });
        } else if (designMasters && typeof designMasters === "object") {
            Object.values(designMasters).forEach(function (d) {
                if (!d) return;
                const name = (typeof d === "object") ? (d.designNumber || d.designNo || d.design || d.name || "") : d;
                if (name) masterNames.push(String(name).trim());
            });
        }

        const preNames = preDesignList
            .map(function (d) { return (typeof d === "object" && d !== null) ? (d.designNo || d.designNumber || d.design || d.name || "") : d; })
            .filter(Boolean)
            .map(function (s) { return String(s).trim(); });

        const specNames = [];
        if (Array.isArray(designSpecs)) {
            designSpecs.forEach(function (d) {
                const name = (typeof d === "object" && d !== null) ? (d.designNumber || d.designNo || d.design || d.name || "") : d;
                if (name) specNames.push(String(name).trim());
            });
            const obj = {};
            designSpecs.forEach(function (d) {
                const name = (typeof d === "object" && d !== null) ? (d.designNumber || d.designNo || "") : d;
                if (name) obj[name] = d;
            });
            designSpecs = obj;
        } else {
            Object.keys(designSpecs).forEach(function (k) {
                if (isNaN(k)) {
                    specNames.push(String(k).trim());
                } else if (designSpecs[k]) {
                    const d = designSpecs[k];
                    const name = (typeof d === "object" && d !== null) ? (d.designNumber || d.designNo || "") : d;
                    if (name) specNames.push(String(name).trim());
                }
            });
        }

        const allNames = [...masterNames, ...preNames, ...specNames];
        const combined = [];
        const seenClean = new Set();

        allNames.forEach(function (name) {
            if (!name) return;
            const clean = String(name).replace("#", "").trim().toLowerCase();
            if (!seenClean.has(clean)) {
                seenClean.add(clean);
                combined.push(name);
            }
        });

        combined.forEach(function (name) {
            const clean = String(name).replace("#", "").trim().toLowerCase();
            const exists = Object.keys(designSpecs).some(function (k) {
                return (String(k).replace("#", "").trim().toLowerCase() === clean);
            });
            if (!exists) {
                designSpecs[name] = { designNumber: name, status: "running" };
            }
        });

        if (window.StorageDB) {
            window.StorageDB.setItem("design_specs", JSON.stringify(designSpecs));
            window.StorageDB.setItem("pre_design_numbers", JSON.stringify(combined));
        } else {
            localStorage.setItem("design_specs", JSON.stringify(designSpecs));
            localStorage.setItem("pre_design_numbers", JSON.stringify(combined));
        }

        document.querySelectorAll("select").forEach(function (select) {
            const id = (String(select.id || "") + " " + String(select.className || "") + " " + String(select.name || "")).toLowerCase();
            if (
                id.includes("design") || 
                select.id === "designNumber" || 
                select.id === "designSelect" || 
                select.classList.contains("item-design")
            ) {
                const current = select.value;
                select.innerHTML = '<option value="">Select Design No</option>';
                combined.forEach(function (name) {
                    const opt = document.createElement("option");
                    opt.value = name;
                    opt.textContent = name;
                    select.appendChild(opt);
                });
                if (current) { select.value = current; }

                if (!select.dataset.designRefreshBound) {
                    select.dataset.designRefreshBound = "1";
                    ["focus", "mousedown", "click"].forEach(function (evt) {
                        select.addEventListener(evt, function () {
                            window.populateDropdowns();
                        });
                    });
                }
            }
        });
    } catch (error) {
        console.error("Dropdown Populate Error:", error);
    }
};

// ============================================================
// ENTER KEY NAVIGATION
// ============================================================

document.addEventListener("keydown", function (event) {
    if (event.key !== "Enter") { return; }
    const activeElement = document.activeElement;
    if (!activeElement) { return; }
    if (activeElement.tagName === "TEXTAREA") { return; }

    if (
        activeElement.classList.contains("edit-btn") ||
        activeElement.classList.contains("delete-btn") ||
        activeElement.id === "editBtn" ||
        activeElement.id === "deleteBtn"
    ) { return; }

    const focusableElements = Array.from(
        document.querySelectorAll(
            'input:not([type="hidden"]):not([disabled]),' +
            'select:not([disabled]),' +
            'textarea:not([disabled]),' +
            'button:not([disabled]),' +
            '[tabindex]:not([tabindex="-1"])'
        )
    ).filter(function (el) {
        return (
            el.offsetParent !== null &&
            !el.classList.contains("edit-btn") &&
            !el.classList.contains("delete-btn")
        );
    });

    const currentIndex = focusableElements.indexOf(activeElement);
    if (currentIndex > -1 && currentIndex < focusableElements.length - 1) {
        event.preventDefault();
        const next = focusableElements[currentIndex + 1];
        if (!next) { return; }
        next.focus();
        if (next.tagName === "INPUT" && next.type === "text") { next.select(); }
    }
});

// ============================================================
// DOM READY
// ============================================================

window.addEventListener("DOMContentLoaded", function () {
    try {
        window.populateDropdowns();
    } catch (error) {
        console.warn("Dropdown init error:", error);
    }

    updateNetworkStatus();

    // Supabase initialization (starts only if mode is ON)
    setTimeout(function () { 
        if (navigator.onLine && window.isCloudSyncActive()) {
            initializeSupabase(); 
        }
    }, 300);

    // Late-rendered elements fallback
    setTimeout(function () {
        if (typeof window.populateDropdowns === "function") {
            window.populateDropdowns();
        }
    }, 400);

    let designRetryCount = 0;
    const designRetryTimer = setInterval(function () {
        designRetryCount++;
        if (typeof window.populateDropdowns === "function") {
            window.populateDropdowns();
        }
        if ((window.StorageDB && window.StorageDB.isReady) || designRetryCount >= 10) {
            clearInterval(designRetryTimer);
        }
    }, 500);
});

// ============================================================
// GLOBAL THEME ENGINE (FIXED INPUTS, HEADERS & TYPING BOX COLORS)
// ============================================================

(function () {
    function applyGlobalTheme() {
        const savedMode = localStorage.getItem("erp_theme_mode") || "dark";
        const old = document.getElementById("global-perfect-theme");
        if (old) { old.remove(); }

        let css = `
        html, body {
            min-height: 100% !important;
            margin: 0 !important;
            transition: background 0.3s ease, color 0.3s ease;
        }
        .container, .main-card, .form-container, .card {
            width: 96% !important;
            max-width: 1100px !important;
            margin-left: auto !important;
            margin-right: auto !important;
        }
        input[type="text"], input[type="number"], input[type="date"], input[type="password"], input[type="email"], select, textarea {
            background-color: #FFFFFF !important;
            color: #0F172A !important;
            font-weight: 700 !important;
            border: 1.5px solid #38BDF8 !important;
        }
        input::placeholder, textarea::placeholder {
            color: #64748B !important;
            font-weight: 600 !important;
        }
        `;

        if (savedMode === "dark") {
            css += `
            html, body { background: #030712 !important; color: #F8FAFC !important; }
            .top-header-container, .container, .main-card, .form-container, .card { background: #0F172A !important; color: #F8FAFC !important; border-color: #38BDF8 !important; }
            .stats-banner, .stat-box { background: #111827 !important; color: #F8FAFC !important; border-color: #38BDF8 !important; }
            .stat-value, .live-clock { color: #38BDF8 !important; }
            .menu-btn { border-color: #38BDF8 !important; }
            input, select, textarea { background: #FFFFFF !important; color: #0F172A !important; border-color: #38BDF8 !important; }
            `;
        } else if (savedMode === "softgreen") {
            css += `
            html, body { background: #ECFDF5 !important; color: #064E3B !important; }
            .top-header-container, .container, .main-card, .form-container, .card { background: #D1FAE5 !important; color: #064E3B !important; border-color: #10B981 !important; }
            .stats-banner, .stat-box { background: #ECFDF5 !important; color: #064E3B !important; border-color: #34D399 !important; }
            .stat-value, .live-clock { color: #059669 !important; }
            .menu-btn { border-color: #34D399 !important; }
            input, select, textarea { background: #FFFFFF !important; color: #064E3B !important; border-color: #10B981 !important; }
            `;
        } else if (savedMode === "darkgreen") {
            css += `
            html, body { background: #021C12 !important; color: #ECFDF5 !important; }
            .top-header-container, .container, .main-card, .form-container, .card { background: #063B27 !important; color: #ECFDF5 !important; border-color: #22C55E !important; }
            .stats-banner, .stat-box { background: #075E45 !important; color: #ECFDF5 !important; border-color: #22C55E !important; }
            .stat-value, .live-clock { color: #4ADE80 !important; }
            .menu-btn { border-color: #22C55E !important; }
            input, select, textarea { background: #FFFFFF !important; color: #064E3B !important; border-color: #22C55E !important; }
            `;
        } else if (savedMode === "sunset") {
            css += `
            html, body { background: #1C0F05 !important; color: #FFF7ED !important; }
            .top-header-container, .container, .main-card, .form-container, .card { background: #3B1F0B !important; color: #FFF7ED !important; border-color: #F59E0B !important; }
            .stats-banner, .stat-box { background: #6B3508 !important; color: #FFF7ED !important; border-color: #FBBF24 !important; }
            .stat-value, .live-clock { color: #FBBF24 !important; }
            .menu-btn { border-color: #F59E0B !important; }
            input, select, textarea { background: #FFFFFF !important; color: #7C2D12 !important; border-color: #F59E0B !important; }
            `;
        } else if (savedMode === "royalblue") {
            css += `
            html, body { background: #050B2E !important; color: #EEF2FF !important; }
            .top-header-container, .container, .main-card, .form-container, .card { background: #101A4C !important; color: #EEF2FF !important; border-color: #6366F1 !important; }
            .stats-banner, .stat-box { background: #1E3A8A !important; color: #EEF2FF !important; border-color: #818CF8 !important; }
            .stat-value, .live-clock { color: #A5B4FC !important; }
            .menu-btn { border-color: #818CF8 !important; }
            input, select, textarea { background: #FFFFFF !important; color: #172554 !important; border-color: #6366F1 !important; }
            `;
        }

        const style = document.createElement("style");
        style.id = "global-perfect-theme";
        style.innerHTML = css;
        document.head.appendChild(style);
    }

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", applyGlobalTheme);
    } else {
        applyGlobalTheme();
    }

    window.applySystemTheme = applyGlobalTheme;

    window.setTheme = function (themeName) {
        const validThemes = ["dark", "softgreen", "darkgreen", "sunset", "royalblue"];
        if (!validThemes.includes(themeName)) { return; }
        localStorage.setItem("erp_theme_mode", themeName);
        applyGlobalTheme();
    };

    window.addEventListener("storage", function (event) {
        if (event.key === "erp_theme_mode") { applyGlobalTheme(); }
    });
})();

// ============================================================
// DISPLAY / ZOOM CONTROLLER
// ============================================================

document.addEventListener("DOMContentLoaded", function () {
    if (document.getElementById("texforever-display-controller")) { return; }

    let currentZoom = parseFloat(localStorage.getItem("texforever_zoom_level")) || 1.0;

    function applyZoom(val) {
        document.body.style.zoom = val;
        if (navigator.userAgent.toLowerCase().indexOf("firefox") > -1) {
            document.body.style.transform = `scale(${val})`;
            document.body.style.transformOrigin = "top left";
            document.body.style.width = `${100 / val}%`;
        }
        localStorage.setItem("texforever_zoom_level", val);
    }

    applyZoom(currentZoom);

    let savedTop = localStorage.getItem("texforever_zoom_top") || "15px";
    let savedLeft = localStorage.getItem("texforever_zoom_left") || (window.innerWidth - 65) + "px";

    const controllerDiv = document.createElement("div");
    controllerDiv.id = "texforever-display-controller";
    controllerDiv.style.position = "fixed";
    controllerDiv.style.top = savedTop;
    controllerDiv.style.left = savedLeft;
    controllerDiv.style.zIndex = "999999";
    controllerDiv.innerHTML = `
    <div id="btnToggleZoom" style="touch-action:none; user-select:none; -webkit-user-select:none; background: linear-gradient(135deg, #059669, #10B981); color:white; width:45px; height:45px; border-radius:50%; font-size:20px; cursor:pointer; box-shadow: 0 6px 18px rgba(16,185,129,0.4); display:flex; align-items:center; justify-content:center;">🔍</div>
    <div id="zoomAppPanel" style="display:none; flex-direction:column; gap:10px; background: rgba(18,30,25,0.95); backdrop-filter: blur(8px); border: 1px solid #4A7C59; padding:12px; border-radius:12px; box-shadow: 0 10px 40px rgba(0,0,0,0.6); color:white; width:150px; position:absolute; top:55px; right:0;">
        <div style="font-size:10px; font-weight:800; text-align:center; color:#78d18a;">SCREEN SIZE</div>
        <div style="display:flex; justify-content:space-between; align-items:center; background:#080f0c; border-radius:8px; padding:5px;">
            <div id="btnZoomOut" style="color:#EF4444; font-size:22px; cursor:pointer; width:30px; height:30px; display:flex; align-items:center; justify-content:center; font-weight:bold; user-select:none;">-</div>
            <span id="zoomLabel" style="font-size:13px; font-weight:bold;">${Math.round(currentZoom * 100)}%</span>
            <div id="btnZoomIn" style="color:#10B981; font-size:20px; cursor:pointer; width:30px; height:30px; display:flex; align-items:center; justify-content:center; font-weight:bold; user-select:none;">+</div>
        </div>
        <div id="btnFitScreen" style="background:#3B82F6; color:white; padding:8px; border-radius:6px; font-size:11px; font-weight:bold; text-align:center; cursor:pointer; user-select:none;">Fit to Screen</div>
    </div>`;

    document.body.appendChild(controllerDiv);

    const btnToggle = document.getElementById("btnToggleZoom");
    const panel = document.getElementById("zoomAppPanel");

    let isPanelOpen = false;
    let didMove = false;
    let startX, startY, initialX, initialY;

    btnToggle.addEventListener("touchstart", function (e) {
        startX = e.touches[0].clientX;
        startY = e.touches[0].clientY;
        initialX = controllerDiv.offsetLeft;
        initialY = controllerDiv.offsetTop;
        didMove = false;
    }, { passive: true });

    btnToggle.addEventListener("touchmove", function (e) {
        const dx = e.touches[0].clientX - startX;
        const dy = e.touches[0].clientY - startY;
        if (Math.abs(dx) > 5 || Math.abs(dy) > 5) {
            didMove = true;
            controllerDiv.style.left = (initialX + dx) + "px";
            controllerDiv.style.top = (initialY + dy) + "px";
            controllerDiv.style.right = "auto";
            e.preventDefault();
        }
    }, { passive: false });

    btnToggle.addEventListener("touchend", function () {
        if (didMove) {
            localStorage.setItem("texforever_zoom_top", controllerDiv.style.top);
            localStorage.setItem("texforever_zoom_left", controllerDiv.style.left);
        }
    });

    btnToggle.addEventListener("mousedown", function (e) {
        startX = e.clientX;
        startY = e.clientY;
        initialX = controllerDiv.offsetLeft;
        initialY = controllerDiv.offsetTop;
        didMove = false;

        function onMouseMove(me) {
            const dx = me.clientX - startX;
            const dy = me.clientY - startY;
            if (Math.abs(dx) > 5 || Math.abs(dy) > 5) {
                didMove = true;
                controllerDiv.style.left = (initialX + dx) + "px";
                controllerDiv.style.top = (initialY + dy) + "px";
                controllerDiv.style.right = "auto";
            }
        }

        function onMouseUp() {
            if (didMove) {
                localStorage.setItem("texforever_zoom_top", controllerDiv.style.top);
                localStorage.setItem("texforever_zoom_left", controllerDiv.style.left);
            }
            document.removeEventListener("mousemove", onMouseMove);
            document.removeEventListener("mouseup", onMouseUp);
        }

        document.addEventListener("mousemove", onMouseMove);
        document.addEventListener("mouseup", onMouseUp);
    });

    btnToggle.addEventListener("click", function () {
        if (didMove) { didMove = false; return; }
        isPanelOpen = !isPanelOpen;
        panel.style.display = isPanelOpen ? "flex" : "none";
        btnToggle.innerHTML = isPanelOpen ? "✖" : "🔍";
    });

    document.getElementById("btnZoomIn").onclick = function () {
        if (currentZoom < 2.0) {
            currentZoom = Math.min(2.0, currentZoom + 0.05);
            applyZoom(currentZoom);
            updateZoomLabel();
        }
    };

    document.getElementById("btnZoomOut").onclick = function () {
        if (currentZoom > 0.4) {
            currentZoom = Math.max(0.4, currentZoom - 0.05);
            applyZoom(currentZoom);
            updateZoomLabel();
        }
    };

    document.getElementById("btnFitScreen").onclick = function () {
        currentZoom = 1.0;
        applyZoom(currentZoom);
        updateZoomLabel();
    };

    function updateZoomLabel() {
        const label = document.getElementById("zoomLabel");
        if (label) { label.innerText = Math.round(currentZoom * 100) + "%"; }
    }
});

// ============================================================
// START SUPABASE (GUARDED)
// ============================================================

setTimeout(function () {
    if (navigator.onLine && window.isCloudSyncActive()) {
        initializeSupabase();
    }
}, 500);

// ============================================================
// FINAL STATUS
// ============================================================

console.log("================================================");
console.log("✅ TEX FOR EVER config.js loaded (Auto-Sync Enabled)");
console.log("☁️ MODE: LOCAL-FIRST + SUPABASE");
console.log("☁️ Supabase: " + (window.isCloudSyncActive() ? "ENABLED" : "DISABLED (OFFLINE)"));
console.log("💾 LocalStorage: ENABLED (Backed by IndexedDB)");
console.log("📴 Offline Queue: ENABLED");
console.log("================================================");

// --- Global Print & Style Injector ---
window.addEventListener('DOMContentLoaded', () => {

  // 1. Global Print Function (Capacitor Android Printer Integration)
window.handleGlobalPrint = function(htmlContent) {
    if (window.Capacitor && window.Capacitor.Plugins && window.Capacitor.Plugins.Printer) {
        window.Capacitor.Plugins.Printer.print({
            content: htmlContent || document.documentElement.innerHTML
        }).catch(err => {
            console.error("Printer Plugin Error:", err);
            window.print();
        });
    } else {
        window.print();
    }
};

    // 2. Automatically inject Print CSS to avoid editing every HTML file
    if (!document.getElementById('global-print-style')) {
        const printStyle = document.createElement('style');
        printStyle.id = 'global-print-style';
        printStyle.innerHTML = `
        @media print {
            .top-nav, .mgmt-tabs-container, .action-btn, button, .custom-upload-btn, .choice-modal, header, footer, .back-btn {
                display: none !important;
            }
            body {
                background: #FFFFFF !important;
                color: #000000 !important;
            }
            .main-card {
                border: none !important;
                box-shadow: none !important;
                width: 100% !important;
                max-width: 100% !important;
            }
        }`;
        document.head.appendChild(printStyle);
    }
});
