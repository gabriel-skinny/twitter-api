import { TweetTypesEnum } from '../../entities/baseTweet';

interface IFindManyByParentIdUseCaseParams {
  parentId: string;
  parentType: TweetTypesEnum;
}

export class FindCommentsByParentIdUseCase {
  constructor() {}

  execute(params: IFindManyByParentIdUseCaseParams) {
    if (params.parentType == TweetTypesEnum.COMMENT) {
      // GET Creator Reference
    } else {
      // GET withou Creator Reference
    }
  }
}
