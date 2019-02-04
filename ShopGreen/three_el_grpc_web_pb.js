/**
 * @fileoverview gRPC-Web generated client stub for 
 * @enhanceable
 * @public
 */

// GENERATED CODE -- DO NOT EDIT!



const grpc = {};
grpc.web = require('grpc-web');

const proto = require('./three_el_pb.js');

/**
 * @param {string} hostname
 * @param {?Object} credentials
 * @param {?Object} options
 * @constructor
 * @struct
 * @final
 */
proto.RatingProviderClient =
    function(hostname, credentials, options) {
  if (!options) options = {};
  options['format'] = 'text';

  /**
   * @private @const {!grpc.web.GrpcWebClientBase} The client
   */
  this.client_ = new grpc.web.GrpcWebClientBase(options);

  /**
   * @private @const {string} The hostname
   */
  this.hostname_ = hostname;

  /**
   * @private @const {?Object} The credentials to be used to connect
   *    to the server
   */
  this.credentials_ = credentials;

  /**
   * @private @const {?Object} Options for the client
   */
  this.options_ = options;
};


/**
 * @param {string} hostname
 * @param {?Object} credentials
 * @param {?Object} options
 * @constructor
 * @struct
 * @final
 */
proto.RatingProviderPromiseClient =
    function(hostname, credentials, options) {
  if (!options) options = {};
  options['format'] = 'text';

  /**
   * @private @const {!proto.RatingProviderClient} The delegate callback based client
   */
  this.delegateClient_ = new proto.RatingProviderClient(
      hostname, credentials, options);

};


/**
 * @const
 * @type {!grpc.web.AbstractClientBase.MethodInfo<
 *   !proto.ProductName,
 *   !proto.Classification>}
 */
const methodInfo_RatingProvider_GetProductClass = new grpc.web.AbstractClientBase.MethodInfo(
  proto.Classification,
  /** @param {!proto.ProductName} request */
  function(request) {
    return request.serializeBinary();
  },
  proto.Classification.deserializeBinary
);


/**
 * @param {!proto.ProductName} request The
 *     request proto
 * @param {!Object<string, string>} metadata User defined
 *     call metadata
 * @param {function(?grpc.web.Error, ?proto.Classification)}
 *     callback The callback function(error, response)
 * @return {!grpc.web.ClientReadableStream<!proto.Classification>|undefined}
 *     The XHR Node Readable Stream
 */
proto.RatingProviderClient.prototype.getProductClass =
    function(request, metadata, callback) {
  return this.client_.rpcCall(this.hostname_ +
      '/RatingProvider/GetProductClass',
      request,
      metadata,
      methodInfo_RatingProvider_GetProductClass,
      callback);
};


/**
 * @param {!proto.ProductName} request The
 *     request proto
 * @param {!Object<string, string>} metadata User defined
 *     call metadata
 * @return {!Promise<!proto.Classification>}
 *     The XHR Node Readable Stream
 */
proto.RatingProviderPromiseClient.prototype.getProductClass =
    function(request, metadata) {
  return new Promise((resolve, reject) => {
    this.delegateClient_.getProductClass(
      request, metadata, (error, response) => {
        error ? reject(error) : resolve(response);
      });
  });
};


module.exports = proto;

