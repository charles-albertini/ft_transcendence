// Utilitaires pour la gestion des images

/**
 * Redimensionne et convertit un fichier image en base64
 */
export function resizeImageToBase64(file: File, maxWidth: number = 150, maxHeight: number = 150, quality: number = 0.8): Promise<string> {
  return new Promise((resolve, reject) => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();
    
    img.onload = () => {
      // Calculer les nouvelles dimensions en gardant le ratio
      let { width, height } = img;
      
      if (width > height) {
        if (width > maxWidth) {
          height = (height * maxWidth) / width;
          width = maxWidth;
        }
      } else {
        if (height > maxHeight) {
          width = (width * maxHeight) / height;
          height = maxHeight;
        }
      }
      
      canvas.width = width;
      canvas.height = height;
      
      // Dessiner l'image redimensionnée
      ctx?.drawImage(img, 0, 0, width, height);
      
      // Convertir en base64
      const base64 = canvas.toDataURL('image/jpeg', quality);
      resolve(base64);
    };
    
    img.onerror = reject;
    img.src = URL.createObjectURL(file);
  });
}

/**
 * Valide si une chaîne est un base64 valide d'image
 */
export function isValidImageBase64(base64: string): boolean {
  const base64Regex = /^data:image\/(png|jpeg|jpg|gif|webp);base64,/;
  return base64Regex.test(base64);
}

/**
 * Obtient la taille approximative d'une image base64 en bytes
 */
export function getBase64Size(base64: string): number {
  const base64Data = base64.split(',')[1] || base64;
  return Math.round(base64Data.length * 0.75);
}

/**
 * Avatars par défaut en base64 (petites images optimisées)
 */
