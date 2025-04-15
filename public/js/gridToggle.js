document.addEventListener('DOMContentLoaded', function() {
    // Get the grid toggle buttons
    const gridButtons = document.querySelectorAll('.grid-toggle-btn');

    // Get the property container
    const propertyGrid = document.querySelector('.property-grid');

    // Check if elements exist
    if (!gridButtons.length || !propertyGrid) return;

    // Add click event listeners to each button
    gridButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Remove active class from all buttons
            gridButtons.forEach(btn => btn.classList.remove('active'));

            // Add active class to the clicked button
            this.classList.add('active');

            // Get the view type from the button's data attribute
            const viewType = this.getAttribute('data-view');

            // Remove existing view classes
            propertyGrid.classList.remove('grid-view', 'list-view');

            // Add the new view class
            propertyGrid.classList.add(viewType + '-view');
        });
    });
});
