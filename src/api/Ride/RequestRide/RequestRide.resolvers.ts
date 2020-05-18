import { Resolvers } from '../../../types/resolvers';
import privateResolver from '../../utils/privateResolver';
import {
  RequestRideMutationArgs,
  RequestRideResponse,
} from '../../../types/graph';
import User from '../../../entities/User';
import Ride from '../../../entities/Ride';

const resolvers: Resolvers = {
  Mutation: {
    RequestRide: privateResolver(
      async (
        _,
        args: RequestRideMutationArgs,
        { req, pubSub }
      ): Promise<RequestRideResponse> => {
        const user: User = req.user;
        console.log('리퀘스트라이드 : ', args);
        console.log(user.isRiding);
        if (!user.isRiding) {
          try {
            const ride: Ride | any = await Ride.create({
              ...args,
              passenger: user,
            }).save();
            pubSub.publish('rideRequest', { NearbyRideSubscription: ride });
            user.save();
            return {
              ok: true,
              error: null,
              ride,
            };
          } catch (error) {
            return {
              ok: false,
              error: error.message,
              ride: null,
            };
          }
        } else {
          return {
            ok: false,
            error: "You can't request two rides",
            ride: null,
          };
        }
      }
    ),
  },
};

export default resolvers;
