import { Injectable } from '@nestjs/common';

import { Success, CommandEndpointBuilder } from '@nest-convoy/core';

import { ReserveCreditCommand } from '../../../customers/commands';
import { Channel } from '../../../common';

@Injectable()
export class CustomerServiceProxy {
  readonly reserveCredit = new CommandEndpointBuilder(ReserveCreditCommand)
    .withChannel(Channel.CUSTOMER)
    .withReply(Success)
    .build();
}
