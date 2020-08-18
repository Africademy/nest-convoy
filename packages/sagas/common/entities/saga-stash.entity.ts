import { MessageHeaders } from '@nest-convoy/messaging/common';
import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity('saga_stash')
export class SagaStashEntity<P = Record<string, unknown>> {
  @PrimaryColumn({ name: 'message_id' })
  messageId: string;

  @Column()
  target: string;

  @Column({ name: 'saga_type' })
  sagaType: string;

  @Column({ name: 'saga_id' })
  sagaId: string;

  @Column({
    name: 'message_headers',
    type: 'simple-json',
    transformer: {
      to(value: Record<string, string>): MessageHeaders {
        return new Map(Object.entries(value));
      },
      from(value: MessageHeaders): Record<string, string> {
        return Object.fromEntries(value);
      },
    },
  })
  messageHeaders: MessageHeaders;

  @Column({ name: 'message_payload' })
  messagePayload: string;
}