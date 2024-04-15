const headers = {
    'Content-Type': 'application/json',
    'Authorization': `Basic ${btoa(`Basic:${process.env.AZURE_TOKEN}`)}`,
 };

const getLastCommit = async (branch) => {
    const url = `https://dev.azure.com/${process.env.AZURE_ORGANIZATION}/${process.env.AZURE_PROJECT}/_apis/git/repositories/${process.env.AZURE_REPOSITORY}/commits?searchCriteria.itemVersion.versionType=branch&searchCriteria.itemVersion.version=${encodeURIComponent(branch)}&searchCriteria.$top=1`;

    const response = await fetch(url, {
        method: 'GET',
        headers: headers,
    });

    const data = await response.json();

    return data.value[0];
};

const getCommits = async (branch, start, end) => {
    const url = `https://dev.azure.com/${process.env.AZURE_ORGANIZATION}/${process.env.AZURE_PROJECT}/_apis/git/repositories/${process.env.AZURE_REPOSITORY}/commits?searchCriteria.itemVersion.versionType=branch&searchCriteria.itemVersion.version=${encodeURIComponent(branch)}&searchCriteria.fromDate=${start}&searchCriteria.toDate=${end}&searchCriteria.includeWorkItems=true`;
    
    const response = await fetch(url, {
        method: 'GET',
        headers: headers,
    });

    const data = await response.json();
    return data.value;
};

const getWorkItem = async (url) => {
    const response = await fetch(url, {
        method: 'GET',
        headers: headers,
    });

    const data = await response.json();
    return data;
};

export default { getLastCommit, getCommits, getWorkItem };