import { EventEmitter } from 'events';

class ModalEmitterClass extends EventEmitter {
    // Error Modal
    showError(message: string) {
        this.emit('SHOW_ERROR', message);
    }

    // Success Modal  
    showSuccess(message: string) {
        this.emit('SHOW_SUCCESS', message);
    }

    // Loading Modal
    showLoading(message?: string) {
        this.emit('SHOW_LOADING', message);
    }

    hideLoading() {
        this.emit('HIDE_LOADING');
    }

    // Auth-related events
    unauthorized() {
        this.emit('UNAUTHORIZED');
    }

    anotherDeviceLogin(message: string) {
        this.emit('ANOTHER_DEVICE_LOGIN', message);
    }
}

export const ModalEmitter = new ModalEmitterClass();


export const ErrorModalEmitter = ModalEmitter;
export const SuccessModalEmitter = ModalEmitter;
export const LoadingModalEmitter = ModalEmitter;