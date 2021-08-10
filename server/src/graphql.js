import { GraphQLSchema, GraphQLObjectType } from 'graphql';
import { Router } from 'express';
import { graphqlHTTP } from 'express-graphql';
import getConfig from './config';

/* Queries and mutations */
import { ApplicationPropertyMutation, ApplicationPropertyQuery } from './core/graphql/application_property';
import { ContentTypeMutation, ContentTypeQuery } from './layout/graphql/content_type';
import { SlotMutation, SlotQuery } from './layout/graphql/slot';
import { ContentMutation, ContentQuery } from './layout/graphql/content';
import { TemplateMutation, TemplateQuery } from './layout/graphql/template';
import { ViewMutation, ViewQuery } from './layout/graphql/view';
import { RouteMutation, RouteQuery } from './layout/graphql/route';

const GuestQueryType = new GraphQLObjectType({
  name: 'Query',
  description: 'Guest query type',
  fields: {
    ...ViewQuery,
    ...RouteQuery,
  },
});

const AdminQueryType = new GraphQLObjectType({
  name: 'Query',
  description: 'Admin query type',
  fields: {
    ...ApplicationPropertyQuery,
    ...ContentTypeQuery,
    ...SlotQuery,
    ...ContentQuery,
    ...TemplateQuery,
    ...ViewQuery,
    ...RouteQuery,
  },
});

const AdminMutationType = new GraphQLObjectType({
  name: 'Mutation',
  description: 'Admin mutation type',
  fields: {
    ...ApplicationPropertyMutation,
    ...ContentTypeMutation,
    ...SlotMutation,
    ...ContentMutation,
    ...TemplateMutation,
    ...ViewMutation,
    ...RouteMutation,
  },
});

const router = new Router();
const { graphiql } = getConfig();

const querySchema = new GraphQLSchema({
  query: GuestQueryType,
});

const adminSchema = new GraphQLSchema({
  query: AdminQueryType,
  mutation: AdminMutationType,
});

router.use('/admin',
  graphqlHTTP({
    graphiql,
    schema: adminSchema,
  }));

router.use('/',
  graphqlHTTP({
    graphiql,
    schema: querySchema,
  }));

export default router;
