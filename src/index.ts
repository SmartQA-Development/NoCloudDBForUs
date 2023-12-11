import { ApolloServer } from '@apollo/server';
import { startStandaloneServer } from '@apollo/server/standalone';
import { Sequelize, DataTypes } from 'sequelize';
//import { Employees, PayChecks } from './models';

const sequelize = new Sequelize('SMARTQA', 'erik', '57625762', {
    host: 'localhost',
    dialect: 'mariadb'
});

try {
    await sequelize.authenticate();
    console.log('Connection has been established successfully.')
} catch(error) {
    console.error('Unable to connect to the database: ', error);
}

const Employee = sequelize.define('Employee', {
    ID: {
        type: DataTypes.NUMBER,
        allowNull: false,
    },
    FirstName: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    LastName: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    No: {
        type: DataTypes.NUMBER,
        allowNull: false,
        
    }
}, {
    timestamps: false,
});

//console.log(Employee === sequelize.models.Employee);

const PayCheck = sequelize.define('PayCheck', {
    ID: {
        type: DataTypes.NUMBER,
        allowNull: false,
    },
    EmployeeNo: {
        type: DataTypes.NUMBER,
        allowNull: false,
    },
    Month: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    Year: {
        type: DataTypes.NUMBER,
        allowNull: false,
    },
    GrossAmount: {
        type: DataTypes.NUMBER,
        allowNull: false,
    },
    NettAmount: {
        type: DataTypes.NUMBER,
        allowNull: false,
    },
    PDF: {
        type: DataTypes.BLOB,
        allowNull: true,
    }
}, {
    timestamps: false,
});

// A schema is a collection of type definitions (hence "typeDefs")
// that together define the "shape" of queries that are executed against
// your data.
const typeDefs = `#graphql
  # Comments in GraphQL strings (such as this one) start with the hash (#) symbol.

  # This "Employee" type defines the queryable fields for every employee in our data source.
  type Employee {
    FirstName: String!
    LastName: String!
    No: Int!
    payChecks: [PayCheck]
  }
  type PayCheck {
    Month: Int!
    Year: Int!
    GrossAmount: Float!
    NettAmount: Float!
    PDF: String
  }

  # The "Query" type is special: it lists all of the available queries that
  # clients can execute, along with the return type for each. In this
  # case, the "employees" query returns an array of zero or more Employees (defined above).
  type Query {
    employees: [Employee]
    employee(employeeNo: Int!): Employee
    payChecks(employeeNo: Int!): [PayCheck]
  }
`;

const resolvers = {
    Query: {
        employees: () => Employee.findAll(),
        employee: async (_, { employeeNo } ) => {
            const employee = await Employee.findOne({
                where: {
                    No: employeeNo
                }
            })
            employee['payChecks'] = PayCheck.findAll({ where: {
                employeeNo: employee['No']
            }});
            return employee
        },
        payChecks: (_, { employeeNo }) => {
            return PayCheck.findOne({
                where: {
                    employeeNo: employeeNo
                }
            })
        }
    }
}


const server = new ApolloServer({
    typeDefs,
    resolvers,
  });

const { url } = await startStandaloneServer(server, {
    listen: { port: 4000 },
  });
