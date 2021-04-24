import { Resolvers } from '../../../types/resolvers';
import privateResolver from '../../utils/privateResolver';
import User from '../../../entities/User';
import {
  UpdateRideStatusMutationArgs,
  UpdateRideStatusResponse,
} from '../../../types/graph';
import Ride from '../../../entities/Ride';
import Chat from '../../../entities/Chat';

const resolvers: Resolvers = {
  Mutation: {
    UpdateRideStatus: privateResolver(
      async (
        _,
        args: UpdateRideStatusMutationArgs,
        { req, pubSub }
      ): Promise<UpdateRideStatusResponse> => {
        const user: User = req.user;
        let ride: Ride | undefined;
        if (user.isDriving) {
          try {
            if (args.status === 'ACCEPTED') {
              ride = await Ride.findOne(
                {
                  id: args.rideId,
                  status: 'REQUESTING',
                },
                { relations: ['passenger', 'driver'] }
              );

              if (ride) {
                ride.driver = user;
                user.isTaken = true;
                user.save();
                const chat = await Chat.create({
                  driver: user,
                  passenger: ride.passenger,
                  rideId: ride.id,
                }).save();
                console.log('쳇아이디 : ', chat.id);

                ride.chat = chat;
                ride.chatId = chat.id;
                ride.save();
              } else {
                return {
                  ok: false,
                  error: '사용자의 요청에 의해 취소 되었습니다.',
                  rideId: null,
                };
              }
            } else {
              ride = await Ride.findOne(
                {
                  id: args.rideId,
                  driver: user,
                },
                { relations: ['passenger', 'driver'] }
              );
            }
            if (ride && args.status === 'FINISHED') {
              user.isTaken = false;
              user.save();

              const passenger: User | any = await User.findOne({
                id: ride.passenger.id,
              });
              passenger!.isRiding = false;
              passenger.save();
            }
            if (ride) {
              ride.status = args.status;
              ride.save();
              pubSub.publish('rideUpdate', { RideStatusSubscription: ride });
              return {
                ok: true,
                error: null,
                rideId: ride.id,
              };
            } else {
              return {
                ok: false,
                error: 'Cant update ride',
                rideId: null,
              };
            }
          } catch (error) {
            return { ok: false, error: error.message, rideId: null };
          }
        } else {
          if (args.status === 'CANCELED') {
            ride = await Ride.findOne(
              { id: args.rideId, status: 'REQUESTING' },
              { relations: ['passenger'] }
            );
            if (ride) {
              ride.status = 'CANCELED';
              console.log('유져정보 : ', user);
              ride.save();
              user.isRiding = false;
              user.save();

              return {
                ok: true,
                error: null,
                rideId: ride.id,
              };
            } else {
              return {
                ok: false,
                error: '해당 라이드 정보가 없습니다.',
                rideId: null,
              };
            }
          }
          return {
            ok: false,
            error: 'You are not driving',
            rideId: null,
          };
        }
      }
    ),
  },
};

export default resolvers;
