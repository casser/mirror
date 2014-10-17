with(require('ozero')(module)){
    require('ozero-http');
    require('./src/socket');

    declare({
        config            : {
            settings      : {
                resources : {
                    local : 'public'
                }
            },
            handlers      : [
                HttpResourcesHandler
            ]
        }
    });

    HttpServer.new(config).start(8000);
    HttpSocket.new(config).start(8081);



}




