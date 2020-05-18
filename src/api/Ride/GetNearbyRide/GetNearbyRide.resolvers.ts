import { Resolvers } from '../../../types/resolvers';
import privateResolver from '../../utils/privateResolver';
import User from '../../../entities/User';
import { GetNearbyRideResponse } from '../../../types/graph';
import { Between } from 'typeorm';
import Ride from '../../../entities/Ride';

const resolvers: Resolvers = {
  Query: {
    GetNearbyRides: privateResolver(
      async (_, __, { req }): Promise<GetNearbyRideResponse> => {
        console.log('돼?');
        const user: User = req.user;
        if (user.isDriving) {
          const { lastLat, lastLng } = user;

          try {
            const ride: any = await Ride.findOne({
              status: 'REQUESTING',
              pickUpLat: Between(lastLat - 0.05, lastLng + 0.05),
              pickUpLng: Between(lastLng - 0.05, lastLng + 0.05),
            });
            if (ride) {
              return {
                ok: true,
                error: null,
                ride,
              };
            } else {
              return {
                ok: true,
                error: null,
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
        } else {
          return {
            ok: false,
            error: 'You are not a driver',
            ride: null,
          };
        }
      }
    ),
  },
};

export default resolvers;
