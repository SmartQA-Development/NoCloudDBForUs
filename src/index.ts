import { ApolloServer } from '@apollo/server';
import { startStandaloneServer } from '@apollo/server/standalone';

// A schema is a collection of type definitions (hence "typeDefs")
// that together define the "shape" of queries that are executed against
// your data.
const typeDefs = `#graphql
  # Comments in GraphQL strings (such as this one) start with the hash (#) symbol.

  # This "Employee" type defines the queryable fields for every employee in our data source.
  type Employee {
    firstName: String!
    lastName: String!
    employeeNo: Int!
    payChecks: [PayCheck]
  }
  type PayCheck {
    month: Int!
    year: Int!
    grossAmount: Float!
    nettAmount: Float!
    pdf: String
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

const employees = [
    {
        employeeNo: 1,
        firstName: "Ico",
        lastName: "Bakker",
        payChecks: [
            {
                month: 2,
                year: 2023,
                grossAmount: 4556.55,
                nettAmount: 3241.51
            }
        ]
    }, 
    {
        employeeNo: 2,
        firstName: "Erik",
        lastName: "Knaap",
        payChecks: [
            {
                month: 2,
                year: 2023,
                grossAmount: 5645.14,
                nettAmount: 4106.66
            }
        ]
    },
    {
        employeeNo: 3,
        firstName: "Akash",
        lastName: "Foederer",
        payChecks: [
            {
                month: 2,
                year: 2023,
                grossAmount: 4104.55,
                nettAmount: 2911.75
            }
        ]
    }
]

const resolvers = {
    Query: {
        employees: () => employees,
        employee: (_, { employeeNo } ) => {
            const employee = employees.find(e => e.employeeNo == employeeNo)
            return employee
        },
        payChecks: (_, { employeeNo }) => {
            return employees.find(e => e.employeeNo == employeeNo).payChecks
        }
    }
}

// import { GraphQLScalarType, Kind } from 'graphql';

// const dateScalar = new GraphQLScalarType({
//   name: 'Date',
//   description: 'Date custom scalar type',
//   serialize(value) {
//     if (value instanceof Date) {
//       return value.getTime(); // Convert outgoing Date to integer for JSON
//     }
//     throw Error('GraphQL Date Scalar serializer expected a `Date` object');
//   },
//   parseValue(value) {
//     if (typeof value === 'number') {
//       return new Date(value); // Convert incoming integer to Date
//     }
//     throw new Error('GraphQL Date Scalar parser expected a `number`');
//   },
//   parseLiteral(ast) {
//     if (ast.kind === Kind.INT) {
//       // Convert hard-coded AST string to integer and then to Date
//       return new Date(parseInt(ast.value, 10));
//     }
//     // Invalid hard-coded value (not an integer)
//     return null;
//   },
// });

const server = new ApolloServer({
    typeDefs,
    resolvers,
  });

const { url } = await startStandaloneServer(server, {
    listen: { port: 4000 },
  });