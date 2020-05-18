import { Resolvers } from '../../../types/resolvers';
import privateResolver from '../../utils/privateResolver';
import User from '../../../entities/User';
import { Between } from 'typeorm';
import { GetNearbyDriversResponse } from '../../../types/graph';

const resolvers: Resolvers = {
  Query: {
    GetNearbyDrivers: privateResolver(
      async (_, __, { req }): Promise<GetNearbyDriversResponse> => {
        const { user } = req;
        const { lastLat, lastLng } = user;

        try {
          const drivers: User[] | any = await User.find({
            isDriving: true,
            lastLat: Between(lastLat - 0.05, lastLat + 0.05),
            lastLng: Between(lastLng - 0.05, lastLng + 0.05),
          });
          return {
            ok: true,
            error: null,
            drivers,
          };
        } catch (error) {
          return {
            ok: false,
            error: error.message,
            drivers: null,
          };
        }
      }
    ),
  },
};

export default resolvers;
