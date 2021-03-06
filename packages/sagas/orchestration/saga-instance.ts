import { Instance } from '@nest-convoy/common';

import { DestinationAndResource } from './destination-and-resource';

export class SagaInstance<Data = any> {
  constructor(
    public sagaType: string,
    // TODO: This is auto generated
    public sagaId: string,
    public stateName: string,
    public lastRequestId: string | undefined,
    public sagaDataType: string,
    public sagaData: Data,
    public destinationsAndResources: DestinationAndResource[] = [],
    public endState = false,
    public compensating = false,
  ) {}
}
