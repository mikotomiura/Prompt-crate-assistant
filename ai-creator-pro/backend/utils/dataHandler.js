const fs = require('fs');
const path = require('path');

const historyFilePath = path.join(__dirname, '../data/history.json');

// 履歴データを読み込む関数
const readHistory = () => {
  try {
    const data = fs.readFileSync(historyFilePath, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    if (error.code === 'ENOENT') {
      // ファイルが存在しない場合は空の配列を返す
      return [];
    }
    console.error('履歴ファイルの読み込みエラー:', error);
    return [];
  }
};

// 履歴データを書き込む関数
const writeHistory = (history) => {
  try {
    fs.writeFileSync(historyFilePath, JSON.stringify(history, null, 2), 'utf8');
  } catch (error) {
    console.error('履歴ファイルの書き込みエラー:', error);
  }
};

module.exports = {
  readHistory,
  writeHistory
};