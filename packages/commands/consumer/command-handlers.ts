import { Handlers } from '@nest-convoy/common';

import { CommandHandler } from './command-handler';

export class CommandHandlers extends Handlers<CommandHandler> {
  getChannels(): string[] {
    return this.handlers.map(handler => handler.channel);
  }
}
