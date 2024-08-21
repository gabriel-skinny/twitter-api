import AbstractMessageBroker, {
  EVENT_TYPES_ENUM,
} from '../../services/messageBroker';

export class MessageBrockerMock implements AbstractMessageBroker {
  async sendEvent(data: {
    eventType: EVENT_TYPES_ENUM;
    data: Record<any, any>;
  }) {}
}
