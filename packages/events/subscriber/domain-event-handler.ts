import { Message } from '@nest-convoy/messaging/common';
import { AsyncLikeFn, Handler } from '@nest-convoy/common';
import {
  DomainEvent,
  DomainEventType,
  EventMessageHeaders,
} from '@nest-convoy/events/common';

import { DomainEventEnvelope } from './domain-event-envelope';

export type DomainEventMessageHandler<E extends DomainEvent> = AsyncLikeFn<
  [dee: DomainEventEnvelope<E>],
  void
>;

export class DomainEventHandler<E = any>
  implements Handler<DomainEventMessageHandler<E>> {
  constructor(
    readonly event: DomainEventType,
    readonly invoke: DomainEventMessageHandler<E>,
    readonly aggregateType: string,
  ) {}

  handles(message: Message): boolean {
    return (
      this.aggregateType ===
        message.getHeader(EventMessageHeaders.AGGREGATE_TYPE) &&
      this.event.name ===
        message.getRequiredHeader(EventMessageHeaders.EVENT_TYPE)
    );
  }
}
