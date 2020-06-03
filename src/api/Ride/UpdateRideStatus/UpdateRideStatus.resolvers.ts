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
        if (user.isDriving) {
          try {
            let ride: Ride | undefined;
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
                }).save();
                ride.chat = chat;
                ride.save();
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
              console.log('패신져 : ', passenger);
              console.log('패신져 : ', passenger.isRiding);
              console.log('패신져 : ', passenger);
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
          try {
            console.log('되긴돼??');
            let ride: Ride | undefined;
            ride = await Ride.findOne({
              passengerId: req.user,
            });
            console.log('라이더1 : ', args.status);
            if (ride) {
              pubSub.publish('rideUpdate', { RideStatusSubscription: ride });
              console.log('라이더2 : ', args.status);
              if (args.status === 'FINISHED') {
                user.isRiding = false;
                user.save();
              }
              return {
                ok: true,
                error: null,
                rideId: ride.id,
              };
            } else {
              return {
                ok: false,
                error: '고객의정보를 찾을수 없습니다.',
                rideId: null,
              };
            }
          } catch (error) {
            return {
              ok: false,
              error: error.message,
              rideId: null,
            };
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
