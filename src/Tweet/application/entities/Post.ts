import { BaseTweet, IChildProps, TweetTypesEnum } from './baseTweet';

type IPropsPost = IChildProps;

export class Post extends BaseTweet {
  constructor(props: IPropsPost) {
    super({ ...props, type: TweetTypesEnum.POST });
  }
}
