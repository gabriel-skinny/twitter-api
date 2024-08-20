import {
  BaseTweet,
  IChildProps,
  IPropsBaseTweet,
  TweetTypesEnum,
} from './baseTweet';

type IPropsTweet = IChildProps;

export class Tweet extends BaseTweet {
  constructor(props: IPropsTweet) {
    super({ ...props, type: TweetTypesEnum.POST });
  }
}
