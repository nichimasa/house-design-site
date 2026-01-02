// ========================================
// 診断データ
// ========================================
const questions = [
    {
        id: 1,
        question: "家族構成を教えてください",
        type: "single", // 単一選択
        options: ["単身", "夫婦2人", "夫婦+子供1人", "夫婦+子供2人以上", "二世帯住宅"]
    },
    {
        id: 2,
        question: "希望する部屋数は？",
        type: "single",
        options: ["1LDK", "2LDK", "3LDK", "4LDK", "5LDK以上"]
    },
    {
        id: 3,
        question: "建築予算の目安を教えてください",
        type: "single",
        options: ["1500万円以下", "1500-2500万円", "2500-3500万円", "3500-5000万円", "5000万円以上"]
    },
    {
        id: 4,
        question: "好みの外観スタイルは？",
        type: "single",
        options: ["モダン", "和モダン", "北欧風", "南欧風", "シンプル", "ナチュラル"]
    },
    {
        id: 5,
        question: "重視するポイントを選んでください（複数選択可）",
        type: "multiple", // 複数選択
        options: ["耐震性", "断熱性", "デザイン性", "収納力", "動線", "日当たり"]
    },
    {
        id: 6,
        question: "希望する設備を選んでください（複数選択可）",
        type: "multiple",
        options: ["対面キッチン", "ウォークインクローゼット", "書斎", "パントリー", "吹き抜け", "ロフト"]
    },
    {
        id: 7,
        question: "庭・外構の希望は？",
        type: "single",
        options: ["広い庭が欲しい", "最小限でOK", "ウッドデッキが欲しい", "駐車場重視", "こだわらない"]
    },
    {
        id: 8,
        question: "ライフスタイルで当てはまるものは？",
        type: "single",
        options: ["在宅ワーク重視", "家族団らん重視", "趣味の空間重視", "プライバシー重視"]
    }
];

// ========================================
// 変数の初期化
// ========================================
let currentQuestion = 0;
let answers = {};

// ========================================
// ページ読み込み時の処理
// ========================================
document.addEventListener('DOMContentLoaded', function() {
    displayQuestion();
    updateProgress();
    
    // ボタンのイベントリスナー
    document.getElementById('nextBtn').addEventListener('click', nextQuestion);
    document.getElementById('prevBtn').addEventListener('click', prevQuestion);
});

// ========================================
// 質問を表示する関数
// ========================================
function displayQuestion() {
    const question = questions[currentQuestion];
    const questionTitle = document.getElementById('questionTitle');
    const optionsContainer = document.getElementById('optionsContainer');
    
    // 質問文を表示
    questionTitle.textContent = question.question;
    
    // 選択肢をクリア
    optionsContainer.innerHTML = '';
    
    // 選択肢を生成
    if (question.type === 'single') {
        // 単一選択
        question.options.forEach((option, index) => {
            const button = document.createElement('button');
            button.className = 'option-btn';
            button.textContent = option;
            button.onclick = () => selectOption(index, option);
            
            // 既に選択済みの場合はハイライト
            if (answers[question.id] === option) {
                button.classList.add('selected');
            }
            
            optionsContainer.appendChild(button);
        });
    } else {
        // 複数選択
        question.options.forEach((option, index) => {
            const label = document.createElement('label');
            label.className = 'option-checkbox';
            
            const checkbox = document.createElement('input');
            checkbox.type = 'checkbox';
            checkbox.value = option;
            checkbox.onchange = () => selectMultipleOptions();
            
            // 既に選択済みの場合はチェック
            if (answers[question.id] && answers[question.id].includes(option)) {
                checkbox.checked = true;
                label.classList.add('checked');
            }
            
            checkbox.addEventListener('change', function() {
                if (this.checked) {
                    label.classList.add('checked');
                } else {
                    label.classList.remove('checked');
                }
            });
            
            const text = document.createElement('span');
            text.textContent = option;
            
            label.appendChild(checkbox);
            label.appendChild(text);
            optionsContainer.appendChild(label);
        });
    }
    
    // ボタンの状態を更新
    updateButtons();
}

// ========================================
// 単一選択の処理
// ========================================
function selectOption(index, option) {
    const question = questions[currentQuestion];
    answers[question.id] = option;
    
    // 全ての選択肢から選択状態を解除
    const buttons = document.querySelectorAll('.option-btn');
    buttons.forEach(btn => btn.classList.remove('selected'));
    
    // クリックされた選択肢を選択状態に
    buttons[index].classList.add('selected');
    
    // 次へボタンを有効化
    document.getElementById('nextBtn').disabled = false;
}

// ========================================
// 複数選択の処理
// ========================================
function selectMultipleOptions() {
    const question = questions[currentQuestion];
    const checkboxes = document.querySelectorAll('.option-checkbox input[type="checkbox"]');
    const selectedOptions = [];
    
    checkboxes.forEach(checkbox => {
        if (checkbox.checked) {
            selectedOptions.push(checkbox.value);
        }
    });
    
    answers[question.id] = selectedOptions;
    
    // 1つ以上選択されていれば次へボタンを有効化
    document.getElementById('nextBtn').disabled = selectedOptions.length === 0;
}

// ========================================
// 次の質問へ
// ========================================
function nextQuestion() {
    if (currentQuestion < questions.length - 1) {
        currentQuestion++;
        displayQuestion();
        updateProgress();
    } else {
        // 最後の質問なら結果ページへ
        saveAnswersAndRedirect();
    }
}

// ========================================
// 前の質問へ
// ========================================
function prevQuestion() {
    if (currentQuestion > 0) {
        currentQuestion--;
        displayQuestion();
        updateProgress();
    }
}

// ========================================
// プログレスバーを更新
// ========================================
function updateProgress() {
    const progress = ((currentQuestion + 1) / questions.length) * 100;
    document.getElementById('progressFill').style.width = progress + '%';
    document.getElementById('progressText').textContent = `質問 ${currentQuestion + 1} / ${questions.length}`;
}

// ========================================
// ボタンの表示/非表示を更新
// ========================================
function updateButtons() {
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    const question = questions[currentQuestion];
    
    // 戻るボタン
    if (currentQuestion === 0) {
        prevBtn.style.display = 'none';
    } else {
        prevBtn.style.display = 'block';
    }
    
    // 次へボタンのテキスト
    if (currentQuestion === questions.length - 1) {
        nextBtn.textContent = '診断結果を見る';
    } else {
        nextBtn.textContent = '次へ';
    }
    
    // 次へボタンの有効/無効
    if (answers[question.id]) {
        if (question.type === 'multiple') {
            nextBtn.disabled = answers[question.id].length === 0;
        } else {
            nextBtn.disabled = false;
        }
    } else {
        nextBtn.disabled = true;
    }
}

// ========================================
// 回答を保存して結果ページへ
// ========================================
function saveAnswersAndRedirect() {
    // 回答をローカルストレージに保存
    localStorage.setItem('diagnosisAnswers', JSON.stringify(answers));
    
    // 結果ページへ遷移
    window.location.href = 'result.html';
}