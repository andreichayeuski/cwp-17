const express = require('express');
const multer  = require('multer');
const sharp = require('sharp');
const uuid = require('uuid/v4');
const path = require('path');
const Promise = require('bluebird');
const app = express();
app.use('/uploads', express.static('uploads'));

const upload = multer({
	storage: multer.diskStorage({
		destination: './uploads/',
		filename: (req, file, cb) => {
			cb(null, file.originalname);
		}
	})
});


app.get('/upload', upload.single('file'), (req, res) => {
	res.sendFile('form.html', {root: './public/'});
});

app.post('/upload', upload.single('file'), (req, res) => {
	res.json({succeed: true});
});


//pdf
const pdfUpload = multer({
	storage: multer.diskStorage({
		destination: './uploads/pdf/',
		filename: (req, file, cb) => {
			cb(null, `${uuid()}${file.ext = path.extname(file.originalname)}`);
		}
	}),
	fileFilter: function fileFilter(req, file, cb) {
		file.mimetype.split('/')[1] === 'pdf' ? cb(null, true) : cb(null, false);
	}
});

app.get('/pdf', upload.single('file'), (req, res) => {
	res.sendFile('pdf.html', {root: './public/'});
});

app.post('/pdf', pdfUpload.array('files', 3), (req, res) => {
	if (req.files.length < 1 || req.files.map((elem) => elem.ext !== '.pdf').indexOf(true) > -1) {
		console.log(req);
		res.json({
			error: 501,
			message: 'file upload error or wrong extension'
		});
	}
	else {
		console.log(req);
		res.json({
			files: req.files.map((file) => file = file.filename)
		});
	}
});

//images
const imageUpload = multer({
	storage: multer.diskStorage({
		destination: './uploads/images/',
		filename: (req, file, cb) => {
			cb(null, `${uuid()}-master${file.ext = path.extname(file.originalname)}`);
		}
	}),
	fileFilter: function fileFilter(req, file, cb) {
		file.mimetype.split('/')[0] === 'image' ? cb(null, true) : cb(null, false);
	}
});

app.get('/images', (req, res) => {
	res.sendFile('image.html', {root: './public/'});
});

app.post('/images', imageUpload.single('image'), async (req, res) => {
	console.log(req);
	let ext = ['.jpg', '.png'];
	if (req.file === undefined)
	{
		res.json({error: 500, message: 'file upload error'});
	}
	else if (ext.indexOf(req.file.ext) < 0)
	{
		res.json({error: 501, message: 'wrong extension'});
	}
	else
	{
		let name = req.file.filename;
		let filenames = [ `${name}master${ext}`, `${name}preview${ext}`, `${name}thumbnail${ext}` ];
		Promise.all([
			sharp(`./uploads/images/${req.file.filename}`).resize(800, 600).toFile(`./uploads/images/${filenames[1]}`),
			sharp(`./uploads/images/${req.file.filename}`).resize(300, 180).toFile(`./uploads/images/${filenames[2]}`)
		]).then(() => {
			res.json(filenames);
		}).catch((err) => {
			res.json(err);
		});
	}
});

app.listen(3000, '127.0.0.1', () => console.log('Start server on port 3000!'));








