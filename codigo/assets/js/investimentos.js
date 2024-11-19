document.addEventListener('DOMContentLoaded', function() {
    const checkboxes = document.querySelectorAll('#progresso-lista input[type="checkbox"]');
    
    // Carregar o progresso salvo do localStorage
    loadProgress();

    checkboxes.forEach(checkbox => {
        checkbox.addEventListener('change', () => {
            updateProgress();
            saveProgress();
        });
    });

    updateProgress();

    function updateProgress() {
        const totalTasks = checkboxes.length;
        const completedTasks = document.querySelectorAll('#progresso-lista input[type="checkbox"]:checked').length;
        const progressPercentage = (completedTasks / totalTasks) * 100;
        
        document.getElementById('progress-bar').style.width = `${progressPercentage}%`;
    }

    function saveProgress() {
        const progressData = [];
        
        checkboxes.forEach((checkbox, index) => {
            progressData.push({
                id: checkbox.id,
                completed: checkbox.checked
            });
        });

        localStorage.setItem('progressData', JSON.stringify(progressData));
    }

    function loadProgress() {
        const progressData = JSON.parse(localStorage.getItem('progressData'));

        if (progressData) {
            progressData.forEach(item => {
                const checkbox = document.getElementById(item.id);
                if (checkbox) {
                    checkbox.checked = item.completed;
                }
            });
        }
    }
});
