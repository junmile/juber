import { Resolver } from 'dns';

export type Resolveer = (
  parent: any,
  args: any,
  context: any,
  info: any
) => any;

export interface Resolvers {
  [key: string]: {
    [key: string]: Resolver;
  };
}
