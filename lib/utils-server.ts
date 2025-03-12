import { headers } from 'next/headers';
import { UAParser } from 'ua-parser-js';
import fs from "fs";
import path from "path";

export const isMobileDevice = async () => {
    if (typeof process === 'undefined') {
        throw new Error('[Server method] you are importing a server-only module outside of server');
    }

    const headersInstance = await headers();
    const ua = headersInstance.get('user-agent');

    const device = new UAParser(ua || '').getDevice();

    const isMobile = device.type === 'mobile';

    return isMobile;
};

export const getPhotosFromDirectory = () => {
  const photosDirectory = path.join(process.cwd(), 'public/images/photos');
  const photoFiles = fs.readdirSync(photosDirectory);
  
  // 画像ファイルのみをフィルタリング
  const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp'];
  const photoFilePaths = photoFiles
    .filter(file => {
      const ext = path.extname(file).toLowerCase();
      return imageExtensions.includes(ext);
    })
    .map(file => `/images/photos/${file}`);
  
  return photoFilePaths;
};

// ランダムに指定された数の写真を選択する関数
export const getRandomPhotos = (count = 10) => {
  const allPhotos = getPhotosFromDirectory();
  
  // 写真が指定数より少ない場合は全て返す
  if (allPhotos.length <= count) {
    return allPhotos;
  }
  
  // Fisher-Yatesアルゴリズムでシャッフル
  const shuffled = [...allPhotos];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  
  // 最初のcount枚を返す
  return shuffled.slice(0, count);
};