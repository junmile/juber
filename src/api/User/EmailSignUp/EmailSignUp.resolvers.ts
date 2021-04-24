import { Resolvers } from '../../../types/resolvers';
import { EmailSignUpMutationArgs, EmailSignUpResponse } from 'src/types/graph';
import User from '../../../entities/User';
import createJWT from '../../../api/utils/createJWT';
import Verification from '../../../entities/Verification';
import { sendVerificationEmail } from '../../../api/utils/sendEmail';

const resolvers: Resolvers = {
  Mutation: {
    EmailSignUp: async (
      _,
      args: EmailSignUpMutationArgs
    ): Promise<EmailSignUpResponse> => {
      const { email } = args;
      try {
        const exitingUser = await User.findOne({ email });
        if (exitingUser) {
          return {
            ok: false,
            error: 'You should log in instead',
            token: null,
          };
        } else {
          console.log('verificationPhoneNumber :', args.phoneNumber);
          const phoneVerification = await Verification.findOne({
            payload: args.phoneNumber,
            verified: true,
          });
          if (phoneVerification) {
            const {
              email,
              firstName,
              lastName,
              password,
              age,
              phoneNumber,
            } = args;
            const newUser = await User.create({
              email,
              firstName,
              lastName,
              password,
              age,
              phoneNumber,
            }).save();
            newUser.verifiedPhoneNumber = true;
            newUser.save();
            if (newUser.email) {
              const emailVerification = await Verification.create({
                payload: newUser.email,
                target: 'EMAIL',
              }).save();

              await sendVerificationEmail(
                newUser.fullName,
                emailVerification.key,
                args.email
              );
            }
            const token = createJWT(newUser.id);
            return {
              ok: true,
              error: null,
              token,
            };
          } else {
            return {
              ok: true,
              error: "You haven't verified your phone number",
              token: null,
            };
          }
        }
      } catch (error) {
        return {
          ok: false,
          error: error.message,
          token: null,
        };
      }
    },
  },
};

export default resolvers;
