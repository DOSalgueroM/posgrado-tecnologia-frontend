import { ref } from 'vue';

interface SnackbarOptions {
  color?: string;
  timeout?: number;
}

const snackbarVisible = ref(false);
const snackbarMessage = ref('');
const snackbarColor = ref('');
const snackbarTimeout = ref(3000);

export function useSnackbar() {
  const showSnackbar = (message: string, type: 'success' | 'error' | 'info' | 'warning' = 'info', options: SnackbarOptions = {}) => {
    snackbarMessage.value = message;
    snackbarColor.value = options.color || getColorByType(type);
    snackbarTimeout.value = options.timeout || 3000;
    snackbarVisible.value = true;
  };

  const hideSnackbar = () => {
    snackbarVisible.value = false;
  };

  const getColorByType = (type: string): string => {
    switch (type) {
      case 'success':
        return 'success';
      case 'error':
        return 'error';
      case 'warning':
        return 'warning';
      default:
        return 'info';
    }
  };

  return {
    snackbarVisible,
    snackbarMessage,
    snackbarColor,
    snackbarTimeout,
    showSnackbar,
    hideSnackbar
  };
}
