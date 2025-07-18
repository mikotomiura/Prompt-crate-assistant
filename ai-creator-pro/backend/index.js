require('dotenv').config();

const express = require('express');
const cors = require('cors');
const { readHistory, writeHistory } = require('./utils/dataHandler'); // 新しく追加
const { v4: uuidv4 } = require('uuid'); // ID生成のために追加 (npm install uuid)

const app = express();
const port = process.env.PORT || 5000;

// ミドルウェア
app.use(cors());
app.use(express.json());

// ルートエンドポイント
app.get('/', (req, res) => {
  res.send('AI-Creator Pro Backend is running!');
});

// プロンプト生成APIエンドポイント (変更なし)
app.post('/api/generate-prompt', (req, res) => {
  const { appPurpose, userLevel } = req.body;

  let generatedPrompt = '';

  if (userLevel === '初心者') {
    generatedPrompt = `シンプルな「ToDoアプリ」を作成するための、Reactコンポーネントの基本構造を教えてください。機能は「タスクの追加」「タスクの完了マーク」「タスクの削除」のみです。`;
  } else if (userLevel === '中級者') {
    generatedPrompt = `ユーザー認証（サインアップ、ログイン）機能を備えた「SNSアプリ」のバックエンド（Node.js/Express）の設計を提案してください。データベースはMongoDBを使用します。`;
  } else if (userLevel === '上級者') {
    generatedPrompt = `リアルタイム通信（WebSocket）を使用したマルチプレイヤーオンラインゲームのアーキテクチャ設計について、スケーラビリティとパフォーマンスを考慮した詳細な提案をお願いします。`;
  } else {
    generatedPrompt = `「${appPurpose}」のための基本的なプロンプトを生成してください。`;
  }

  console.log(`Received request: appPurpose=${appPurpose}, userLevel=${userLevel}`);
  console.log(`Generated prompt: ${generatedPrompt}`);

  res.json({
    success: true,
    prompt: generatedPrompt,
    timestamp: new Date().toISOString()
  });
});

// 履歴を保存するAPIエンドポイント (変更なし)
app.post('/api/history', (req, res) => {
  const { appPurpose, userLevel, generatedPrompt, generatedCode, notes } = req.body;
  const history = readHistory();
  const newItem = {
    id: uuidv4(),
    appPurpose,
    userLevel,
    generatedPrompt,
    generatedCode: generatedCode || '',
    notes: notes || '',
    createdAt: new Date().toISOString(),
    feedback: null // ここで feedback フィールドを追加
  };
  history.unshift(newItem);
  writeHistory(history);
  res.status(201).json({ success: true, message: '履歴が保存されました', item: newItem });
});

// 全ての履歴を取得するAPIエンドポイント (変更なし)
app.get('/api/history', (req, res) => {
  const history = readHistory();
  res.json({ success: true, history });
});

// --- 新しいAPIエンドポイント: フィードバックを保存/更新 ---
app.post('/api/history/:id/feedback', (req, res) => {
  const itemId = req.params.id;
  const { rating, comment } = req.body; // 評価とコメントを受け取る
  const history = readHistory();

  const itemIndex = history.findIndex(item => item.id === itemId);

  if (itemIndex === -1) {
    return res.status(404).json({ success: false, message: '履歴アイテムが見つかりません。' });
  }

  // 履歴アイテムの feedback を更新
  history[itemIndex].feedback = {
    rating: rating,
    comment: comment || '',
    submittedAt: new Date().toISOString()
  };

  writeHistory(history);
  res.json({ success: true, message: 'フィードバックが保存されました', item: history[itemIndex] });
});

// サーバーの起動
app.listen(port, () => {
  console.log(`Backend server listening at http://localhost:${port}`);
});