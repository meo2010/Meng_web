document.addEventListener('DOMContentLoaded', function() {
    const uploadBtn = document.getElementById('uploadBtn');
    const fileInput = document.getElementById('fileInput');
    const storyList = document.getElementById('storyList');
    const storyDisplay = document.getElementById('storyDisplay');
    const currentStoryTitle = document.getElementById('currentStoryTitle');

    // Handle file upload button
    uploadBtn.addEventListener('click', function() {
        fileInput.click();
    });

    // Handle file selection
    fileInput.addEventListener('change', function(e) {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function(e) {
                // Add story to list
                const listItem = document.createElement('li');
                listItem.textContent = file.name;
                listItem.dataset.content = e.target.result;
                storyList.appendChild(listItem);

                // Add click handler to display story
                listItem.addEventListener('click', function() {
                    displayStory(file.name, this.dataset.content);
                });
            };
            reader.readAsText(file);
        }
    });

    function displayStory(title, content) {
        currentStoryTitle.textContent = title;
        storyDisplay.textContent = content;
    }
});