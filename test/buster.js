var config = module.exports;

config["Preloadr"] = {
	rootPath : "../",
    env: "browser",        // or "node"
    sources: [
        "src/preloadr.js"
    ],
    tests: [
        "test/test-preloadr.js"
    ]
}
