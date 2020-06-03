import { Resolvers } from '../../../types/resolvers';
import privateResolver from '../../utils/privateResolver';
import User from '../../../entities/User';
import { GetRideResponse, GetRideQueryArgs } from '../../../types/graph';
import Ride from '../../../entities/Ride';

const resolvers: Resolvers = {
  Query: {
    GetRide: privateResolver(
      async (_, args: GetRideQueryArgs, { req }): Promise<GetRideResponse> => {
        const user: User = req.user;
        try {
          const ride: any = await Ride.findOne(
            {
              id: args.rideId,
            },
            { relations: ['passenger', 'driver'] }
          );
          if (ride) {
            if (ride.passengerId === user.id || ride.driverId === user.id) {
              return {
                ok: true,
                error: null,
                ride,
              };
            } else {
              return {
                ok: false,
                error: 'not authorized',
                ride: null,
              };
            }
          } else {
            return {
              ok: false,
              error: 'ride not found',
              ride: null,
            };
          }
        } catch (error) {
          return {
            ok: false,
            error: error.message,
            ride: null,
          };
        }
      }
    ),
  },
};

export default resolvers;
