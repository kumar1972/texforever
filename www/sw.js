// ============================================================
// TEX FOR EVER 
// sw.js
// PWA + OFFLINE ALL PAGES + LOCAL-FIRST + CLOUD READY
// ============================================================
//
// ✅ All ERP HTML pages pre-cached
// ✅ CSS / JS / Images runtime cached
// ✅ Offline navigation
// ✅ Online Network First
// ✅ Offline Cache Fallback
// ✅ Supabase API NOT cached
// ✅ Old TEX FOR EVER caches cleaned
// ✅ Service Worker update support
// ============================================================

"use strict";

// ============================================================
// VERSION (Updated to v10 so Chrome detects changes)
// ============================================================
const CACHE_VERSION = "v10"; 
const CACHE_NAME = "texforever-erp-" + CACHE_VERSION;
const APP_SHELL_CACHE = "texforever-shell-" + CACHE_VERSION;

// ============================================================
// ALL ERP FILES
// ============================================================
const APP_SHELL = [
    "./",
    "./index.html",
    "./config.js",
    "./translator.js",
    "./manifest.json",
    "./style.css",

    // ICONS (Root and Subfolder both supported)
    "./icon-192.png",
    "./icon-512.png",
    "./icon/icon-192.png",
    "./icon/icon-512.png",
    
    // மற்ற அனைத்து பக்கங்கள்...
    "./dashboard.html",
    "./design_list.html",
    "./design_master.html",
    "./design_sheet_print.html",
    "./Party_Orders.html",
    "./kora_yarn.html",
    "./yarn_calc.html",
    "./process_matrix.html",
    "./warp_entry.html",
    "./warping.html",
    "./weft_entry.html",
    "./weaving.html",
    "./weaving_receive.html",
    "./weave_3d.html",
    "./denting_editor.html",
    "./dyeing_issue.html",
    "./dyeing_receive.html",
    "./washing.html",
    "./Despatch.html",
    "./invoice.html",
    "./report.html",
    "./settings.html",
    "./pre_stock.js",
    "./pre_stock_graph.html",
    "./folder.js",
  "./icon/design_list.png",
"./icon/design_master.png",
"./icon/design_sheet_print.png",
"./icon/Despatch.png",
"./icon/dyeing_issue.png",
"./icon/dyeing_receive.png",
"./icon/invoice.png",
"./icon/kora_yarn.png",
"./icon/Party_Orders.png",
"./icon/process_matrix.png",
"./icon/report.png",
"./icon/warp_entry.png",
"./icon/warping.png",
"./icon/washing.png",
"./icon/weaving.png",
"./icon/weaving_receive.png",
"./icon/weft_entry.png",
"./icon/yarn_calc.png",
];

// ============================================================
// INSTALL
// ============================================================

self.addEventListener(
    "install",
    event => {

        console.log(
            "📦 TEX FOR EVER SW installing:",
            CACHE_NAME
        );

        event.waitUntil(
            caches.open(
                APP_SHELL_CACHE
            )
            .then(
                async cache => {
                    console.log(
                        "📥 Caching all ERP pages..."
                    );

                    for (
                        const file of APP_SHELL
                    ) {
                        try {
                            const response =
                                await fetch(
                                    file,
                                    {
                                        cache:
                                            "no-cache"
                                    }
                                );

                            if (
                                response.ok
                            ) {
                                await cache.put(
                                    file,
                                    response
                                );
                                console.log(
                                    "✅ Cached:",
                                    file
                                );
                            } else {
                                console.warn(
                                    "⚠️ Not cached:",
                                    file,
                                    response.status
                                );
                            }

                        } catch (error) {
                            console.warn(
                                "⚠️ Cache failed:",
                                file,
                                error
                            );
                        }
                    }
                }
            )
            .then(
                () => {
                    console.log(
                        "✅ TEX FOR EVER pages cached"
                    );
                    return self.skipWaiting();
                }
            )
            .catch(
                error => {
                    console.error(
                        "❌ Service Worker install error:",
                        error
                    );
                }
            )
        );
    }
);


// ============================================================
// ACTIVATE
// ============================================================

self.addEventListener(
    "activate",
    event => {

        console.log(
            "⚡ TEX FOR EVER SW activated:",
            CACHE_NAME
        );

        event.waitUntil(
            caches.keys()
            .then(
                cacheNames => {
                    return Promise.all(
                        cacheNames.map(
                            cacheName => {
                                if (
                                    cacheName.startsWith(
                                        "texforever-"
                                    ) &&
                                    cacheName !==
                                        CACHE_NAME &&
                                    cacheName !==
                                        APP_SHELL_CACHE
                                ) {
                                    console.log(
                                        "🗑️ Removing old cache:",
                                        cacheName
                                    );
                                    return caches.delete(
                                        cacheName
                                    );
                                }
                                return Promise.resolve();
                            }
                        )
                    );
                }
            )
            .then(
                () => {
                    return self.clients.claim();
                }
            )
        );
    }
);


// ============================================================
// SAME ORIGIN CHECK
// ============================================================

