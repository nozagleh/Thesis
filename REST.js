import mysql from 'mysql';

function REST_ROUTER(router,connection) {
    var self = this;
    self.handleRoutes(router,connection);
}

REST_ROUTER.prototype.handleRoutes= function(router,connection) {
    router.get("/",function(req,res){
        res.json({
          "Message" : "This is the root of the REST API",
          "REST PATHS" : {
            "/users" : "Get all users",
            "/users/id" : "Get a certain user from user id",
            "/users/order/id" : "Get a certain user from an order id",
            "/orders" : "Get all orders",
            "/orders/id" : "Get a certain order from the id",
            "/orders/user/id" : "Get a certain order from a user id",
            "/products" : "Get all products",
            "/products/id" : "Get a product from its id",
            "products/order/id" : "Get products based on the order id"
          }
        });
    });

    router.get("/users",function(req,res){
        var query = "SELECT id, alias, firstName, lastName, email FROM ??";
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
    	var query = "SELECT id, alias, firstName, lastName, email FROM ?? WHERE ??=?";
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

    router.get("/users/order/:id",function(req,res){
    	var query = "SELECT `people`.`id`, `people`.`alias`, `people`.`firstName`, `people`.`lastName`, `people`.`email` FROM ?? INNER JOIN `people` ON `people`.`id` = `orders`.`fk_customer` WHERE `orders`.`id` = ? AND `people`.`id` = `orders`.`fk_customer` LIMIT 1";
    	var table = ["orders", req.params.id];
    	query = mysql.format(query,table);
    	connection.query(query, function(err,rows){
    		if(err) {
                res.json({"Error" : true, "Message" : "Error executing MySQL query"});
            } else {
                res.json({"User" : rows});
            }
    	});
    });

    router.get("/orders",function(req,res){
      var query = "SELECT id, order_number, fk_customer, order_status FROM ??";
      var table = ["orders"];
      query = mysql.format(query,table);
      connection.query(query, function(err,rows){
        if(err) {
          res.json({"Error" : true, "Message" : "Error executing MySQL query"});
        } else {
          res.json({"Order" : rows});
        }
      });
    });

    router.get("/orders/:id",function(req,res){
    	var query = "SELECT id, order_number, fk_customer, order_status FROM ?? WHERE ??=?";
    	var table = ["orders","id", req.params.id];
    	query = mysql.format(query,table);
    	connection.query(query, function(err,rows){
    		if(err) {
                res.json({"Error" : true, "Message" : "Error executing MySQL query"});
            } else {
                res.json({"Orders" : rows});
            }
    	});
    });

    router.get("/orders/user/:id",function(req,res){
    	var query = "SELECT id, order_number, fk_customer, order_status FROM ?? WHERE ??=?";
    	var table = ["orders","fk_customer", req.params.id];
    	query = mysql.format(query,table);
    	connection.query(query, function(err,rows){
    		if(err) {
                res.json({"Error" : true, "Message" : "Error executing MySQL query"});
            } else {
                res.json({"Order" : rows});
            }
    	});
    });

    router.get("/products",function(req,res){
    	var query = "SELECT id, product_name, product_price, stock_available, product_description FROM ??";
    	var table = ["products"];
    	query = mysql.format(query,table);
    	connection.query(query, function(err,rows){
    		if(err) {
                res.json({"Error" : true, "Message" : "Error executing MySQL query"});
            } else {
                res.json({"Products" : rows});
            }
    	});
    });

    router.get("/products/:id",function(req,res){
    	var query = "SELECT id, product_name, product_price, stock_available, product_description FROM ?? WHERE ??=?";
    	var table = ["products","id", req.params.id];
    	query = mysql.format(query,table);
    	connection.query(query, function(err,rows){
    		if(err) {
                res.json({"Error" : true, "Message" : "Error executing MySQL query"});
            } else {
                res.json({"Product" : rows});
            }
    	});
    });

    router.get("/products/order/:id",function(req,res){
    	var query = "SELECT `products`.`id`, `products`.`product_name`, `products`.`product_price`, `products`.`stock_available`, `products`.`product_description` FROM ?? INNER JOIN `products` ON `products`.`id` =  `order_has_products`.`fk_product` WHERE `order_has_products`.`fk_order` = ?";
    	var table = ["order_has_products", req.params.id];
    	query = mysql.format(query,table);
    	connection.query(query, function(err,rows){
    		if(err) {
                res.json({"Error" : true, "Message" : "Error executing MySQL query, " + err});
            } else {
                res.json({"Products" : rows});
            }
    	});
    });
}

module.exports = REST_ROUTER;
