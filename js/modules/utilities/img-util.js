import { Promise } from 'es6-promise';
import { ZERO, ONE, INDEXOF_FAIL_CODE } from 'js/constants/common';
import { noop } from './util';
import isFunction from 'lodash-es/isFunction';
import piexif from 'piexifjs';

/*   1        2       3      4         5            6           7          8
 * 888888  888888      88  88      8888888888  88                  88  8888888888
 * 88          88      88  88      88  88      88  88          88  88      88  88
 * 8888      8888    8888  8888    88          8888888888  8888888888          88
 * 88          88      88  88
 * 88          88  888888  888888
 * source: http://sylvana.net/jpegcrop/exif_orientation.html
 */
// from http://stackoverflow.com/a/32490603
/* eslint-disable */
export const getImgExifOrien = (file, cb) => {
	const callback = isFunction(cb) ? cb : noop;
	const reader = new FileReader();

	reader.onload = (event) => {
		var view = new DataView(event.target.result);

		if (view.getUint16(0, false) != 0xFFD8) {
			return callback(-2);
		}

		let offset = 2;

		while (offset < view.byteLength) {
			const marker = view.getUint16(offset, false);
			offset += 2;

			try {
				if (marker == 0xFFE1) {
					if (view.getUint32(offset += 2, false) != 0x45786966) {
						return callback(-1);
					}
					const little = view.getUint16(offset += 6, false) == 0x4949;
					offset += view.getUint32(offset + 4, little);
					const tags = view.getUint16(offset, little);
					offset += 2;

					for (let i = 0; i < tags; i++) {
						if (view.getUint16(offset + (i * 12), little) == 0x0112) {
							return callback(view.getUint16(offset + (i * 12) + 8, little));
						}
					}
				} else if ((marker & 0xFF00) != 0xFF00) {
					break;
				} else {
					offset += view.getUint16(offset, false);
				}
			} catch {
				return callback(-1);
			}
		}
		return callback(-1);
	};

	reader.readAsArrayBuffer(file.slice(0, 64 * 1024));
};
/* eslint-enable */

/**
 * Получает изображение и значение его ориентации (0-8). Возвращает canvas, повёрнутый согласно значению (в нормальной ориентации)
 *
 * @param {HTMLImageElement} image
 * @param {number} orientation
 * @return {string}
 */
export const getRotatedCanvas = (image, orientation) => {
	const canvas = document.createElement('canvas');
	const context = canvas.getContext('2d');
	const height = image.height;
	const width = image.width;
	/* eslint-disable */
	if (4 < orientation && orientation < 9) {
		canvas.width = height;
		canvas.height = width;
	} else {
		canvas.width = width;
		canvas.height = height;
	}

	switch (orientation) {
		case 2:
			context.transform(-1, 0, 0, 1, width, 0);
			break;
		case 3:
			context.transform(-1, 0, 0, -1, width, height);
			break;
		case 4:
			context.transform(1, 0, 0, -1, 0, height);
			break;
		case 5:
			context.transform(0, 1, 1, 0, 0, 0);
			break;
		case 6:
			context.transform(0, 1, -1, 0, height, 0);
			break;
		case 7:
			context.transform(0, -1, -1, 0, height, width);
			break;
		case 8:
			context.transform(0, -1, 1, 0, 0, width);
			break;
		default:
			break;
	}
	/* eslint-enable */
	context.drawImage(image, ZERO, ZERO);
	return canvas.toDataURL('image/jpeg');
};

/**
 * Функция создаёт Blob из изображения, кодированного в base64
 *
 * @param {string} dataURI
 * @return {Blob}
 */
export const dataURItoBlob = dataURI => {
	const byteString = atob(dataURI.split(',')[ONE]);
	const mimeString = dataURI.split(',')[ZERO].split(':')[ONE].split(';')[ZERO];
	const arrayBuffer = new ArrayBuffer(byteString.length);
	const uint8Array = new Uint8Array(arrayBuffer);
	for (let i = 0; i < byteString.length; i++) {
		uint8Array[i] = byteString.charCodeAt(i);
	}
	const blob = new Blob([arrayBuffer], { type: mimeString });
	return blob;
};

