import 'dotenv';
import { Octokit } from 'octokit';
import { createAppAuth } from '@octokit/auth-app';
import fs from 'fs';
import path from 'path';


const privateKey = fs.readFileSync(path.resolve(process.cwd(),`${process.env.PEM_FILENAME}`), { encoding: "utf8" });

export default async function handler(req, res) {
    const octokit = new Octokit({
        authStrategy: createAppAuth,
        auth: {
            appId: process.env.GITHUB_APP_ID,
            privateKey,
            installationId: process.env.GITHUB_INSTALLATION_ID,
        }
    });
    
    const {data} = await octokit.rest.apps.getAuthenticated();

    res.status(200).json(data)
}