function isSameOrigin(request) {
    try {
        return (
            new URL(
                request.url
            ).origin ===
            self.location.origin
        );
    } catch (error) {
        return false;
    }
}


// ============================================================
// CLOUD / API CHECK (UPDATED FOR SUPABASE)
// ============================================================

function isCloudRequest(request) {
    const url =
        request.url.toLowerCase();

    return (
        url.includes("/api/") ||
        // Supabase API endpoints
        url.includes("supabase.co") ||
        url.includes("supabase.in")
    );
}


// ============================================================
// NAVIGATION
// ============================================================

async function handleNavigation(
    request
) {
    try {
        const networkResponse =
            await fetch(
                request
            );

        if (
            networkResponse &&
            networkResponse.ok
        ) {
            const cache =
                await caches.open(
                    CACHE_NAME
                );

            await cache.put(
                request,
                networkResponse.clone()
            );

            return networkResponse;
        }
    } catch (error) {
        console.log(
            "📴 Network unavailable:",
            request.url
        );
    }

    const cached =
        await caches.match(
            request
        );

    if (cached) {
        return cached;
    }

    const shellCached =
        await caches.match(
            request,
            {
                cacheName:
                    APP_SHELL_CACHE
            }
        );

    if (shellCached) {
        return shellCached;
    }

    // 🔴 Fixed the Syntax Error here (Added closing brace '}' for the function)
    return new Response(
        "TEX FOR EVER: இந்தப் பக்கம் இன்னும் ஆஃப்லைனில் பதிவிறக்கம் செய்யப்படவில்லை. தயவுசெய்து இன்டர்நெட்டை ஆன் செய்து இந்தப் பக்கத்தை ஒருமுறை பார்வையிடவும்.",
        {
            status: 503,
            headers: {
                "Content-Type": "text/plain; charset=utf-8"
            }
        }
    );
} // <-- This brace was missing in your code!


// ============================================================
// STATIC FILE REQUEST
// ============================================================

async function handleStaticRequest(
    request
) {
    try {
        const networkResponse =
            await fetch(
                request
            );

        if (
            networkResponse &&
            networkResponse.status ===
                200 &&
            networkResponse.type ===
                "basic"
        ) {
            const cache =
                await caches.open(
                    CACHE_NAME
                );

            await cache.put(
                request,
                networkResponse.clone()
            );
        }

        return networkResponse;
    } catch (error) {
        console.log(
            "📴 Offline resource:",
            request.url
        );

        const cached =
            await caches.match(
                request
            );

        if (cached) {
            return cached;
        }

        return new Response(
            "TEX FOR EVER offline.\n\n" +
            "This resource is not cached.",
            {
                status: 503,
                headers: {
                    "Content-Type":
                        "text/plain; charset=utf-8"
                    }
            }
        );
    }
}


// ============================================================
// FETCH
// ============================================================

self.addEventListener(
    "fetch",
    event => {
        const request =
            event.request;

        if (
            request.method !== "GET"
        ) {
            return;
        }

        if (
            !request.url.startsWith(
                "http"
            )
        ) {
            return;
        }

        if (
            isCloudRequest(
                request
            )
        ) {
            return;
        }

        if (
            !isSameOrigin(
                request
            )
        ) {
            return;
        }

        if (
            request.mode ===
                "navigate" ||
            request.destination ===
                "document"
        ) {
            event.respondWith(
                handleNavigation(
                    request
                )
            );
            return;
        }

        event.respondWith(
            handleStaticRequest(
                request
            )
        );
    }
);


// ============================================================
// MESSAGE HANDLER
// ============================================================

self.addEventListener(
    "message",
    event => {
        if (
            !event.data
        ) {
            return;
        }

        if (
            event.data.type ===
            "SKIP_WAITING"
        ) {
            console.log(
                "🔄 TEXFOREVER: Force update"
            );
            self.skipWaiting();
        }

        if (
            event.data.type ===
            "CLEAR_TEXFOREVER_CACHE"
        ) {
            event.waitUntil(
                caches.keys()
                .then(
                    cacheNames => {
                        return Promise.all(
                            cacheNames
                                .filter(
                                    name =>
                                        name.startsWith(
                                            "texforever-"
                                        )
                                )
                                .map(
                                    name =>
                                        caches.delete(
                                            name
                                        )
                                )
                        );
                    }
                )
                .then(
                    () => {
                        console.log(
                            "🧹 TEX FOR EVER caches cleared"
                        );
                    }
                )
            );
        }
    }
);


// ============================================================
// ERROR
// ============================================================

self.addEventListener(
    "error",
    event => {
        console.error(
            "❌ TEX FOR EVER SW Error:",
            event.error
        );
    }
);


// ============================================================
// UNHANDLED PROMISE
// ============================================================

self.addEventListener(
    "unhandledrejection",
    event => {
        console.error(
            "❌ TEX FOR EVER SW Promise Error:",
            event.reason
        );
    }
);


// ============================================================
// READY
// ============================================================

console.log(
    "🚀 TEX FOR EVER Service Worker Ready:",
    CACHE_NAME
);
