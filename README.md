Preloadr is a small module for **sequential** preloading of resources into the browser cache.

Preloadr is SLOW(ish), as it will not load more than one resource at a time. For most preloading use cases, you probably want something that downloads resources in parallel, maximizing the use of connections in browsers.

Preloadr is built for the rare situations, when you need to preload resources and DO NOT WANT TO BLOCK THE BROWSER from downloading other resources like scripts, maptiles, css files, images referenced by <img> elements, etc.

Preloadr will keep track of all fetched resources, and will not fetch resources more than once if you accidentally give it the same url twice.

## Example
    
    // create an array of resources to preload into the browsers cache
    var urls = [
        '1.jpg',
        '2.png',
        '3.css',
        '4.js'
    ];

    // Tell Preloadr to start fetching the urls
    Preloadr( urls );

## Notice

Preloading resources is ONLY ever effective, if you are [setting good caching headers](http://developer.yahoo.com/performance/rules.html#expires) on your resources.

If you're not setting expires headers, you'll just be consuming even more bandwidth, and not improving user experience at all.

To verify that Preloadr is working as intended, open up Firebug / Web Inspector / whatnot, and check that resources are not loaded in parallel, but are loaded sequentially (*should look like a staircase*).

## Unit tests

Unit tests are created using [BusterJS](http://busterjs.org).