import fs from 'fs/promises';
import path from 'path';

export const saveCSVFile = async (fileData, file) => {
    try {
        // Créer le dossier s'il n'existe pas
        await fs.mkdir('./uploads/csv', { recursive: true });
        
        // Générer un nom de fichier unique
        const fileName = file;
        const filePath = path.join('./uploads/csv', fileName);
        
        // Convertir et sauvegarder les données
        const buffer = Buffer.from(fileData);
        await fs.writeFile(filePath, buffer);
        
        return fileName;
    } catch (error) {
        console.error('Erreur sauvegarde fichier:', error);
        throw error;
    }
};

// import multer from "multer";
// import util from 'util';

// const csvStorage = multer.diskStorage({
//     destination: (req, file, cb) => {
//         cb(null, "./uploads/csv/");
//     },
//     filename: (req, file, cb) => {
//         cb(null, Date.now() + '_' + file.originalname);
//     }
// });

// const csvFilter = (req, file, cb) => {
//     if (file.mimetype === 'text/csv') {
//         cb(null, true);
//     } else {
//         cb(new Error('Format de fichier non autorisé. Seuls les fichiers CSV sont acceptés.'), false);
//     }
// };

// const upload = multer({
//     storage: csvStorage,
//     fileFilter: csvFilter
// }).single('csvFile');

// export const uploadCSV = util.promisify(upload);
