const express = require('express');
const router = express.Router();
const manifestController = require('../controllers/manifestController');
const verifyToken = require('../auth')
// Route to add a new manifest
router.post('/api/manifestadd', manifestController.addManifest);

// Route to get all manifests
router.get('/api/manifest', verifyToken, manifestController.getAllManifests);


router.get('/api/adminmanifest', manifestController.getAllManifests);

// Route to delete a manifest by ID
router.delete('/api/manifest/:id', manifestController.deleteManifest);

// Route to update a manifest by ID
router.put('/api/manifest/:id', manifestController.updateManifest);

module.exports = router;
