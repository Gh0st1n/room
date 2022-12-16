import 'dotenv';
import { Octokit } from 'octokit';
import { createAppAuth } from '@octokit/auth-app';
import fs from 'fs';
import path from 'path';


const privateKey = fs.readFileSync(path.resolve(process.cwd(),`${process.env.PEM_FILENAME}`), { encoding: "utf8" });

const GET_DISSCUSSIONS_QUERY =()=> `query discussions {
    repository(owner: "Gh0st1n", name: "tbbr.io") {
      discussions(
        last: 10
        # before: "Y3Vyc29yOnYyOpK5MjAyMi0xMi0xNVQxNzoyNzoxNCswODowMM4ARzKS"
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
`

export default async function handler(req, res) {
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

    const discussionData = await octokit.graphql(GET_DISSCUSSIONS_QUERY())

    res.status(200).json(discussionData.repository)
}



