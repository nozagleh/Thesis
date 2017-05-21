import Sequelize from 'sequelize';
import _ from 'lodash';
import Faker from 'faker';

// Init db connection.

/*
 * Constant with connection settings.
 * DB name. username, password
 * DB lang, host
*/

const Connection = new Sequelize(
  'thesis-db',
  'root',
  '',
  {
    dialect: 'mysql',
    host: 'localhost'
  }
);

// Add the table structures.

const Person = Connection.define('person', {
  alias: {
    type: Sequelize.STRING,
    allowNull: false
  },
  password: {
    type: Sequelize.STRING,
    allowNull: false
  },
  firstName: {
    type: Sequelize.STRING,
    allowNull: false
  },
  lastName: {
    type: Sequelize.STRING,
    allowNull: false
  },
  email: {
    type: Sequelize.STRING,
    allowNull: false,
    validate: {
      isEmail: true
    }
  }
});

const Order = Connection.define('order', {
  order_number: {
    type: Sequelize.INTEGER
  },
  fk_customer: {
    type: Sequelize.INTEGER,
    references: {
      model: Person,
      key: 'id'
    }
  },
  order_status: {
    type: Sequelize.INTEGER
  }
});

const Product = Connection.define('product', {
    product_name: {
      type: Sequelize.STRING,
      allowNull: false
    },
    product_price: {
      type: Sequelize.DOUBLE,
      allowNull: false
    },
    stock_available: {
      type: Sequelize.INTEGER,
      allowNull: false
    },
    product_description: {
      type: Sequelize.TEXT,
      allowNull: true
    }
});

const Order_has_Product = Connection.define('order_has_product', {
  fk_product: {
    type: Sequelize.INTEGER,
    references: {
      model: Product,
      key: 'id'
    }
  },
  fk_order: {
    type: Sequelize.INTEGER,
    references: {
      model: Order,
      key: 'id'
    }
  }
});

// Table relations.
//Person.hasMany(Order);
//Order.belongsTo(Person);


// Add a Faker seed number for a consistent dataset.
Faker.seed(42);

// Add some Faker test data to the database.
Connection.sync({force: false}).then(()=>{
  /*_.times(10000, ()=>{
    return Person.create({
      alias: Faker.internet.userName(),
      password: Faker.internet.password(),
      firstName: Faker.name.firstName(),
      lastName: Faker.name.lastName(),
      email: Faker.internet.email()
    });
  });

  _.times(8000, ()=>{
    var randnr = Math.floor(Math.random() * 10000) + 1;
    var rand = Math.floor(Math.random() * 10) + 1;
    return Order.create({
      order_number: Faker.random.number(),
      fk_customer: randnr,
      order_status: rand
    });
  });

  _.times(50000, ()=>{
    var randnr = Math.floor(Math.random() * 4000) + 1;
    return Product.create({
      product_name: Faker.random.words(),
      product_price: Faker.random.number(),
      stock_available: randnr,
      product_description: Faker.lorem.sentences()
    });
  });*/

  _.times(16000, ()=>{
    var rand1 = Math.floor(Math.random() * 50000) + 1;
    var rand2 = Math.floor(Math.random() * 8000) + 1;
    return Order_has_Product.create({
      fk_product: rand1,
      fk_order: rand2
    });
  });
});

export default Connection;
