var MirrorConfig  = {
    NAME_PROMPT     : "Please enter your name",
    NAME_DEFAULT    : {
        CUSTOMER    : "Jon Smith",
        OFFICER     : "Jane Doe"
    },
    MODE_CUSTOMER   : 'customer',
    MODE_OFFICER    : 'officer',
    COMMANDS        : {}
};

String.prototype.toCamelCase = function(){
    return this.toLowerCase().replace(/(_[a-z])/g, function($1){return $1.toUpperCase().replace('_','');});
};
String.prototype.toUnderscore = function(){
    return this.replace(/([A-Z])/g, function($1){return "_"+$1.toLowerCase();});
};
String.prototype.trim = function(){
    return this.replace(/^\s+|\s+$/g, "");
};
String.prototype.capitalize = function(){
    return this.charAt(0).toUpperCase()+this.substring(1);
};