"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var path_1 = __importDefault(require("path"));
var express_1 = __importDefault(require("express"));
var fs_1 = __importDefault(require("fs"));
var app = (0, express_1.default)();
var port = process.env.PORT || 8080;
var envPath = 'static/js/env.js';
var envFile = "window.KANDIDAT_LAST_NED_CV_URL=\"".concat(process.env.LAST_NED_CV_URL, "\";\n") +
    "window.KANDIDAT_ARBEIDSRETTET_OPPFOLGING_URL=\"".concat(process.env.ARBEIDSRETTET_OPPFOLGING_URL, "\";\n");
var basePath = '/rekrutteringsbistand-kandidat';
var buildPath = path_1.default.join(__dirname, '../build');
var startServer = function (manifest) {
    app.get("".concat(basePath, "/").concat(envPath), function (_, res) {
        res.type('application/javascript').send(envFile);
    });
    app.use("".concat(basePath, "/static"), express_1.default.static(buildPath + '/static'));
    app.get("".concat(basePath, "/asset-manifest.json"), function (_, res) {
        res.type('json').send(manifest);
    });
    app.get(["".concat(basePath, "/internal/isAlive"), "".concat(basePath, "/internal/isReady")], function (_, res) {
        return res.sendStatus(200);
    });
    app.listen(port, function () {
        console.log('Server kjører på port', port);
    });
};
var opprettManifestMedEnvFil = function () {
    var asset = JSON.parse(fs_1.default.readFileSync("".concat(buildPath, "/asset-manifest.json"), 'utf8'));
    if (asset.files) {
        var name_1 = envPath.split('/').pop();
        asset.files[name_1] = "".concat(basePath, "/").concat(envPath);
    }
    return JSON.stringify(asset, null, 4);
};
var initializeServer = function () {
    var manifest = opprettManifestMedEnvFil();
    startServer(manifest);
};
initializeServer();
