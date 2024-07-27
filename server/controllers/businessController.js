const Business = require('../models/business');
const fs = require('fs');
const path = require('path');

const TEMP_DIR = 'uploads/temp';
const LIVE_DIR = 'uploads/images';

exports.createBusiness = async (req, res) => {
  try {
    const businessData = req.body;
    if (req.body.images) {
      businessData.images = req.body.images.map((image) => {
        const tempPath = path.join(__dirname, '..', TEMP_DIR, image);
        const livePath = path.join(__dirname, '..', LIVE_DIR, image);
        fs.renameSync(tempPath, livePath);
        return image;
      });
    }
    const business = new Business(businessData);
    await business.save();
    res.status(201).send({ isSuccess: true, data: business });
  } catch (error) {
    res.status(400).send(error);
  }
};

exports.getBusinesses = async (req, res) => {
  try {
    const businesses = await Business.find();
    // .populate('owner services');
    res.status(200).send({ isSuccess: true, data: businesses });
  } catch (error) {
    res.status(500).send(error);
  }
};

exports.getBusinessById = async (req, res) => {
  try {
    const business = await Business.findById(req.params.id).populate(
      'owner services'
    );
    if (!business) {
      return res.status(404).send();
    }
    res.status(200).send({ isSuccess: true, data: business });
  } catch (error) {
    res.status(500).send(error);
  }
};

exports.updateBusiness = async (req, res) => {
  try {
    const business = await Business.findById(req.params.id);
    if (!business) {
      return res.status(404).send();
    }

    const originalImages = business.images || [];
    const newImages = req.body.images || [];

    // Find removed images
    const removedImages = originalImages.filter(
      (img) => !newImages.includes(img)
    );

    // Delete removed images from the file system
    removedImages.forEach((img) => {
      const imgPath = path.join(__dirname, '..', LIVE_DIR, img);
      if (fs.existsSync(imgPath)) {
        fs.unlinkSync(imgPath);
      } else {
        console.warn(`File not found: ${imgPath}`);
      }
    });

    // Move new images from temp to live directory
    const updatedImages = newImages.map((img) => {
      if (img.startsWith('temp/')) {
        const tempPath = path.join(__dirname, '..', TEMP_DIR, img.replace('temp/', ''));
        const newPath = path.join(__dirname, '..', LIVE_DIR, img.replace('temp/', ''));
        console.log(`Moving from ${tempPath} to ${newPath}`);
        if (fs.existsSync(tempPath)) {
          fs.renameSync(tempPath, newPath);
          return img.replace('temp/', '');
        } else {
          console.error(`Temp file not found: ${tempPath}`);
        }
      }
      return img;
    });

    // Update business images field
    Object.assign(business, req.body);
    business.images = updatedImages;
    await business.save();

    res.status(200).send({ isSuccess: true, data: business });
  } catch (error) {
    console.error(error);
    res.status(400).send(error);
  }
};

exports.partialUpdateBusiness = async (req, res) => {
  try {
    const business = await Business.findById(req.params.id);
    if (!business) {
      return res.status(404).send();
    }

    const originalImages = business.images || [];
    const newImages = req.body.images || [];

    // Find removed images
    const removedImages = originalImages.filter(
      (img) => !newImages.includes(img)
    );

    // Delete removed images from the file system
    removedImages.forEach((img) => {
      const imgPath = path.join(__dirname, '..', LIVE_DIR, img);
      if (fs.existsSync(imgPath)) {
        fs.unlinkSync(imgPath);
      }
    });

    // Move new images from temp to live directory
    const updatedImages = newImages.map((img) => {
      if (img.startsWith('temp/')) {
        const tempPath = path.join(__dirname, '..', TEMP_DIR, img);
        const newPath = path.join(
          __dirname,
          '..',
          LIVE_DIR,
          img.replace('temp/', '')
        );
        fs.renameSync(tempPath, newPath);
        return img.replace('temp/', '');
      }
      return img;
    });

    // Update business images field
    business.images = updatedImages;
    Object.assign(business, req.body);
    await business.save();

    res.status(200).send({ isSuccess: true, data: business });
  } catch (error) {
    res.status(400).send(error);
  }
};

exports.deleteBusiness = async (req, res) => {
  try {
    const business = await Business.findByIdAndDelete(req.params.id);
    if (!business) {
      return res.status(404).send();
    }
    res.status(204);
  } catch (error) {
    res.status(500).send(error);
  }
};
