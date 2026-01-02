// ========================================
// ページ読み込み時の処理
// ========================================
document.addEventListener('DOMContentLoaded', function() {
    // 診断結果を取得
    const answers = JSON.parse(localStorage.getItem('diagnosisAnswers'));
    
    if (!answers) {
        // 診断結果がない場合は診断ページへ
        alert('診断結果がありません。まず診断を受けてください。');
        window.location.href = 'diagnosis.html';
        return;
    }
    
    // 結果を生成して表示
    generateResult(answers);
});

// ========================================
// 診断結果を生成する関数
// ========================================
function generateResult(answers) {
    // 回答を分析
    const familyType = answers[1]; // 家族構成
    const rooms = answers[2]; // 部屋数
    const budget = answers[3]; // 予算
    const style = answers[4]; // 外観スタイル
    const priorities = answers[5]; // 重視ポイント（配列）
    const facilities = answers[6]; // 希望設備（配列）
    const garden = answers[7]; // 庭・外構
    const lifestyle = answers[8]; // ライフスタイル
    
    // サマリーテキストを生成
    generateSummary(familyType, rooms, budget, style);
    
    // 間取りと特徴を生成
    generateLayout(rooms, priorities, facilities, lifestyle);
    
    // 予算と坪数を生成
    generateBudget(budget, rooms, familyType);
    
    // ハウスメーカーを生成
    generateHousemakers(style, budget, priorities);
}

// ========================================
// サマリーを生成
// ========================================
function generateSummary(family, rooms, budget, style) {
    const summaryDiv = document.getElementById('summaryText');
    
    let familyText = '';
    if (family === '単身') {
        familyText = '一人暮らしに最適な、効率的でスタイリッシュな空間';
    } else if (family === '夫婦2人') {
        familyText = '夫婦二人でゆったり暮らせる、落ち着いた空間';
    } else if (family.includes('子供')) {
        familyText = '家族が快適に暮らせる、機能的で温かみのある空間';
    } else {
        familyText = '複数世代が快適に暮らせる、ゆとりある空間';
    }
    
    summaryDiv.innerHTML = `
        <p><strong>家族構成：</strong>${family}</p>
        <p><strong>希望間取り：</strong>${rooms}</p>
        <p><strong>予算感：</strong>${budget}</p>
        <p><strong>外観スタイル：</strong>${style}</p>
        <p style="margin-top: 20px; padding: 15px; background-color: var(--light-color); border-radius: 8px;">
            ${familyText}で、${style}テイストを基調とした住まいがおすすめです。
        </p>
    `;
}

// ========================================
// 間取りと特徴を生成
// ========================================
function generateLayout(rooms, priorities, facilities, lifestyle) {
    const layoutDiv = document.getElementById('layoutText');
    
    // 基本的な間取り提案
    let layoutSuggestion = '';
    if (rooms === '1LDK' || rooms === '2LDK') {
        layoutSuggestion = 'コンパクトで効率的な動線を重視した間取り';
    } else if (rooms === '3LDK') {
        layoutSuggestion = '家族のプライバシーと共有スペースのバランスが取れた間取り';
    } else {
        layoutSuggestion = 'ゆとりある空間配置で、各部屋に十分な広さを確保した間取り';
    }
    
    // ライフスタイル別の提案
    let lifestyleSuggestion = '';
    if (lifestyle === '在宅ワーク重視') {
        lifestyleSuggestion = '独立した書斎スペースや、集中できるワークエリアを設けることをおすすめします。';
    } else if (lifestyle === '家族団らん重視') {
        lifestyleSuggestion = '広々としたLDKで、家族が自然と集まる開放的な空間がおすすめです。';
    } else if (lifestyle === '趣味の空間重視') {
        lifestyleSuggestion = '趣味に没頭できる専用スペースや、収納豊富な多目的ルームを設けると良いでしょう。';
    } else {
        lifestyleSuggestion = '各個室にゆとりを持たせ、プライベート空間を大切にした設計がおすすめです。';
    }
    
    // 優先設備
    let facilitiesList = '';
    if (facilities && facilities.length > 0) {
        facilitiesList = '<ul>';
        facilities.forEach(facility => {
            facilitiesList += `<li>${facility}</li>`;
        });
        facilitiesList += '</ul>';
    }
    
    layoutDiv.innerHTML = `
        <p><strong>おすすめの間取りコンセプト：</strong></p>
        <p>${layoutSuggestion}</p>
        <p style="margin-top: 15px;"><strong>ライフスタイルに合わせた提案：</strong></p>
        <p>${lifestyleSuggestion}</p>
        ${facilitiesList ? '<p style="margin-top: 15px;"><strong>ご希望の設備：</strong></p>' + facilitiesList : ''}
    `;
}

