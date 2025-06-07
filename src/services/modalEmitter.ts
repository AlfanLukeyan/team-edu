import { EventEmitter } from 'events';

interface AlertOptions {
    title: string;
    message: string;
    confirmText?: string;
    cancelText?: string;
    type?: 'warning' | 'danger' | 'info';
    onConfirm?: () => void;
    onCancel?: () => void;
}

interface CrucialAuthOptions {
    title?: string;
    description?: string;
    onSuccess: () => void;
    onCancel: () => void;
}

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

    // Custom Alert Modal
    showAlert(options: AlertOptions) {
        this.emit('SHOW_ALERT', options);
    }

    hideAlert() {
        this.emit('HIDE_ALERT');
    }

    // Auth-related events
    unauthorized() {
        this.emit('UNAUTHORIZED');
    }

    anotherDeviceLogin(message: string) {
        this.emit('ANOTHER_DEVICE_LOGIN', message);
    }

    showCrucialAuth(options: CrucialAuthOptions) {
        this.emit('SHOW_CRUCIAL_AUTH', options);
    }

    hideCrucialAuth() {
        this.emit('HIDE_CRUCIAL_AUTH');
    }
}

export const ModalEmitter = new ModalEmitterClass();

export const ErrorModalEmitter = ModalEmitter;
export const SuccessModalEmitter = ModalEmitter;
export const LoadingModalEmitter = ModalEmitter;
export const AlertModalEmitter = ModalEmitter;