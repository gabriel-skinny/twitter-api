import User from 'src/Client/application/entities/User/User';

export class UserViewModel {
  id: string;
  name: string;
  email: string;
  profileName: string;
  profilePictureS3Url: string;
  bannerS3Url: string;
  location: string;
  website: string;
  bio: string;

  constructor(user: User) {
    this.id = user.id;
    this.name = user.name;
    this.profileName = user.profileName;
    this.profilePictureS3Url = user.profilePictureS3Url;
    this.bannerS3Url = user.bannerS3Url;
    this.location = user.location;
    this.website = user.website;
    this.bio = user.bio;
  }
}

export class UserPaginationViewModel {
  totalCount: number;
  totalPages: number;
  actualPage: number;
  data: UserViewModel[];
  perPage: number;

  constructor({
    users,
    perPage,
    page,
    total,
  }: {
    users: UserViewModel[];
    perPage: number;
    page: number;
    total: number;
  }) {
    this.data = users;
    this.totalPages = Math.floor(total / perPage) + 1;
    this.actualPage = page;
    this.perPage = perPage;
    this.totalCount = total;
  }
}
