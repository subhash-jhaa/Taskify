import { Request, Response, NextFunction } from 'express';
import { encrypt, decrypt } from '../utils/encryption.js';

/**
 * Decrypts task title and description in the request body
 */
export const decryptRequest = (req: Request, res: Response, next: NextFunction) => {
    try {
        if (req.body) {
            if (req.body.title) {
                req.body.title = decrypt(req.body.title);
            }
            if (req.body.description) {
                req.body.description = decrypt(req.body.description);
            }
        }
        next();
    } catch (error) {
        next(error);
    }
};

/**
 * Encrypts task title and description in the response body
 */
export const encryptResponse = (req: Request, res: Response, next: NextFunction) => {
    const originalJson = res.json;

    res.json = function (body: any): Response {
        try {
            // Helper function to encrypt a task object
            const encryptTask = (task: any) => {
                if (task) {
                    if (task.title) task.title = encrypt(task.title);
                    if (task.description) task.description = encrypt(task.description);
                }
            };

            // Handle single task response
            if (body.task) {
                encryptTask(body.task);
            }

            // Handle array of tasks response (standard list)
            if (Array.isArray(body.tasks)) {
                body.tasks.forEach(encryptTask);
            }

            // Fallback for cases where task object might be at the root or list is root
            // (though current controller structure uses { tasks: [...] } or { task: {...} })
            
            return originalJson.call(this, body);
        } catch (error) {
            // If encryption fails, we should probably still send the response or an error
            // Calling originalJson with error message might be safer than letting it hang
            return originalJson.call(this, { success: false, message: "Encryption failed", error });
        }
    };

    next();
};
