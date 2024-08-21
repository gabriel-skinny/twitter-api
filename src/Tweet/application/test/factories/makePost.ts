import { Post } from '../../entities/Post';

export const makePost = (props?: Partial<Post>) => {
  return new Post({ content: 'Teste', userId: 'id', ...props });
};
