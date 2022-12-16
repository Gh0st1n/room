  export interface IUser {
    avatarUrl: string;
    login: string;
    url: string;
  }

  export interface IComment {
    [key:string]: any // TODO: add all fields
  }

  export interface IDiscussion {
    [key:string]: any // TODO: add all fields
  }

  export interface IDiscussionRes {
    // repository: {
        discussions: {
            nodes: IDiscussion[];
            edges: [{
                cursor: string
            }]
            totalCount: number;
        }
    // }
  }

  export interface IError {
    error: string;
  }
  