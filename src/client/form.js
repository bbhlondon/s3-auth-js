export function initializeForm($form, onSubmit) {
    $form.classList.add('active');

    $form.addEventListener('submit', (event) => {
        event.preventDefault();

        const name = document.querySelector('#form__name').value;
        const password = document.querySelector('#form__password').value;

        onSubmit({ name, password });
    });
}

export function displayMessage(message) {
    document.querySelector('#message').classList.add('active');
    document.querySelector('#message__text').textContent = message;
}
