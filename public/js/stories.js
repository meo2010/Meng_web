document.addEventListener('DOMContentLoaded', function() {
    const uploadBtn = document.getElementById('uploadBtn');
    const fileInput = document.getElementById('fileInput');
    const storyList = document.getElementById('storyList');
    const storyDisplay = document.getElementById('storyDisplay');
    const currentStoryTitle = document.getElementById('currentStoryTitle');
    const deleteBtn = document.getElementById('deleteBtn');
    
    let currentStoryElement = null;

    // Load existing stories when page loads
    loadStories();

    async function loadStories() {
        try {
            const response = await fetch('/api/stories');
            const stories = await response.json();
            storyList.innerHTML = '';
            stories.forEach(story => {
                addStoryToList(story);
            });
        } catch (err) {
            console.error('Error loading stories:', err);
        }
    }

    function addStoryToList(story) {
        const listItem = document.createElement('li');
        listItem.textContent = story.title;
        listItem.dataset.id = story.id;
        listItem.dataset.content = story.content;
        listItem.addEventListener('click', () => displayStory(listItem, story));
        storyList.appendChild(listItem);
    }

    uploadBtn.addEventListener('click', () => fileInput.click());

    fileInput.addEventListener('change', async function(e) {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = async function(e) {
                try {
                    const response = await fetch('/api/stories', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({
                            title: file.name,
                            content: e.target.result
                        })
                    });
                    const story = await response.json();
                    addStoryToList(story);
                } catch (err) {
                    console.error('Error saving story:', err);
                }
            };
            reader.readAsText(file, 'UTF-8');
        }
    });

    deleteBtn.addEventListener('click', async function() {
        if (currentStoryElement && confirm('Are you sure you want to delete this story?')) {
            try {
                await fetch(`/api/stories/${currentStoryElement.dataset.id}`, {
                    method: 'DELETE'
                });
                currentStoryElement.remove();
                currentStoryTitle.textContent = 'Select a Story';
                storyDisplay.textContent = '';
                deleteBtn.style.display = 'none';
                currentStoryElement = null;
            } catch (err) {
                console.error('Error deleting story:', err);
            }
        }
    });

    function displayStory(element, story) {
        currentStoryElement = element;
        currentStoryTitle.textContent = story.title;
        storyDisplay.innerHTML = story.content.replace(/\n/g, '<br>');
        deleteBtn.style.display = 'block';
        
        const allStories = storyList.getElementsByTagName('li');
        for (let story of allStories) {
            story.classList.remove('selected');
        }
        element.classList.add('selected');
    }
});