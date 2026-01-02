// Hugging Face APIを使って画像を生成するサーバーレス関数

export default async function handler(req, res) {
  // デバッグ用ログ
  console.log('Environment variables check:');
  console.log('HUGGINGFACE_API_KEY exists:', !!process.env.HUGGINGFACE_API_KEY);
  console.log('All env keys:', Object.keys(process.env));
  // CORSヘッダーを設定（フロントエンドからのアクセスを許可）
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  // OPTIONSリクエスト（プリフライト）への対応
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  // POSTリクエストのみ受け付ける
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { prompt } = req.body;

    if (!prompt) {
      return res.status(400).json({ error: 'Prompt is required' });
    }

    // Hugging Face APIキーを環境変数から取得
    const API_KEY = process.env.HUGGINGFACE_API_KEY;

    if (!API_KEY) {
      return res.status(500).json({ error: 'API key not configured' });
    }

    // Hugging Face Inference APIを呼び出し
    // 使用モデル: Stable Diffusion XL
    const response = await fetch(
        'https://router.huggingface.co/models/stabilityai/stable-diffusion-xl-base-1.0',
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          inputs: prompt,
          parameters: {
            num_inference_steps: 30,
            guidance_scale: 7.5,
          }
        }),
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Hugging Face API Error:', errorText);
      
      // モデルがロード中の場合
      if (response.status === 503) {
        return res.status(503).json({ 
          error: 'Model is loading',
          message: 'AIモデルを準備中です。20秒ほど待ってから再度お試しください。',
          retry: true
        });
      }
      
      return res.status(response.status).json({ 
        error: 'Failed to generate image',
        details: errorText 
      });
    }

    // 画像データ（バイナリ）を取得
    const imageBuffer = await response.arrayBuffer();
    
    // Base64エンコード
    const base64Image = Buffer.from(imageBuffer).toString('base64');
    const imageUrl = `data:image/png;base64,${base64Image}`;

    // 画像URLを返す
    return res.status(200).json({ 
      imageUrl,
      success: true 
    });

  } catch (error) {
    console.error('Error:', error);
    return res.status(500).json({ 
      error: 'Internal server error',
      message: error.message 
    });
  }
}