// ========================================
// 予算と坪数を生成
// ========================================
function generateBudget(budget, rooms, family) {
    const budgetDiv = document.getElementById('budgetText');
    
    // 坪数の目安
    let tsuboSuggestion = '';
    if (rooms === '1LDK') {
        tsuboSuggestion = '20〜25坪';
    } else if (rooms === '2LDK') {
        tsuboSuggestion = '25〜30坪';
    } else if (rooms === '3LDK') {
        tsuboSuggestion = '30〜35坪';
    } else if (rooms === '4LDK') {
        tsuboSuggestion = '35〜40坪';
    } else {
        tsuboSuggestion = '40坪以上';
    }
    
    budgetDiv.innerHTML = `
        <p><strong>ご予算：</strong>${budget}</p>
        <p><strong>推奨坪数：</strong>${tsuboSuggestion}</p>
        <p style="margin-top: 20px; padding: 15px; background-color: #FFF9E6; border-left: 4px solid var(--accent-color); border-radius: 5px;">
            💡 <strong>アドバイス：</strong><br>
            建物本体価格に加えて、外構工事、地盤改良、諸経費なども考慮し、
            総予算の70〜80%程度を建物本体に充てるのが一般的です。
        </p>
    `;
}

// ========================================
// ハウスメーカーを生成
// ========================================
function generateHousemakers(style, budget, priorities) {
    const housemakerDiv = document.getElementById('housemakerList');
    
    // スタイルと予算に基づいてハウスメーカーを選定（仮データ）
    const housemakers = getRecommendedHousemakers(style, budget, priorities);
    
    let html = '';
    housemakers.forEach(maker => {
        html += `
            <div class="housemaker-card">
                <h4>${maker.name}</h4>
                <p>${maker.description}</p>
                <div class="housemaker-features">
                    ${maker.features.map(f => `<span class="feature-tag">${f}</span>`).join('')}
                </div>
            </div>
        `;
    });
    
    housemakerDiv.innerHTML = html;
}

// ========================================
// おすすめハウスメーカーを取得（仮データ）
// ========================================
function getRecommendedHousemakers(style, budget, priorities) {
    // 実際にはAIやデータベースから取得する想定
    // ここでは仮のデータを返す
    
    const allMakers = [
        {
            name: '積水ハウス',
            description: '業界トップクラスの実績と技術力。耐震性能と自由設計が強み。',
            features: ['高耐震', '自由設計', '充実保証'],
            styles: ['モダン', 'シンプル'],
            budgetRange: ['3500-5000万円', '5000万円以上']
        },
        {
            name: '住友林業',
            description: '木造建築の専門家。自然素材を活かした温かみのある住まい。',
            features: ['木造', 'ナチュラル', '高断熱'],
            styles: ['ナチュラル', '和モダン', '北欧風'],
            budgetRange: ['2500-3500万円', '3500-5000万円']
        },
        {
            name: 'タマホーム',
            description: 'コストパフォーマンスに優れた高品質住宅。適正価格での家づくりを実現。',
            features: ['適正価格', '高品質', '短工期'],
            styles: ['シンプル', 'モダン'],
            budgetRange: ['1500万円以下', '1500-2500万円', '2500-3500万円']
        },
        {
            name: 'ヘーベルハウス',
            description: '独自のALC構造で高い耐久性。都市型住宅に強み。',
            features: ['高耐久', '防災', '都市型'],
            styles: ['モダン', 'シンプル'],
            budgetRange: ['3500-5000万円', '5000万円以上']
        },
        {
            name: 'セキスイハイム',
            description: '工場生産による高品質と快適性能。スマートハウスに強み。',
            features: ['高品質', '高気密高断熱', 'スマートハウス'],
            styles: ['モダン', 'シンプル'],
            budgetRange: ['2500-3500万円', '3500-5000万円']
        }
    ];
    
    // スタイルと予算に合うメーカーをフィルタリング
    let recommended = allMakers.filter(maker => {
        const styleMatch = maker.styles.includes(style);
        const budgetMatch = maker.budgetRange.includes(budget);
        return styleMatch || budgetMatch;
    });
    
    // 3社に絞る
    if (recommended.length > 3) {
        recommended = recommended.slice(0, 3);
    } else if (recommended.length === 0) {
        // マッチしない場合は上位3社を返す
        recommended = allMakers.slice(0, 3);
    }
    
    return recommended;
}