document.addEventListener('DOMContentLoaded', function() {
    const jobList = document.querySelector('.job-list');
    const loadMoreButton = document.getElementById('load-more');

    let jobIds = [];
    let startIndex = 0;
    let endIndex = 6;

    const fetchJobIds = () => {
        fetch('https://hacker-news.firebaseio.com/v0/jobstories.json')
            .then(response => response.json())
            .then(data => {
                jobIds = data;
                displayJobs();
            })
            .catch(error => console.error('Error fetching job IDs:', error));
    };

    async function fetchJobDetails(id) {
        const response = await fetch(`https://hacker-news.firebaseio.com/v0/item/${id}.json`);
        return await response.json();
    }

    const displayJobs = () => {
        for (let i = startIndex; i < endIndex; i++) {
            if (i >= jobIds.length) {
                loadMoreButton.style.display = 'none';
                break;
            }
            const jobId = jobIds[i];
            fetchJobDetails(jobId)
                .then(job => {
                    const jobItem = document.createElement('li');
                    jobItem.innerHTML = `
                        <h2>${job.title}</h2>
                        <p>Posted by ${job.by} on ${new Date(job.time * 1000).toLocaleDateString()}</p>
                        ${job.url ? `<a href="${job.url}" target="_blank">Details</a>` : ''}
                    `;
                    jobList.appendChild(jobItem);
                })
                .catch(error => console.error(`Error fetching job details for ID ${jobId}:`, error));
        }
        startIndex = endIndex;
        endIndex += 6;
    };

    loadMoreButton.addEventListener('click', displayJobs);

    fetchJobIds();
});
