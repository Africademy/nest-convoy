export enum ReviseOrderSagaState {
  REQUESTING_RESTAURANT_ORDER_UPDATE = 'REQUESTING_RESTAURANT_ORDER_UPDATE',
  AUTHORIZATION_INCREASED = 'AUTHORIZATION_INCREASED',
  COMPLETED = 'COMPLETED',
  REQUESTING_AUTHORIZATION = 'REQUESTING_AUTHORIZATION',
  REVERSING_ORDER_UPDATE = 'REVERSING_ORDER_UPDATE',
  REVERSING_AUTHORIZATION = 'REVERSING_AUTHORIZATION',
  WAITING_FOR_CHANGE_TO_BE_MADE = 'WAITING_FOR_CHANGE_TO_BE_MADE',
}
