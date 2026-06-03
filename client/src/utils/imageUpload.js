export const prepareImageUpload = (file, options = {}) => {
  const {
    maxWidth = 1200,
    maxHeight = 1200,
    quality = 0.82,
  } = options;

  return new Promise((resolve, reject) => {
    if (!file) {
      reject(new Error('Please choose an image file.'));
      return;
    }

    if (!file.type?.startsWith('image/')) {
      reject(new Error('Only image files are allowed.'));
      return;
    }

    const reader = new FileReader();

    reader.onload = () => {
      const image = new Image();

      image.onload = () => {
        const scale = Math.min(1, maxWidth / image.width, maxHeight / image.height);
        const width = Math.max(1, Math.round(image.width * scale));
        const height = Math.max(1, Math.round(image.height * scale));
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;

        const context = canvas.getContext('2d');
        context.drawImage(image, 0, 0, width, height);

        const dataUrl = canvas.toDataURL('image/jpeg', quality);
        resolve({
          name: file.name.replace(/\.[^.]+$/, '.jpg'),
          type: 'image/jpeg',
          dataUrl,
        });
      };

      image.onerror = () => reject(new Error('Unable to read selected image.'));
      image.src = reader.result;
    };

    reader.onerror = () => reject(new Error('Unable to read selected image.'));
    reader.readAsDataURL(file);
  });
};
