
export default class User {
    id: string;
    profileName: string;
    name: string;
    email: string;
    password_hash: string;
    email_validated: boolean;
    profilePictureS3Url?: string;
    bannerS3Url?: string;
    location?: string;
    website?: string;
    bio?: string;
    
    constructor (props)

}