# Description
A hackathon project that aims to generate release notes using *OpenAI*, *Azure Web API* and publishing through *Slack*.

## Usage
1. Queries the name of old and new release branch to use
2. Fetches all commits in new branch since old release
3. Queries *OpenAI* for a descriptive fix for each commit with a related work item
4. Publishes all generated release notes as suggestions in specified *Slack* channel

## Environment variables
```
AZURE_TOKEN=
AZURE_ORGANIZATION=
AZURE_PROJECT=
AZURE_REPOSITORY=
OPENAI_API_KEY=
OPENAI_ASSISTANT_ID=
SLACK_TOKEN=
SLACK_CHANNEL=
```