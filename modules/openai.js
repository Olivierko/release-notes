import OpenAI from 'openai';

const interval = 2000;

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

const thread = await openai.beta.threads.create();

const getResponse = async (query) => {
    await openai.beta.threads.messages.create(
        thread.id,
        { role: 'user', content: query }
    );
    
    const run = await openai.beta.threads.runs.create(thread.id, {
        assistant_id : process.env.OPENAI_ASSISTANT_ID,
    });
    
    let currentRun = await openai.beta.threads.runs.retrieve(run.thread_id, run.id);
    
    while (currentRun.status === 'in_progress' || currentRun.status === 'queued') {
        currentRun = await openai.beta.threads.runs.retrieve(run.thread_id, run.id);
        await new Promise(resolve => setTimeout(resolve, interval));
    }
    
    const messages = await openai.beta.threads.messages.list(
        thread.id
    );

    return messages.data[0].content[0].text.value;
};

export default { getResponse };