export const DEFAULT_AVATARS_BASE64 = {
  default: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTUwIiBoZWlnaHQ9IjE1MCIgdmlld0JveD0iMCAwIDE1MCAxNTAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIxNTAiIGhlaWdodD0iMTUwIiByeD0iNzUiIGZpbGw9IiNkNGFmMzciLz4KPHN2ZyB4PSI0NSIgeT0iNDUiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSIjMDAwMDAwIj4KICA8cGF0aCBkPSJNMTIgMTJjMi4yMSAwIDQtMS43OSA0LTRzLTEuNzktNC00LTQtNCAxLjc5LTQgNCAxLjc5IDQgNCA0em0wIDJjLTIuNjcgMC04IDEuMzQtOCA0djJoMTZ2LTJjMC0yLjY2LTUuMzMtNC04LTR6Ii8+Cjwvc3ZnPgo8L3N2Zz4=',
  
  male1: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTUwIiBoZWlnaHQ9IjE1MCIgdmlld0JveD0iMCAwIDE1MCAxNTAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIxNTAiIGhlaWdodD0iMTUwIiByeD0iNzUiIGZpbGw9IiMyMmM1NWUiLz4KPHN2ZyB4PSI0NSIgeT0iNDUiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSIjZmZmZmZmIj4KICA8cGF0aCBkPSJNMTYgNGMwLTEuMTEtLjg5LTItMi0ycy0yIC44OS0yIDIgLjg5IDIgMiAyIDItLjg5IDItMnptNCA5Yy0xLjEgMC0yLS45LTItMnMuOS0yIDItMiAyIC45IDIgMi0uOSAyLTIgMnptLTMgN2gtMnYtN2gtM3Y3SDl2LTdINnY3SDR2LTlsMTItMnYxMXoiLz4KPC9zdmc+Cjwvc3ZnPg==',
  
  female1: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTUwIiBoZWlnaHQ9IjE1MCIgdmlld0JveD0iMCAwIDE1MCAxNTAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIxNTAiIGhlaWdodD0iMTUwIiByeD0iNzUiIGZpbGw9IiNlYzQ4OTkiLz4KPHN2ZyB4PSI0NSIgeT0iNDUiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSIjZmZmZmZmIj4KICA8cGF0aCBkPSJNMTIgMTJjMi4yMSAwIDQtMS43OSA0LTRzLTEuNzktNC00LTQtNCAxLjc5LTQgNCAxLjc5IDQgNCA0em0wIDJjLTIuNjcgMC04IDEuMzQtOCA0djJoMTZ2LTJjMC0yLjY2LTUuMzMtNC04LTR6Ii8+Cjwvc3ZnPgo8L3N2Zz4=',
  
  cat: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTUwIiBoZWlnaHQ9IjE1MCIgdmlld0JveD0iMCAwIDE1MCAxNTAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIxNTAiIGhlaWdodD0iMTUwIiByeD0iNzUiIGZpbGw9IiNmNTllMGIiLz4KPHN2ZyB4PSIzMCIgeT0iMzAiIHdpZHRoPSI5MCIgaGVpZ2h0PSI5MCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSIjMDAwMDAwIj4KICA8cGF0aCBkPSJtNC4yNSA1LjYxYy4xNi0uMTYuNDEtLjE2LjU3IDBsMi4yNCAyLjI0YzEuNS0xLjQ4IDMuNDEtMi4yOSA1LjQ0LTIuMjkgMi4wMyAwIDMuOTQuODEgNS40NCAyLjI5bDIuMjQtMi4yNGMuMTYtLjE2LjQxLS4xNi41NyAwcy4xNi40MSAwIC41N2wtMi4yNCAyLjI0Yy4wNS4wNS4xLjEuMTUuMTVsMS4zOC0xLjM4YzEuODItMS44MiA0Ljc3LTEuODIgNi41OSAwIDEuODIgMS44MiAxLjgyIDQuNzcgMCA2LjU5bC0xLjM4IDEuMzhjLS4wNS0uMDUtLjEtLjEtLjE1LS4xNWwyLjI0IDIuMjRjLjE2LjE2LjE2LjQxIDAgLjU3cy0uNDEuMTYtLjU3IDBsLTIuMjQtMi4yNGMtMS41IDEuNDgtMy40MSAyLjI5LTUuNDQgMi4yOS0yLjAzIDAtMy45NC0uODEtNS40NC0yLjI5bC0yLjI0IDIuMjRjLS4xNi4xNi0uNDEuMTYtLjU3IDBzLS4xNi0uNDEgMC0uNTdsMS4zOC0xLjM4YzEuODIgMS44MiA0Ljc3IDEuODIgNi41OSAwIDEuODItMS44MiAxLjgyLTQuNzcgMC02LjU5bC0xLjM4LTEuMzhjLS4wNS4wNS0uMS4xLS4xNS4xNWwyLjI0LTIuMjRjLjE2LS4xNi4xNi0uNDEgMC0uNTd6Ii8+Cjwvc3ZnPgo8L3N2Zz4=',
  
  gamer: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTUwIiBoZWlnaHQ9IjE1MCIgdmlld0JveD0iMCAwIDE1MCAxNTAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIxNTAiIGhlaWdodD0iMTUwIiByeD0iNzUiIGZpbGw9IiM4YjVjZjYiLz4KPHN2ZyB4PSI0NSIgeT0iNDUiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSIjZmZmZmZmIj4KICA8cGF0aCBkPSJNMjEuNTggOS4xN2MtLjU2LS42Ni0xLjItLjEyLTEuNzctLjE3LS45OS0uMDktMS4zNS0xLjE5LTIuMTMtMS4zMy0uNzgtLjE0LTEuNTguNTEtMi4yNS0uMDctLjY3LS41OC0uNTMtMS41Mi0xLjM4LTEuOTEtLjg1LS4zOS0xLjctLjA5LTIuNDUtLjc3LS43NS0uNjgtLjI3LTEuODktMS4yMy0yLjI0LS45Ni0uMzUtMS44NC40Ni0yLjc5LS4yNy0uOTUtLjczLS4xOC0yLjEzLTEuMzEtMi42M3MtMi4xMi41LTMuMTMtLjQ3YzE6wIDEwO2cgaDI0djE1SDBWOS4xN3oiLz4KPC9zdmc+Cjwvc3ZnPg=='
};
