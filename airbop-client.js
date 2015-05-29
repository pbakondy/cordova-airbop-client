
// http://www.airbop.com/tutorials/adding-airbop-to-your-app#registering-with-airbop
// https://github.com/indigorose/airbop-client/blob/master/airbop-client-sample/src/com/airbop/client/AirBopServerUtilities.java


angular.module('AirBopClient', [])
  .factory('$airbopClient', ['$http', '$q', function($http, $q) {

    'use strict';

    var METHOD = 'POST';
    var SERVER_URL = 'http://www.airbop.com/api/v1/';
    var REGISTER_URL = SERVER_URL + 'register';
    var UNREGISTER_URL = SERVER_URL + 'unregister';
    var CONTENT_TYPE = 'application/json';
    var TIMEOUT = 60 * 1000; //ms

    // AirBop keys
    var AIRBOP_APP_KEY;
    var AIRBOP_APP_SECRET;

    // Post Param keys
    var COUNTRY = 'country';
    var LABEL = 'label';
    var LANGUAGE = 'lang';
    var LATITUDE = 'lat';
    var LONGITUDE = 'long';
    var REGISTRATION_ID = 'reg';
    var STATE = 'state';

    // Header keys
    var HEADER_APP = 'x-app-key';
    var HEADER_TIMESTAMP = 'x-timestamp';
    var HEADER_SIGNATURE = 'x-signature';
    var HEADER_CONTENT_TYPE = 'Content-Type';

    /**
     * Calculate the current timestamp since the Epoch, January 1, 1970 00:00 UTC.
     *
     * @return <Number> The current timestamp in seconds
     */
    function getCurrentTimestamp() {
      return Math.floor((new Date()).getTime() / 1000);
    }

    /**
     * Construct the URL for the signature header
     *
     * @param <String> method The method being use to contact the header. POST for now.
     * @param <String> url The URL we are going to contact.
     * @param <String> timestamp The timestamp of the message
     * @param <String> body The body that we will be sending
     * @return <String> The created URI.
     */
    function constructSignatureURI(method, url, timestamp, body) {
      return method + url + AIRBOP_APP_KEY + timestamp + body + AIRBOP_APP_SECRET;
    }

    /**
     * Computes the SHA-256 hash of a string
     *
     * @uses https://github.com/geraintluff/sha256
     * @param <String> input The string to hash
     * @return <String> The hashed string
     */
    function computeHash(input) {
      if (typeof sha256 !== 'function') {
        throw 'Missing `sha256()` function';
      }
      return sha256(input);
    }


    function post(params, url) {
      var q = $q.defer();

      var ts = getCurrentTimestamp();

      var signature = constructSignatureURI(METHOD, url, ts, JSON.stringify(params));
      var signatureHash = computeHash(signature);

      var headers = {};
      headers[HEADER_APP] = AIRBOP_APP_KEY;
      headers[HEADER_TIMESTAMP] = ts;
      headers[HEADER_SIGNATURE] = signatureHash;
      headers[HEADER_CONTENT_TYPE] = CONTENT_TYPE;

      var config = {
        data: params,
        headers: headers,
        method: METHOD,
        params: params,
        timeout: TIMEOUT,
        url: url
      };

      $http(config).then(
        function(response) {
          if (response.status === 200) {
            q.resolve('OK');
          } else {
            q.reject({ 'data': response.data, 'status': response.status, 'statusText': response.statusText });
          }
        },
        q.reject
      );

      return q.promise;
    }

    /**
     * Registers client to AirBop server
     *
     * @param <Object> options Options
     * @return <Promise>
     *
     * Options
     * - airbopAppKey <String> [mandantory]
     * - airbopAppSecret <String> [mandantory]
     * - regid <String> [mandantory]
     * - country <String> [optional]
     * - state <String> [optional]
     * - label <String> [optional]
     * - language <String> [optional]
     * - latitude <String> [optional]
     * - longitude <String> [optional]
     *
     */
    function register(options) {

      // checking mandantory parameters
      if (typeof options.airbopAppKey !== 'string') {
        throw 'Invalid `airbopAppKey` option';
      }
      if (typeof options.airbopAppSecret !== 'string') {
        throw 'Invalid `airbopAppSecret` option';
      }
      if (typeof options.regid !== 'string') {
        throw 'Invalid `regid` option';
      }

      AIRBOP_APP_KEY = options.airbopAppKey;
      AIRBOP_APP_SECRET = options.airbopAppSecret;

      var q = $q.defer();

      // only REGISTRATION_ID parameter is mandatory
      var params = {};
      params[REGISTRATION_ID] = options.regid;

      // apply optional parameters
      if (typeof options.country === 'string') {
        params[COUNTRY] = options.country;
      }
      if (typeof options.state === 'string') {
        params[STATE] = options.state;
      }
      if (typeof options.label === 'string') {
        params[LABEL] = options.label;
      }
      if (typeof options.language === 'string') {
        params[LANGUAGE] = options.language;
      }
      if (typeof options.latitude === 'string') {
        params[LATITUDE] = options.latitude;
      }
      if (typeof options.longitude === 'string') {
        params[LONGITUDE] = options.longitude;
      }

      post(params, REGISTER_URL).then(q.resolve, q.reject);

      return q.promise;
    }

    /**
     * Unregisters client to AirBop server
     *
     * @param <Object> options Options
     * @return <Promise>
     *
     * Options
     * - airbopAppKey <String> [mandantory]
     * - airbopAppSecret <String> [mandantory]
     * - regid <String> [mandantory]
     *
     */
    function unregister(options) {

      // checking mandantory parameters
      if (typeof options.airbopAppKey !== 'string') {
        throw 'Invalid `airbopAppKey` option';
      }
      if (typeof options.airbopAppSecret !== 'string') {
        throw 'Invalid `airbopAppSecret` option';
      }
      if (typeof options.regid !== 'string') {
        throw 'Invalid `regid` option';
      }

      AIRBOP_APP_KEY = options.airbopAppKey;
      AIRBOP_APP_SECRET = options.airbopAppSecret;

      var q = $q.defer();

      var params = {};
      params[REGISTRATION_ID] = options.regid;

      post(params, UNREGISTER_URL).then(q.resolve, q.reject);

      return q.promise;
    }

    return {
      register: register,
      unregister: unregister
    };

  }]);
