var config = module.exports;

config["Preloadr"] = {
    env: "browser",        // or "node"
    sources: [
        "../src/preloadr.js"
    ],
    tests: [
        "test-preloadr.js"
    ]
}
