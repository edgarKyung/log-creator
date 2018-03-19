/**
 * Created by nhyun.kyung on 2017-01-12.
 */
var fs = require("fs");
var stackTrace = require("stack-trace");
var oc = require("object-controller");

module.exports = (function() {
    var defaultConfigure = {
        "svcName": "defaultService",
        "traceDepth": 1,
        "level": "info"
    };

    var __addZeroPad = function(number, digit) {
        for (var i = number.toString().length; i < digit; i++) {
            number = "0" + number;
        }
        return number;
    };

    var __getCurrentTime = function() {
        var date = new Date();
        var year = date.getFullYear();
        var month = __addZeroPad(date.getMonth() + 1, 2);
        var day = __addZeroPad(date.getDate(), 2);
        var hour = __addZeroPad(date.getHours(), 2);
        var minute = __addZeroPad(date.getMinutes(), 2);
        var second = __addZeroPad(date.getSeconds(), 2);
        var millisecond = __addZeroPad(date.getMilliseconds(), 3);
        return year + "-" + month + "-" + day + "T" + hour + ":" + minute + ":" + second + "." + millisecond;
    };

    var __getFunctionName = function(trace, traceDepth) {
        var funcName = trace[traceDepth].getMethodName() || trace[traceDepth].getFunctionName();
        if (funcName) {
            funcName = funcName.split(".");
            funcName = funcName[funcName.length - 1];
        } else {
            funcName = "__anonymous_function__"
        }
        return funcName;
    };

    var __getParamList = function(trace, traceDepth) {
        var func = trace[traceDepth].getFunction();
        var argv = arguments;
        for (var i = 0; i < traceDepth + 1; i++) {
            argv = argv.callee.caller.arguments;
        }
        argv = argv || {};

        var paramList = {};
        var parameter = func.toString().replace(/((\/\/.*$)|(\/\*[\s\S]*?\*\/)|(\s))/mg, '').match(/^function\s*[^\(]*\(\s*([^\)]*)\)/m)[1].split(/,/);
        var parameterLength = Object.keys(parameter).length;
        var argvLength = Object.keys(argv).length;
        var anonymousCount = 1;
        for (var i = 0; i < parameterLength; i++) {
            if (parameter[i] === "") {
                parameter[i] = "__anonymous_param_" + (anonymousCount++) + '__';
            }
            paramList[parameter[i]] = (argv[i] === undefined) ? "undefined" : argv[i];
        }
        for (i = parameterLength; i < argvLength; i++) {
            paramList['__anonymous_param_' + (anonymousCount++) + '__'] = argv[i];
        }
        return paramList;
    };

    /**
     * Initialize log creator configure
     *
     * @function init
     * @memberof log-creator
     * @param configure.svcName {string}
     * @param configure.traceDepth {number}
     * @param configure.level {string}
     * @returns {undefined}
     * @private
     */
    var init = function(configure) {
        configure = (oc.getType(configure) === "object") ? configure : {};
        defaultConfigure.svcName = (oc.getType(configure.svcName) === "string") ? configure.svcName : defaultConfigure.svcName;
        defaultConfigure.traceDepth = (oc.getType(configure.traceDepth) === "number") ? configure.traceDepth + 1 : defaultConfigure.traceDepth;
        defaultConfigure.level = (oc.getType(configure.level) === "string") ? configure.level : defaultConfigure.level;
    };

    /**
     * Create log object with one time parameters
     *
     * @function getLogObject
     * @memberof log-creator
     * @param option.traceDepth {number}
     * @param option.svcName {string}
     * @param option.level {string}
     * @param option.message {string}
     * @returns {object}
     * @private
     */
    var getLogObject = function(option) {
        option = (oc.getType(option) === "object") ? option : {};
        var trace = stackTrace.get();
        var traceDepth = (oc.getType(option.traceDepth) === "number") ? option.traceDepth + defaultConfigure.traceDepth : defaultConfigure.traceDepth;
        var logData = {};
        logData.date = __getCurrentTime();
        logData.svcName = (oc.getType(option.svcName) === "string") ? option.svcName : defaultConfigure.svcName;
        logData.level = (oc.getType(option.level) === "string") ? option.level : defaultConfigure.level;
        logData.file = trace[traceDepth].getFileName();
        logData.function = __getFunctionName(trace, traceDepth);
        logData.argv = __getParamList(trace, traceDepth);
        logData.message = (oc.getType(option.message) === "string") ? option.message : "";
        return logData;
    };


    return {
        "init": init,
        "getLogObject": getLogObject
    };

})();