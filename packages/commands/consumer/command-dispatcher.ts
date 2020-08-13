import { Logger } from '@nestjs/common';
import { ConvoyMessageConsumer } from '@nest-convoy/messaging/consumer';
import { Message, MessageHeaders } from '@nest-convoy/messaging/common';
import { Dispatcher, RuntimeException } from '@nest-convoy/common';
import {
  MessageBuilder,
  ConvoyMessageProducer,
} from '@nest-convoy/messaging/producer';
import {
  CommandMessageHeaders,
  CommandReplyOutcome,
  correlateMessageHeaders,
  Failure,
  MissingCommandHandlerException,
  ReplyMessageHeaders,
} from '@nest-convoy/commands/common';

import { CommandHandlers } from './command-handlers';
import { CommandMessage } from './command-message';
import { CommandHandler } from './command-handler';
import { withFailure, withSuccess } from './command-handler-reply-builder';

export class CommandDispatcher implements Dispatcher {
  private readonly logger = new Logger(this.constructor.name, true);

  constructor(
    protected readonly commandDispatcherId: string,
    protected readonly commandHandlers: CommandHandlers,
    protected readonly messageConsumer: ConvoyMessageConsumer,
    protected readonly messageProducer: ConvoyMessageProducer,
  ) {}

  async subscribe(): Promise<void> {
    await this.messageConsumer.subscribe(
      this.commandDispatcherId,
      this.commandHandlers.getChannels(),
      this.handleMessage.bind(this),
    );
  }

  protected async invoke(
    commandHandler: CommandHandler,
    commandMessage: CommandMessage,
  ): Promise<Message[]> {
    // TODO: Figure out whether or not it should sendReplies or handleException
    const reply = await commandHandler.invoke(commandMessage);
    // if (
    //   reply.getHeader(ReplyMessageHeaders.REPLY_OUTCOME) ===
    //   CommandReplyOutcome.FAILURE
    // ) {
    //   throw new Error(reply.getRequiredHeader(ReplyMessageHeaders.REPLY_TYPE));
    // }

    return [reply];
    // try {
    //   const reply = await commandHandler.invoke(commandMessage);
    //   console.log('invoke', reply);
    //   if (Array.isArray(reply)) return reply;
    //   return (reply as any) instanceof Message ? [reply] : [withSuccess(reply)];
    // } catch (err) {
    //   return [withFailure(err)];
    // }
  }

  async handleMessage(message: Message): Promise<void> {
    const commandHandler = this.commandHandlers.findTargetMethod(message);
    if (!commandHandler) {
      throw new MissingCommandHandlerException(message);
    }

    const correlationHeaders = correlateMessageHeaders(message.getHeaders());

    const defaultReplyChannel = message.getRequiredHeader(
      CommandMessageHeaders.REPLY_TO,
    );

    let replies: Message[];
    try {
      const command = Object.assign(
        new commandHandler.command(),
        message.parsePayload(),
      );

      const commandMessage = new CommandMessage(
        command,
        correlationHeaders,
        message,
      );
      replies = await this.invoke(commandHandler, commandMessage);
      this.logger.debug(
        `Generated replies ${this.commandDispatcherId} ${
          message.constructor.name
        } ${JSON.stringify(replies)}`,
      );
    } catch (err) {
      this.logger.error(
        `Generated error ${this.commandDispatcherId} ${JSON.stringify(
          message,
        )}`,
      );
      await this.handleException(message, defaultReplyChannel /*, err*/);
      return;
    }

    if (Array.isArray(replies)) {
      await this.sendReplies(correlationHeaders, replies, defaultReplyChannel);
    } else {
      this.logger.debug('Null replies - not publishing');
    }
  }

  private async handleException(
    message: Message,
    // commandHandler: CommandHandler,
    defaultReplyChannel: string,
    // error: Error,
  ): Promise<void> {
    const reply = MessageBuilder.withPayload(new Failure()).build();
    const correlationHeaders = correlateMessageHeaders(message.getHeaders());
    await this.sendReplies(correlationHeaders, [reply], defaultReplyChannel);
  }

  private async sendReplies(
    correlationHeaders: MessageHeaders,
    replies: Message[],
    defaultReplyChannel?: string,
  ): Promise<void> {
    for (const reply of replies) {
      const message = MessageBuilder.withMessage(reply)
        .withExtraHeaders('', correlationHeaders)
        .build();

      await this.messageProducer.send(defaultReplyChannel, message);
    }
  }
}
