const fs = require('fs');
const path = require('path');

const saveImageUpload = (imageFile, options = {}) => {
  const {
    folder = 'images',
    label = 'Image',
    maxSizeMb = 5,
    allowedTypes = {
      'image/jpeg': '.jpg',
      'image/png': '.png',
      'image/webp': '.webp',
    },
  } = options;
  const { name = 'image', dataUrl } = imageFile || {};
  const match = typeof dataUrl === 'string' && dataUrl.match(/^data:([\w/+.-]+);base64,(.+)$/);

  if (!match) {
    const error = new Error(`Invalid ${label.toLowerCase()} upload`);
    error.statusCode = 400;
    throw error;
  }

  const extension = allowedTypes[match[1]];

  if (!extension) {
    const error = new Error(`Only JPG, PNG, or WEBP ${label.toLowerCase()}s are allowed`);
    error.statusCode = 400;
    throw error;
  }

  const buffer = Buffer.from(match[2], 'base64');
  if (buffer.length > maxSizeMb * 1024 * 1024) {
    const error = new Error(`${label} must be ${maxSizeMb}MB or smaller`);
    error.statusCode = 400;
    throw error;
  }

  const uploadDir = path.join(__dirname, '..', 'uploads', folder);
  fs.mkdirSync(uploadDir, { recursive: true });

  const safeBaseName = path
    .basename(name)
    .replace(/\.[^.]+$/, '')
    .replace(/[^a-z0-9.-]/gi, '-')
    .toLowerCase() || 'image';
  const filename = `${Date.now()}-${Math.random().toString(36).slice(2, 10)}-${safeBaseName}${extension}`;

  fs.writeFileSync(path.join(uploadDir, filename), buffer);
  return `/uploads/${folder}/${filename}`;
};

module.exports = saveImageUpload;
