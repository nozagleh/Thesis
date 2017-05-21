import mysql from 'mysql';

function REST_ROUTER(router,connection) {
    var self = this;
    self.handleRoutes(router,connection);
}

REST_ROUTER.prototype.handleRoutes= function(router,connection) {
    router.get("/",function(req,res){
        res.json({"Message" : "Hello World !"});
    });

    router.get("/users",function(req,res){
        var query = "SELECT id, firstName, lastName, email FROM ??";
        var table = ["people"];
        query = mysql.format(query,table);
        connection.query(query,function(err,rows){
            if(err) {
                res.json({"Error" : true, "Message" : "Error executing MySQL query"});
            } else {
                res.json({"people" : rows});
            }
        });
    });

    router.get("/users/:id",function(req,res){
    	var query = "SELECT id, firstName, lastName, email FROM ?? WHERE ??=?";
    	var table = ["people","id", req.params.id];
    	query = mysql.format(query,table);
    	connection.query(query, function(err,rows){
    		if(err) {
                res.json({"Error" : true, "Message" : "Error executing MySQL query"});
            } else {
                res.json({"User" : rows});
            }
    	});
    });
}

module.exports = REST_ROUTER;