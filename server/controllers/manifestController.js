const { Manifest } = require('../models/userModel');

// Controller to add a new manifest
exports.addManifest = async (req, res) => {
  try {
    // Extract fields from the request body
    const {
      week,
      email,
      developername,
      advisorname,
      reviewername,
      color,
      nextweektask,
      improvementupdate,
      code,
      theory,
    } = req.body;

    // Create a new manifest instance
    const newManifest = new Manifest({
      week,
      email,
      developername,
      advisorname,
      reviewername,
      color,
      nextweektask,
      improvementupdate,
      code,
      theory,
    });

    // Save the manifest to the database
    await newManifest.save();

    res.status(201).json({ message: 'Manifest added successfully', manifest: newManifest });
  } catch (err) {
    res.status(500).json({ error: err.message });
    console.error(err);
  }
};

// Controller to get all manifests
exports.getAllManifests = async (req, res) => {
  try {
    const manifests = await Manifest.find();

    res.status(200).json({ manifest: manifests });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: err.message });
  }
};

// Controller to delete a manifest by ID
exports.deleteManifest = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedManifest = await Manifest.findByIdAndDelete(id);

    if (!deletedManifest) {
      return res.status(404).json({ error: 'Manifest not found' });
    }

    res.json({ message: 'Manifest deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Controller to update a manifest by ID
exports.updateManifest = async (req, res) => {
  try {
    // Destructure values from req.body
    const {
      week,
      email,
      developername,
      advisorname,
      reviewername,
      color,
      nextweektask,
      improvementupdate,
      code,
      theory,
    } = req.body;

    // Check if any required fields are missing
    const requiredFields = [
      week,
      email,
      developername,
      advisorname,
      reviewername,
      color,
      nextweektask,
      improvementupdate,
      code,
      theory,
    ];
    if (requiredFields.some((field) => !field)) {
      return res.status(400).json({ success: false, error: "Please provide all fields" });
    }

    // Find and update the manifest
    const manifestId = req.params.id;
    const updatedManifest = await Manifest.findByIdAndUpdate(
      manifestId,
      {
        week,
        email,
        developername,
        advisorname,
        reviewername,
        color,
        nextweektask,
        improvementupdate,
        code,
        theory,
      },
      { new: true }
    );

    if (!updatedManifest) {
      return res.status(404).json({ success: false, error: "Manifest not found" });
    }

    res.json({ success: true, manifest: updatedManifest });
  } catch (error) {
    console.error('Error updating manifest:', error);
    res.status(500).json({ success: false, error: "Failed to update manifest" });
  }
};
