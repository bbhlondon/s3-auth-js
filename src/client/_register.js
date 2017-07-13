export function supportsServiceWorker() {
    return ('serviceWorker' in navigator);
}

export function hasServiceWorker(swPath) {
    return navigator.serviceWorker.controller.scriptURL.indexOf(swPath) >= 0;
}
