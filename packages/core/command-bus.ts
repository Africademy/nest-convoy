import { Injectable } from '@nestjs/common';
// import { ICommandBus } from '@nestjs/cqrs';
import { v4 as uuidv4 } from 'uuid';

import { ConvoyMessageConsumer, Message } from '@nest-convoy/messaging';
import {
  Command,
  CommandReplyOutcome,
  ConvoyCommandProducer,
  ReplyMessageHeaders,
} from '@nest-convoy/commands';

@Injectable()
export class CommandBus /*implements ICommandBus*/ {
  constructor(
    private readonly commandProducer: ConvoyCommandProducer,
    private readonly messageConsumer: ConvoyMessageConsumer,
  ) {}

  execute<T extends Command>(
    channel: string,
    command: T,
    subscriberId = uuidv4(),
    replyChannel = uuidv4(),
  ): Promise<Message> {
    return new Promise(async (resolve, reject) => {
      await this.messageConsumer.subscribe(
        subscriberId,
        [replyChannel],
        (message: Message) => {
          switch (message.getHeader(ReplyMessageHeaders.REPLY_OUTCOME)) {
            case CommandReplyOutcome.FAILURE:
              return reject(message);

            case CommandReplyOutcome.SUCCESS:
              return resolve(message);

            default:
              throw new Error('Invalid CommandReplyOutcome');
          }
        },
      );

      const commandId = await this.commandProducer.send(
        channel,
        command,
        replyChannel,
      );
    });
  }
}
