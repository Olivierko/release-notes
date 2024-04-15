import * as readline from 'node:readline/promises';
import { stdin as input, stdout as output } from 'node:process';
import { stripHtml } from 'string-strip-html';
import azure from './modules/azure.js';
import openai from './modules/openai.js';
import slack from './modules/slack.js';

const blacklist = ['pipeline@azure.com'];

const rl = readline.createInterface({ input, output });

const oldRelease = `release/${await rl.question('Name of previous release branch: release/')}`;
const newRelease = `release/${await rl.question('Name of current release branch: release/')}`;

const lastOldCommit = await azure.getLastCommit(oldRelease);
const lastNewCommit = await azure.getLastCommit(newRelease);

const startDate = lastOldCommit.author.date;
const endDate = lastNewCommit.author.date;

// TODO: add paging
console.log(`Fetching commits from ${newRelease} between ${startDate} - ${endDate}`);
const commits = await azure.getCommits(newRelease, startDate, endDate);

const releaseNotes = [];

for (const commit of commits) {
    if (blacklist.includes(commit.author.email)) {
        continue;
    }

    if (!commit.workItems.length) {
        continue;
    }

    console.log(`${commit.commitId}/${commit.author.email}: ${commit.comment}`);

    const workItem = await azure.getWorkItem(commit.workItems[0].url);

    const title = workItem.fields['System.Title'];
    const description = stripHtml(workItem.fields['System.Description'] ?? '').result;

    const query = `${title}: ${description}`;
    const response = await openai.getResponse(query);

    console.log(`OpenAI: ${response}`);

    releaseNotes.push({
        commit: commit.commitId,
        author: commit.author.email,
        message: commit.comment,
        workItem: {
            title: title,
            description: description,
        },
        response: response,
    });
}

const result = await slack.post(releaseNotes);
console.log(`Posted to slack: ${result}`);

process.exit(0);