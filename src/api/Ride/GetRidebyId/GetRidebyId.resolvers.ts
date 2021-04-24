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
            const rideById: Ride | any = await Ride.findOne(
              { passengerId: req.user.id },
              { relations: ['passenger', 'driver'] }
            );
            if (rideById) {
              if (rideById.status === 'REQUESTING') {
                return { ok: true, error: null, ride: rideById };
              } else {
                return {
                  ok: false,
                  error: '요청중인 상태가 아닙니다.',
                  ride: rideById,
                };
              }
            } else {
              return {
                ok: false,
                error: '요청이 안된 상태입니다.',
                ride: null,
              };
            }
          } catch (error) {
            return {
              ok: false,
              error: '요청된 사항이 없습니다.',
              ride: null,
            };
          }
        } else {
          return {
            ok: false,
            error: '운전자입니다.',
            ride: null,
          };
        }
      }
    ),
  },
};

export default resolvers;
