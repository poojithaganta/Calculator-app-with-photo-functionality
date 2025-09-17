import multer from 'multer';
import path from 'path';

/**
 * Multer configuration for file uploads
 */
const storage = multer.memoryStorage();

/**
 * File filter function to validate uploaded files
 * @param {Object} req - Express request object
 * @param {Object} file - Uploaded file object
 * @param {Function} cb - Callback function
 */
const fileFilter = (req, file, cb) => {
    // Check file type
    const allowedMimeTypes = ['image/png', 'image/jpeg', 'image/jpg'];
    
    if (!allowedMimeTypes.includes(file.mimetype)) {
        return cb(new Error('Invalid file type. Only PNG, JPEG, and JPG images are allowed.'), false);
    }

    // Check file extension
    const allowedExtensions = ['.png', '.jpg', '.jpeg'];
    const fileExtension = path.extname(file.originalname).toLowerCase();
    
    if (!allowedExtensions.includes(fileExtension)) {
        return cb(new Error('Invalid file extension. Only .png, .jpg, and .jpeg files are allowed.'), false);
    }

    cb(null, true);
};

/**
 * Multer upload configuration
 */
const upload = multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: {
        fileSize: 5 * 1024 * 1024, // 5MB limit
        files: 1 // Only allow 1 file
    }
});

/**
 * Error handling middleware for multer
 */
const handleMulterError = (error, req, res, next) => {
    if (error instanceof multer.MulterError) {
        if (error.code === 'LIMIT_FILE_SIZE') {
            return res.status(400).json({
                error: 'File size too large. Maximum size is 5MB.'
            });
        }
        if (error.code === 'LIMIT_FILE_COUNT') {
            return res.status(400).json({
                error: 'Too many files. Only 1 file is allowed.'
            });
        }
        return res.status(400).json({
            error: 'File upload error: ' + error.message
        });
    }
    
    if (error.message.includes('Invalid file type') || error.message.includes('Invalid file extension')) {
        return res.status(400).json({
            error: error.message
        });
    }
    
    next(error);
};

export {
    upload,
    handleMulterError
};

