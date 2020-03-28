import { Resolvers } from '../../../types/resolvers';
import privateResolver from '../../utils/privateResolver';
import {
  SendChatMessageResponse,
  SendChatMessageMutationArgs
} from '../../../types/graph';
import User from '../../../entities/User';
import Message from '../../../entities/Message';
import Chat from '../../../entities/Chat';

const resolvers: Resolvers = {
  Mutation: {
    SendChatMessage: privateResolver(
      async (
        _,
        args: SendChatMessageMutationArgs,
        { req, pubSub }
      ): Promise<SendChatMessageResponse> => {
        const user: User = req.user;
        try {
          const { text, chatId } = args;
          const chat = await Chat.findOne({ id: chatId });
          if (chat) {
            if (chat.passengerId === user.id || chat.driverId === user.id) {
              console.log('유져: ', user);
              console.log('쳇 : ', chat);
              const message: any = await Message.create({
                text,
                chat,
                user
              }).save();
              console.log('■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■');
              pubSub.publish('newChatMessage', {
                MessageSubscription: message
              });
              return {
                ok: true,
                error: null,
                message
              };
            } else {
              return {
                ok: false,
                error: 'unauthorized',
                message: null
              };
            }
          } else {
            return {
              ok: false,
              error: 'chat not found',
              message: null
            };
          }
        } catch (error) {
          console.log(error.message);
          console.log(error);
          return {
            ok: false,
            error: error.message,
            message: null
          };
        }
      }
    )
  }
};

export default resolvers;
