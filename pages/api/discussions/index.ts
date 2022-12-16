import 'dotenv';
import { Octokit } from 'octokit';
import { createAppAuth } from '@octokit/auth-app';
import fs from 'fs';
import path from 'path';
import { NextApiRequest, NextApiResponse } from 'next';
import { IDiscussion, IDiscussionRes } from '../../../lib/types/adapter';


const privateKey = fs.readFileSync(path.resolve(process.cwd(),`${process.env.PEM_FILENAME}`), { encoding: "utf8" });

interface IQuery {
  first?: number;
  last?: number;
  before?: string;
  after?: string;
}

const GET_DISSCUSSIONS_QUERY =(query:IQuery)=> {
    let { last , first, before, after } = query || {};
    if(!first && !last){
      first = 10
    }
    return `query discussions {
    repository(owner: "Gh0st1n", name: "tbbr.io") {
      discussions(
        ${first&&!last ? `first: ${first}` : ''}
        ${last&&!first ? `last: ${last}` : ''}
        ${before ? `before: "${before}"` : ''}
        ${after ? `after: "${after}"` : ''}
        orderBy: {field: CREATED_AT, direction: DESC}
      ) {
        nodes {
          ...discussionFields
        }
        edges {
          cursor
        }
        totalCount
      }
    }
  }
  
  fragment discussionFields on Discussion {
    id
    url
    locked
    number
    title
    resourcePath
    author {
      login
      url
      ... on User {
        id
        email
        avatarUrl
        name
        login
        websiteUrl
      }
      resourcePath
      avatarUrl
    }
    body
    bodyHTML
    bodyText
    category {
      name
      id
      slug
      emoji
      emojiHTML
      description
    }
    comments(last: 10) {
      edges {
        node {
          id
        }
      }
    }
    publishedAt
    updatedAt
  }
`}

export default async function handler(req: NextApiRequest, res: NextApiResponse<{
  discussionNodes: IDiscussion[];
  totalCount: number;
}>) {
    const octokit = new Octokit({
        authStrategy: createAppAuth,
        auth: {
            appId: process.env.GITHUB_APP_ID,
            privateKey,
            installationId: process.env.GITHUB_INSTALLATION_ID,
        }
    });
    
    // authenticate as an installation
    await octokit.rest.apps.getAuthenticated();
    const discussionData:{repository: IDiscussionRes} = await octokit.graphql(GET_DISSCUSSIONS_QUERY(req.query))
    
    // format data
    const { nodes=[], edges=[], totalCount=0 } = discussionData.repository.discussions;
    const discussionNodes = nodes.map((node:IDiscussion, index:number) => {
      const { cursor } = edges[index] || {};
      node.cursor = cursor;
      return node;
    });

    res.status(200).json({discussionNodes, totalCount})
}