export const getImageAngleByOrientation = orient => {
	const ANGLE = {
		right: 90,
		straight: 180,
		obtuse: 270,
		full: 360,
	};
	let flip = false;
	let angle = ZERO;

	/* eslint-disable no-magic-numbers */
	switch (orient) {
		case 2:
			flip = true;
			break;
		case 3:
			angle = ANGLE.straight;
			break;
		case 4:
			flip = true;
			angle = ANGLE.straight;
			break;
		case 5:
			flip = true;
			angle = ANGLE.obtuse;
			break;
		case 6:
			angle = ANGLE.right;
			break;
		case 7:
			flip = true;
			angle = ANGLE.right;
			break;
		case 8:
			angle = ANGLE.straight;
			break;
		default:
			break;
	}
	return {angle, flip};
};

/**
 * Функция сбрасывает угол поворота в Exif изображения и формирует новое Blob представление изменённого изображения
 * Использует https://github.com/hMatoba/piexifjs
 *
 * @author Vladimir Rybin
 *
 * @param {HTMLCanvasElement} image - Исходное изображение
 * @param {File} file - Загружаемый файл
 * @param {ExifMap} exif - Exif изображения
 * @return {Promise}
 */
export const getRotatedImageBlob = (image, file, exif) => {
	return new Promise(resolve => {
		try {
			const zero = {};
			let exifData = {};
			let gpsData = {};
			// Заполнение будущего exif исходными данными
			for (let elem in exif) {
				if (elem in piexif.TAGS['0th'] && exif.hasOwnProperty(elem)) {
					if (Number(elem) !== piexif.ImageIFD.ExifTag && Number(elem) !== piexif.ImageIFD.GPSTag) {
						zero[elem] = exif[elem];
					} else if (Number(elem) === piexif.ImageIFD.ExifTag) {
						exifData = exif[elem];
					} else if (Number(elem) === piexif.ImageIFD.GPSTag) {
						gpsData = exif[elem];
					}
				}
			}
			// Не меняем ширину и высоту местами, т.к. loadImage сделал это во время обработки. Оставил для ясности
			zero[piexif.ImageIFD.ImageWidth] = image.width;
			zero[piexif.ImageIFD.ImageLength] = image.height;
			zero[piexif.ImageIFD.DateTime] = new Date().toDateString();
			zero[piexif.ImageIFD.Software] = 'Livemaster.ru-Piexifjs';
			zero[piexif.ImageIFD.Orientation] = 1;
			// Распаковка в новые объекты для того, чтобы избавиться от методов, наследуемых от ExifMap
			const exifObj = {
				'0th': {...zero},
				'Exif': {...exifData},
				'GPS': {...gpsData}
			};
			// Обновление exif
			const exifStr = piexif.dump(exifObj);
			const updatedExifBase64 = piexif.insert(exifStr, image.toDataURL(file.type));
			// Конвертация Base64 to Blob
			const byteString = atob(updatedExifBase64.split(',')[ONE]);
			const arrBuff = new ArrayBuffer(byteString.length);
			const arrUint = new Uint8Array(arrBuff);
			for (let i = 0; i < byteString.length; i++) {
				arrUint[i] = byteString.charCodeAt(i);
			}
			resolve(new Blob([arrUint], { type: file.type }));
		} catch (err) {
			// eslint-disable-next-line no-console
			console.error(err);
			// eslint-disable-next-line no-magic-numbers
			resolve(file.slice(0, 64 * 1024));
		}
	});
};

export const getDownloadedImageWithoutRotation = (image, orientation, callback = noop) => {
	const angleData = getImageAngleByOrientation(orientation);
	if ([90, 270].indexOf(angleData.angle) !== INDEXOF_FAIL_CODE) {
		// Создаётся новое изображение со "сброшенным" поворотом для корректного отображения
		// превью до момента получения обработанного фото с файлового сервера
		const blob = dataURItoBlob(getRotatedCanvas(image, orientation));
		if (!blob.size) {
			callback(image);
			return;
		}
		const updatedImage = new Image();
		updatedImage.addEventListener('load', () => callback(updatedImage));
		updatedImage.src = URL.createObjectURL(blob);
	} else {
		callback(image);
	}
};
