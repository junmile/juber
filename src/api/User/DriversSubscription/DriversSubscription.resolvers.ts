import { withFilter } from 'graphql-yoga';
import User from '../../../entities/User';

const resolvers = {
  Subscription: {
    DriversSubscription: {
      subscribe: withFilter(
        (_, __, { pubSub }) => pubSub.asyncIterator('driverUpdate'),
        (payload, _, { context }) => {
          const user: User = context.currentUser;
          const {
            DriversSubscription: { id }
          } = payload;

          console.log('■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■');

          console.log(id);

          console.log('■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■');

          console.log(user);
          return true;
        }
      )
    }
  }
};

export default resolvers;
