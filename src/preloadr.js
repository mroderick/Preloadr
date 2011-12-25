/*! 
    Preloadr Library: https://github.com/mroderick/Preloadr/
    Licensed under the MIT License
    Copyright (c) 2010 Morgan Roderick http://roderick.dk
*/
/*
Permission is hereby granted, free of charge, to any person obtaining
a copy of this software and associated documentation files (the
"Software"), to deal in the Software without restriction, including
without limitation the rights to use, copy, modify, merge, publish,
distribute, sublicense, and/or sell copies of the Software, and to
permit persons to whom the Software is furnished to do so, subject to
the following conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE
LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION
OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION
WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
*/
/*jslint evil:false, sloppy:false, undef:true, white:true, browser:true */
/**
 *  Preloadr is a small module for **sequential** preloading of resources into the browser cache.
 * 
 *  Preloadr is SLOW(ish), as it will not load more than one resource at a time. For most preloading use cases, you 
 *  probably want something that downloads resources in parallel, maximizing the use of connections in browsers.
 *
 *  Preloadr is built for the rare situations, when you need to preload resources and DO NOT WANT TO BLOCK THE BROWSER
 *  from downloading other resources like scripts, maptiles, css files, images referenced by <img> elements, etc.
 *  
 *  Preloadr will keep track of all fetched resources, and will not fetch resources more than once if you accidentally 
 *  give it the same url twice.
 *  
 *  ## Example
 *      
 *      // create an array of resources to preload into the browsers cache
 *      var urls = [
 *          '1.jpg',
 *          '2.png',
 *          '3.css',
 *          '4.js'
 *      ];
 * 
 *      // Tell Preloadr to start fetching the urls
 *      Preloadr( urls );
 * 
 *  ## Notice
 * 
 *  Preloading resources is ONLY ever effective, if you are 
 *  [setting good caching headers](http://developer.yahoo.com/performance/rules.html#expires) on your resources.
 * 
 *  If you're not setting expires headers, you'll just be consuming even more bandwidth, and not improving user
 *  experience at all.
 **/
var Preloadr = (function(){
    "use strict";
    
    var processed = {}, // keeps track of all the urls we've already processed
        images = [];    // keeps references to the Image objects, needed to make sure that Firefox respects the cache

    function load( urls ){
        var url, image;
        if ( Object.prototype.toString.call( urls ) === '[object Array]' && urls.length > 0 ){
            // get the first url of the array
            url = urls.shift();

            // if it has already been loaded, just call load with the remaining urls
            if ( processed[url] ){
                load( urls );
            // otherwise, let's preload it
            } else {
                // the function to call when an image has finished loading or has failed to load
                var next = function(){
                    load( urls );
                };
                
                image = new Image();
                
                // set the callback for when image requests complete
                image.onload = next;
                image.onerror = next;

                // keep the reference to the image, or Firefox won't cache more than one properly
                images.push( image );
                
                // cache the url, so we won't process it more than once
                processed[url] = true;
                
                // set the src attribute on the image, which will start loading it
                image.src = url;
            }
        }
    }
    return load;
}());