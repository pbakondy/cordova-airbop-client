# cordova-airbop-client

An AngularJS service for connecting to [AirBop](http://www.airbop.com/) GCM Push Messaging server.

## Install

After creating a new Ionic project run this command:

```
bower install cordova-airbop-client
```

In the main HTML page you have to place these references:

```html
<script src="lib/cordova-airbop-client/airbop-client.min.js"></script>
<script src="lib/tiny-sha256/sha256.min.js"></script>
```

Then, include <code>cordova-airbop-client</code> as a dependency in your angular module:

```js
angular.module('myApp', ['AirBopClient'])
  .controller('SampleCtrl', ['$airbopClient', function($airbopClient) {
    ...  
  }]);
```

## Usage

This plugin has only one method: <code>$airbopClient.register(options)</code>.

<code>options</code> parameter is an object. The structure:

* <code>airbopAppKey</code> &lt;String&gt; [mandantory] - AIRBOP_APP_KEY from AirBop registration
* <code>airbopAppSecret</code> &lt;String&gt; [mandantory] - APP_SECRET from AirBop registration
* <code>regid</code> &lt;String&gt; [mandantory] - this ID is coming from GCM server after registration
* <code>country</code> &lt;String&gt; [optional]
* <code>state</code> &lt;String&gt; [optional]
* <code>label</code> &lt;String&gt; [optional]
* <code>language</code> &lt;String&gt; [optional]
* <code>latitude</code> &lt;String&gt; [optional]
* <code>longitude</code> &lt;String&gt; [optional]


You can get country code by using [cordova-plugin-sim](https://github.com/pbakondy/cordova-plugin-sim) plugin.

You can get latitude and longitude by using [cordova-plugin-geolocation](https://github.com/apache/cordova-plugin-geolocation) plugin.

You can get get country and state from geolocation data using [reverse geocoding](https://developers.google.com/maps/documentation/geocoding/?csw=1#ReverseGeocoding).


## Demo Application

See https://github.com/pbakondy/gcm-demo-app


## License

cordova-airbop-client is licensed under the MIT Open Source license. For more information, see the LICENSE file in this repository.
