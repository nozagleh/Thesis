import {
  GraphQLObjectType,
  GraphQLInt,
  GraphQLString,
  GraphQLList,
  GraphQLSchema,
  GraphQLFloat
} from 'graphql';
import DB from './db';

const Person = new GraphQLObjectType({
  name: 'Person',
  description: 'This represents a person',
  fields: () => {
    return {
      id: {
        type: GraphQLInt,
        resolve(person) {
          return person.id;
        }
      },
      alias: {
        type: GraphQLString,
        resolve(person) {
          return person.alias;
        }
      },
      password: {
        type: GraphQLString,
        resolve(person) {
          return person.password;
        }
      },
      firstName: {
        type: GraphQLString,
        resolve(person) {
          return person.firstName;
        }
      },
      lastName: {
        type: GraphQLString,
        resolve(person) {
          return person.lastName;
        }
      },
      email: {
        type: GraphQLString,
        resolve(person) {
          return person.email;
        }
      }
    };
  }
});

const Product = new GraphQLObjectType({
  name: 'Product',
  description: 'This is a product',
  fields: () => {
    return {
      id: {
        type: GraphQLInt,
        resolve(product) {
          return product.id;
        }
      },
      product_name: {
        type: GraphQLString,
        resolve(product) {
          return product.product_name;
        }
      },
      product_price: {
        type: GraphQLInt,
        resolve(product) {
          return product.product_price;
        }
      },
      stock_available: {
        type: GraphQLInt,
        resolve(product) {
          return product.stock_available;
        }
      },
      product_description: {
        type: GraphQLString,
        resolve(product) {
          return product.product_description;
        }
      }
    };
  }
});

const Order = new GraphQLObjectType({
    name: 'Order',
    description: 'This is the order object',
    fields: () => {
      return {
        id: {
          type: GraphQLInt,
          resolve(order) {
            return order.id;
          }
        },
        order_number: {
          type: GraphQLInt,
          resolve(order) {
            return order.order_number;
          }
        },
        fk_customer : {
          type: new GraphQLList(Person),
          resolve(order) {
            return DB.models.person.findAll( {where: {id: order.fk_customer}}).then( e => {
              return e;
            });
          }
        },
        products : {
          type: new GraphQLList(Product),
          resolve(order) {
            return DB.models.order_has_product.findAll({
              where: {'fk_order': order.id},
              include: [{
                model: DB.models.product,
                attributes: ['id','product_name','product_price','product_description', 'stock_available']
              }]
            }).then( e => {
              var arr = [];
              e.forEach(function(item) {
                arr.push(item.product);
              });
              return arr;
            });
          }
        },
        order_status: {
          type: GraphQLInt,
          resolve(order) {
            return order.order_status;
          }
        }
      };
    }
});

const Query = new GraphQLObjectType({
  name: 'Query',
  description: 'This is the root query',
  fields: () => {
    return {
      Person: {
        type: new GraphQLList(Person),
        args: {
          id: {
            type: GraphQLInt
          },
          alias: {
            type: GraphQLString
          },
          password: {
            type: GraphQLString
          },
          firstName: {
            type: GraphQLString
          },
          lastName: {
            type: GraphQLString
          },
          email: {
            type: GraphQLString
          }
        },
        resolve(root, args) {
          return DB.models.person.findAll({where: args});
        }
      },
      Product: {
        type: new GraphQLList(Product),
        args: {
          id: {
            type: GraphQLInt
          },
          product_name: {
            type: GraphQLString
          },
          product_price: {
            type: GraphQLInt
          },
          stock_available: {
            type: GraphQLInt
          },
          product_description: {
            type: GraphQLString
          }
        },
        resolve(root, args) {
          return DB.models.product.findAll({where: args});
        }
      },
      Order: {
        type: new GraphQLList(Order),
        args: {
          id: {
            type: GraphQLInt
          },
          order_number: {
            type: GraphQLInt
          },
          fk_customer: {
            type: GraphQLInt,
            resolve(id) {
              return DB.models.person.findAll({where: id});
            }
          },
          order_status: {
            type: GraphQLInt
          }
        },
        resolve(root, args) {
          return DB.models.order.findAll({where: args});
        }
      }
    };
  }
});

const Schema = new GraphQLSchema({
  query: Query
});

export default Schema;
