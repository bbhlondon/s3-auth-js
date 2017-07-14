/* global ENV*/
export default function canLog() {
    try {
        return ENV !== 'production';
    } catch (e) {
        return true;
    }
}
