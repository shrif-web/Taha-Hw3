const grpc = require("@grpc/grpc-js");
var protoLoader = require("@grpc/proto-loader");
const PROTO_PATH = "src/services/apifile.proto";

const options = {
    keepCase: true,
    longs: String,
    enums: String,
    defaults: true,
    oneofs: true,
};

const cacheHost = process.env.CACHE_HOST

var packageDefinition = protoLoader.loadSync(PROTO_PATH, options);

const apiProto = grpc.loadPackageDefinition(packageDefinition);

module.exports = {
    // SetKey
    set(key, value) {
        const SetCacheService = apiProto.SetCacheService;
        const client = new SetCacheService(
            cacheHost,
            grpc.credentials.createInsecure()
        );
        client.SetKey({ id: key, contents: value }, (error, e2) => {
            console.log("Saved into cache");
        });
    },

    // GetKey
    get(key, onFetch) {
        const GetCacheService = apiProto.GetCacheService;
        const client = new GetCacheService(
            cacheHost,
            grpc.credentials.createInsecure()
        );
        client.GetKey({ id: key }, (error, cacheItem) => {
            if (cacheItem)
                onFetch(cacheItem.contents)
            else
                onFetch(null)
        });
    },

    // Clear cache
    clear() {
        const ClearCacheService = apiProto.ClearCacheService;
        const client = new ClearCacheService(
            cacheHost,
            grpc.credentials.createInsecure()
        );

        client.Clear(null, (error, _) => {
            console.log("Cleared cache");
        });
    },
}