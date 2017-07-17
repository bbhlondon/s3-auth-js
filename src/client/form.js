import Logger from '../logger';

/**
 * Initialize login form
 * 
 * @export
 * @param {Element} $form Form Element
 * @param {function} onSubmit Form onSubmit callback
 */
export function initializeForm($form, onSubmit) {
    $form.classList.add('active');

    $form.addEventListener('submit', (event) => {
        event.preventDefault();

        try {
            // @ts-ignore
            const name = document.querySelector('#form__name').value;
            // @ts-ignore
            const password = document.querySelector('#form__password').value;

            onSubmit({ name, password });
        } catch (e) {
            Logger.error(e.message);
        }
    });
}

/**
 * Display error message
 * 
 * @export
 * @param {any} message 
 */
export function displayMessage(message) {
    try {
        document.querySelector('#message').classList.add('active');
        document.querySelector('#message__text').textContent = message;
    } catch (e) {
        Logger.error(e.message);
    }
}
