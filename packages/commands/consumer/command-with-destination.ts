import { MessageHeaders } from '@nest-convoy/messaging/common';
import { Command } from '@nest-convoy/commands/common';

export const COMMAND_WITH_DESTINATION = Symbol('__commandWithDestination__');

export class CommandWithDestination<C = Command> implements Command {
  constructor(
    readonly channel: string,
    readonly command: C,
    readonly resource?: string,
    readonly extraHeaders: MessageHeaders = new Map(),
  ) {}
}
