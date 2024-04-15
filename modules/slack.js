import { WebClient } from '@slack/web-api';

const slack = new WebClient(process.env.SLACK_TOKEN);

const post = async (releaseNotes) => {
    let message = 'Suggested release notes: \n';
    message += releaseNotes.map(x => `- ${x.commit}: ${x.response}`).join('\n');

    const result = await slack.chat.postMessage({
        text: message,
        channel: process.env.SLACK_CHANNEL,
    });

    return result.ok;
};

export default { post };