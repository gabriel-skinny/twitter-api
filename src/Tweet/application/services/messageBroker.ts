export enum EVENT_TYPES_ENUM {
  TWEET_CREATION = 'tweet_creation',
  TWEET_DELETION = 'tweet_deletion',
  TWEET_LIKED = 'tweet_liked',
  TWEET_DESLIKED = 'tweet_desliked',
  TWEET_SHARED = 'tweet_shared',
  TWEET_UNSHARED = 'tweet_unshared',
  TWEET_COMMENTED = 'tweet_commented',
  TWEET_UNCOMMENTED = 'tweet_uncommented',
}

export default abstract class AbstractMessageBroker {
  abstract sendEvent(data: {
    eventType: EVENT_TYPES_ENUM;
    data: Record<any, any>;
  });
}
