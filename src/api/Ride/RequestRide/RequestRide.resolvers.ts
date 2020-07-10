import { Resolvers } from '../../../types/resolvers';
import privateResolver from '../../utils/privateResolver';
import {
  RequestRideMutationArgs,
  RequestRideResponse,
} from '../../../types/graph';
import User from '../../../entities/User';
import Ride from '../../../entities/Ride';
import { Equal } from 'typeorm';

const resolvers: Resolvers = {
  Mutation: {
    RequestRide: privateResolver(
      async (
        _,
        args: RequestRideMutationArgs,
        { req, pubSub }
      ): Promise<RequestRideResponse> => {
        const user: User = req.user;
        if (!user.isRiding) {
          try {
            const ride: Ride | any = await Ride.create({
              ...args,
              passenger: user,
            }).save();
            pubSub.publish('rideRequest', { NearbyRideSubscription: ride });
            user.isRiding = true;
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
          const ride: Ride | any = await Ride.findOne(
            {
              passenger: req.user,
            },
            { where: { status: Equal('CANCELED') } }
          );

          console.log(ride);
          return {
            ok: false,
            error: '두개 이상의 요청은 하실 수 없습니다.',
            ride: ride,
          };
        }
      }
    ),
  },
};

export default resolvers;
