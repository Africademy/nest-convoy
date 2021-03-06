import { Command } from '@nest-convoy/commands/common';
import { LockTarget, CommandMessage } from '@nest-convoy/commands/consumer';
import { Message } from '@nest-convoy/messaging/common';

export interface PostLock<C extends Command> {
  apply(commandMessage: CommandMessage<C>, reply: Message): LockTarget;
}
