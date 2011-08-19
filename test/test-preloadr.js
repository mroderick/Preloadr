/*jslint evil:false, strict:false, undef:true, white:false, onevar:false, plusplus:false */
/*global sinon,TestCase,Preloadr,console,assertTrue:true*/

(function(sinon) {
	var global = (function(){return this;}()),
		skipMsg = "skipping this test because setters are not supported in this browser";
	
	var MockImage = function() {
	    this.constructed();
	};
	
	//method to mock with sinon since it doesn't yet support
	//constructors in the current version
	MockImage.prototype.constructed = function() {};
	//methods to mock with sinon since the original handlers are added
	//on the instance itself, and we have only access to the prototype.
	MockImage.prototype.onloaded = function() {};
	MockImage.prototype.onerrored = function() {};
    
    Object.defineProperty(MockImage.prototype,"src", {
        set: function(src) {
            this.imageSrc = src;
		
            var status = src.indexOf("fail") !== 0;
            if (status) {
                this.onloaded();
                this.onload.call(null);
            } else {
                this.onerrored();
                this.onerror.call(null);
            }
        },
        get: function() {
            return this.imageSrc;
        }
    });
	
	var settersOnNonNativeObjectsAreSupported = false;
    try {
        if (Object.defineProperty({},"x",{get: function(){return true;}}).x) {
            settersOnNonNativeObjectsAreSupported = true;
        }
    } catch (e) {}
		
	TestCase("test-preloadr",{
		setUp: function() {
			if(!settersOnNonNativeObjectsAreSupported) {return;}
			//replace global Image class with mock
			this.nativeImageClass = global.Image;
			global.Image = MockImage;
		},
		tearDown: function() {
			if(!settersOnNonNativeObjectsAreSupported) {return;}
			global.Image = this.nativeImageClass;
		},
		//test MockImage itself, since it has some complexity
		testMock: function() {
			if(!settersOnNonNativeObjectsAreSupported) {
				console.log(skipMsg);
				return;
			}
			
			var mock = new MockImage(),
				called = false,
				successCallback = function() {called = true;},
				failCallback = function() {};
			//test wether the onerror handler only gets called when the url starts with "fail"
			mock.onload = successCallback;
			mock.onerror = failCallback;
			mock.src = "successurl";
			assertTrue(called);
			called = false;
			
			mock.onload = failCallback;
			mock.onerror = successCallback;
			mock.src = "failurl";
			assertTrue(called);
		},
		testCache: function() {
			if(!settersOnNonNativeObjectsAreSupported) {
				console.log(skipMsg);
				return;
			}
			
			var mock = sinon.mock(MockImage.prototype),
			    imageUrl = "someimagefortestingthecache";
			
			mock.expects("constructed").once();
	        mock.expects("onloaded").once();
	        mock.expects("onerrored").never();
			
			//Fill the cache
			Preloadr([imageUrl]);			
			//Now hit the cache and check if we got called
			Preloadr([imageUrl]);
			
			mock.verify();
		},
		testSuccessAfterNonExistentImage: function() {
			if(!settersOnNonNativeObjectsAreSupported) {
				console.log(skipMsg);
				return;
			}
			
			var mock = sinon.mock(MockImage.prototype);
			mock.expects("onerrored").once();
	        mock.expects("onloaded").once();
	        
			Preloadr(["failurl","successurl"]);
			
			mock.verify();
		},
		testMultipleImages: function() {
			if(!settersOnNonNativeObjectsAreSupported) {
				console.log(skipMsg);
				return;
			}
			
			var mock = sinon.mock(MockImage.prototype);
			mock.expects("onerrored").never();
	        mock.expects("onloaded").thrice();
			
			Preloadr(["image1of3","image2of3","image3of3"]);
			
			mock.verify();
		}
	});
}(sinon));
