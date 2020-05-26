import { Resolvers } from '../../../types/resolvers';
import privateResolver from '../../utils/privateResolver';
import { GetRidebyIdResponse } from '../../../types/graph';
import Ride from '../../../entities/Ride';
import User from '../../../entities/User';

const resolvers: Resolvers = {
  Query: {
    GetRidebyId: privateResolver(
      async (_, __, { req }): Promise<GetRidebyIdResponse> => {
        const user = await User.findOne({ id: req.user.id });
        if (user && !user.isDriving) {
          try {
            const ride = await Ride.findOne({ passengerId: req.user.id });
            if (ride) {
              if (ride.status === 'REQUESTING') {
                return { ok: true, error: null };
              } else {
                return { ok: false, error: '요청중인 상태가 아닙니다.' };
              }
            } else {
              return {
                ok: false,
                error: '요청이안된 상태입니다.',
              };
            }
          } catch (error) {
            return {
              ok: false,
              error: '요청된 사항이 없습니다.',
            };
          }
        } else {
          return {
            ok: false,
            error: '운전자입니다.',
          };
        }
      }
    ),
  },
};

export default resolvers;
