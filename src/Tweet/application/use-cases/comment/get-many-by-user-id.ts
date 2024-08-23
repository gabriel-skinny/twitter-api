import { TweetTypesEnum } from '../../entities/baseTweet';

interface IFindManyCommentsUseCaseParams {
  parentId: string;
  parentType: TweetTypesEnum;
}

export class FindManyCommentsUseCase {
  constructor() {}

  execute(params: IFindManyCommentsUseCaseParams) {
    // Find com creator reference include
  }
}
