const express = require('express');
const multer  = require('multer');
const sharp = require('sharp');
const uuid = require('uuid/v4');
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

const pdfUpload = multer({
	storage: multer.diskStorage({
		destination: './uploads/pdf/',
		filename: (req, file, cb) => {
			let a = file.originalname.split('.');
			cb(null, `${uuid()}.${file.ext = a[a.length - 1]}`);
		}
	}),
	fileFilter: function fileFilter(req, file, cb) {
		file.mimetype.split('/')[1] === 'pdf' ? cb(null, true) : cb(null, false);
	}
});


app.get('/upload', upload.single('file'), (req, res) => {
	res.sendFile('form.html', {root: './public/'});
});

app.post('/upload', upload.single('file'), (req, res) => {
	res.json({succeed: true});
});

app.get('/pdf', upload.single('file'), (req, res) => {
	res.sendFile('pdf.html', {root: './public/'});
});

app.post('/pdf', pdfUpload.array('files', 3), (req, res) => {
	if (req.files.length < 1 || req.files.map((elem) => elem.ext !== 'pdf').indexOf(true) > -1) {
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

app.listen(3000, '127.0.0.1', () => console.log('Start server on port 3000!'));