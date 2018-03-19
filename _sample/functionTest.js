/**
 * Created by nhyun.kyung on 2017-01-12.
 */
try {
    var logCreater = require("../index");

    var logger = (function() {
        logCreater.init({
            "svcName": "functionTest Service",
            "traceDepth": 1
        });

        var log = function(message, level) {
            var option = {};
            option.message = message;
            option.level = level;
            console.log(logCreater.getLogObject(option));
        };

        var error = function(message) {
            var option = {};
            option.message = message;
            option.level = "error";
            console.log(logCreater.getLogObject(option));  
        };

        var warning = function(message) {
            var option = {};
            option.message = message;
            option.level = "error";
            console.log(logCreater.getLogObject(option));  
        };

        return {
            "log": log,
            "error": error,
            "warning": warning
        };
    })();

    var innerFunction = function(a, b) {
        logger.log("Default Message")
    };

    var outerFunction = function(c) {
        logger.error("Error Message")
        innerFunction("a", "b", "c", "d", "e");
    };

    outerFunction();


} catch (ex) {
    console.error(ex.stack);
}

