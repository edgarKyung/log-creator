/**
 * Created by nhyun.kyung on 2017-01-12.
 */
try {
    var logger = (function() {
        var logCreator = require("../index");

        logCreator.init({
            "svcName": "functionTest Service",
            "traceDepth": 2
        });

        var __log = function(message, level, traceDepth) {
            var option = {};
            option.message = message;
            option.level = level;
            option.traceDepth = traceDepth;
            return logCreator.getLogObject(option);
        };

        var error = function(message) {
            var logObject = __log(message, "error");
            console.log(logObject);
        };

        var warning = function(message) {
            var logObject = __log(message, "warning");
            console.log(logObject);
        };

        var info = function(message) {
            var logObject = __log(message, "info");
            console.log(logObject);
        };

        var verbose = function(message) {
            var logObject = __log(message, "verbose");
            console.log(logObject);
        };

        var debug = function(message) {
            var logObject = __log(message, "debug");
            console.log(logObject);
        };

        var silly = function(message) {
            var logObject = __log(message, "silly");
            console.log(logObject);
        };

        return {
            "error": error,
            "warning": warning,
            "info": info,
            "verbose": verbose,
            "debug": debug,
            "silly": silly
        };
    })();

    var innerFunction = function(a, b) {
        logger.info("Inner Function");
    };

    var outerFunction = function(obj) {
        logger.error("Outer Function");
        setTimeout(innerFunction, 500, obj, "q");
        innerFunction(obj, "b", "anony1", "anony2", "anony3");
    };

    var myObj = { "name": "origin" };
    outerFunction(myObj);
    myObj.name = "edit";


} catch (ex) {
    console.error(ex.stack);
}