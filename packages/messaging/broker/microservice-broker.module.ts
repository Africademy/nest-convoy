import { DynamicModule, Global, Module } from '@nestjs/common';
import { ClientOptions, MicroserviceOptions } from '@nestjs/microservices';

import { ConvoyCoreModule } from '@nest-convoy/core/core.module';
import {
  ConvoyMessagingConsumerModule,
  ConvoyMessagingProducerModule,
} from '@nest-convoy/messaging';

import { MicroserviceMessageConsumer } from './microservice-message-consumer';
import { MicroserviceMessageProducer } from './microservice-message-producer';
import { ConvoyMicroserviceProxy } from './microservice-proxy';
import { CLIENT_OPTIONS, SERVER_OPTIONS } from './tokens';

export interface ConvoyMessagingBrokerModuleOptions {
  appName: string;
  server?: MicroserviceOptions;
  client?: ClientOptions;
}

@Global()
@Module({})
export class ConvoyMessagingBrokerModule {
  static register(options: ConvoyMessagingBrokerModuleOptions): DynamicModule {
    return {
      module: ConvoyMessagingBrokerModule,
      imports: [
        ConvoyCoreModule.forRoot(),
        ConvoyMessagingConsumerModule.register({
          useExisting: MicroserviceMessageConsumer,
        }),
        ConvoyMessagingProducerModule.register({
          useExisting: MicroserviceMessageProducer,
        }),
      ],
      providers: [
        MicroserviceMessageConsumer,
        MicroserviceMessageProducer,
        ConvoyMicroserviceProxy,
        {
          provide: SERVER_OPTIONS,
          useValue: options.server,
        },
        {
          provide: CLIENT_OPTIONS,
          useValue: options.client,
        },
      ],
      exports: [
        ConvoyMessagingConsumerModule,
        ConvoyMessagingProducerModule,
        MicroserviceMessageConsumer,
        MicroserviceMessageProducer,
      ],
    };
  }
}
