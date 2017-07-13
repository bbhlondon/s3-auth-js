export default function initializeForm($form, callback) {
    $form.classList.add('active');
    $form.addEventListener('submit', (event) => {
        event.preventDefault();
        callback();
    });
}
