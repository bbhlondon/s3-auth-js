import { ERROR_PARAM_REQUIRED } from './consts';
/**
 * Make message
 * 
 * @export
 * @param {String} type 
 * @param {any} [payload={}] 
 * @returns 
 */
export default function makeMessage(type, payload = {}) {
    if (!type) throw Error(ERROR_PARAM_REQUIRED);

    return { type, payload };
}
