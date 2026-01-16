// 전역 변수
let currentStep = 1;
let uploadedFile = null;

// DOM이 로드되면 실행
document.addEventListener('DOMContentLoaded', function() {
    // 파일 업로드 이벤트 리스너
    setupFileUpload();
    
    // 페이지 로드 시 첫 번째 단계 활성화
    goToStep(1);
});

// 단계 이동 함수
function goToStep(stepNumber) {
    // 현재 활성화된 단계 비활성화
    document.querySelector(`.step-content.active`).classList.remove('active');
    document.querySelector(`.step[data-step="${currentStep}"]`).classList.remove('active');
    
    // 새로운 단계 활성화
    document.getElementById(`step-${stepNumber}`).classList.add('active');
    document.querySelector(`.step[data-step="${stepNumber}"]`).classList.add('active');
    
    // Step 4(분석)로 이동할 때 AI 분석 시뮬레이션 시작
    if (stepNumber === 4 && uploadedFile) {
        simulateAnalysis();
    }
    
    // Step 5로 이동할 때 결과 표시
    if (stepNumber === 5) {
        displayFinalResults();
    }
    
    currentStep = stepNumber;
    scrollToTop();
}

// 파일 업로드 설정
function setupFileUpload() {
    const uploadArea = document.getElementById('uploadArea');
    const fileInput = document.getElementById('audioFile');
    const fileInfo = document.getElementById('fileInfo');
    const analyzeBtn = document.getElementById('analyzeBtn');
    
    // 파일 선택 시
    fileInput.addEventListener('change', function(e) {
        if (e.target.files.length > 0) {
            handleFileSelection(e.target.files[0]);
        }
    });
    
    // 드래그 앤 드롭
    uploadArea.addEventListener('dragover', function(e) {
        e.preventDefault();
        uploadArea.classList.add('dragover');
    });
    
    uploadArea.addEventListener('dragleave', function() {
        uploadArea.classList.remove('dragover');
    });
    
    uploadArea.addEventListener('drop', function(e) {
        e.preventDefault();
        uploadArea.classList.remove('dragover');
        
        if (e.dataTransfer.files.length > 0) {
            handleFileSelection(e.dataTransfer.files[0]);
        }
    });
    
    // 파일 선택 처리 함수
    function handleFileSelection(file) {
        // 파일 유효성 검사
        const validTypes = ['audio/mpeg', 'audio/wav', 'audio/x-m4a'];
        const maxSize = 50 * 1024 * 1024; // 50MB
        
        if (!validTypes.includes(file.type)) {
            alert('지원되지 않는 파일 형식입니다. MP3, WAV, M4A 파일만 업로드 가능합니다.');
            return;
        }
        
        if (file.size > maxSize) {
            alert('파일 크기가 너무 큽니다. 최대 50MB까지 업로드 가능합니다.');
            return;
        }
        
        uploadedFile = file;
        
        // 파일 정보 표시
        const fileSizeMB = (file.size / (1024 * 1024)).toFixed(2);
        fileInfo.innerHTML = `
            <div style="display: flex; align-items: center; gap: 15px;">
                <i class="fas fa-file-audio" style="font-size: 2rem; color: #2c8cff;"></i>
                <div style="text-align: left;">
                    <strong style="display: block; margin-bottom: 5px;">${file.name}</strong>
                    <div style="font-size: 0.9rem; color: #666;">
                        <span>${fileSizeMB} MB</span> • 
                        <span>${file.type.split('/')[1].toUpperCase()}</span>
                    </div>
                </div>
                <button onclick="removeFile()" style="margin-left: auto; background: none; border: none; color: #ff6b6b; cursor: pointer; font-size: 1.2rem;">
                    <i class="fas fa-times"></i>
                </button>
            </div>
        `;
        fileInfo.classList.add('show');
        
        // 분석 버튼 활성화
        analyzeBtn.disabled = false;
    }
}

// 파일 제거 함수
function removeFile() {
    uploadedFile = null;
    document.getElementById('audioFile').value = '';
    document.getElementById('fileInfo').classList.remove('show');
    document.getElementById('analyzeBtn').disabled = true;
}

// AI 분석 시뮬레이션
function simulateAnalysis() {
    const analysisProgress = document.getElementById('analysisProgress');
    const analysisResult = document.getElementById('analysisResult');
    const progressFill = document.getElementById('progressFill');
    const nextToStep5 = document.getElementById('nextToStep5');
    
    // 진행 상태 업데이트 함수들
    const statElements = {
        pronunciation: document.getElementById('pronunciationStat'),
        fluency: document.getElementById('fluencyStat'),
        vocabulary: document.getElementById('vocabularyStat'),
        grammar: document.getElementById('grammarStat')
    };
    
    // 분석 시작 (3초 동안 진행)
    let progress = 0;
    const interval = setInterval(() => {
        progress += 1;
        progressFill.style.width = `${progress}%`;
        
        // 각 분석 항목별 진행률 업데이트 (다른 속도로)
        if (progress <= 25) {
            statElements.pronunciation.textContent = `${progress * 4}%`;
        } else if (progress <= 50) {
            statElements.fluency.textContent = `${(progress - 25) * 4}%`;
        } else if (progress <= 75) {
            statElements.vocabulary.textContent = `${(progress - 50) * 4}%`;
        } else {
            statElements.grammar.textContent = `${(progress - 75) * 4}%`;
        }
        
        // 완료 시
        if (progress >= 100) {
            clearInterval(interval);
            
            // 약간의 지연 후 결과 표시
            setTimeout(() => {
                analysisProgress.style.display = 'none';
                analysisResult.style.display = 'block';
                nextToStep5.style.display = 'inline-flex';
                
                // 랜덤 결과 생성 (실제 구현에서는 서버 응답을 사용)
                generateRandomResults();
            }, 500);
        }
    }, 30);
}

// 랜덤 결과 생성 (데모용)
function generateRandomResults() {
    // ED 레벨 후보들
    const edLevels = [
        { name: "Pre-Basic", desc: "입문자", cefr: "A1", toeic: "10-119", ielts: "1.0-1.5" },
        { name: "Basic 3", desc: "초급", cefr: "A1", toeic: "120-224", ielts: "2.0-2.5" },
        { name: "Basic 2", desc: "초중급", cefr: "A2", toeic: "225-549", ielts: "3.0-3.5" },
        { name: "Basic 1", desc: "초중급", cefr: "A2", toeic: "225-549", ielts: "3.0-3.5" },
        { name: "Intermediate 1", desc: "중급", cefr: "B1", toeic: "550-650", ielts: "4.0-4.5" },
        { name: "Intermediate 2", desc: "중급", cefr: "B1", toeic: "650-720", ielts: "4.5-5.0" },
        { name: "Intermediate 3", desc: "중급", cefr: "B1", toeic: "720-784", ielts: "5.0-5.5" },
        { name: "Advanced 1", desc: "중상급", cefr: "B2", toeic: "785-850", ielts: "5.5-6.0" },
        { name: "Advanced 2", desc: "고급", cefr: "C1", toeic: "945-990", ielts: "7.0-7.5" },
        { name: "Advanced 3", desc: "고급", cefr: "C1", toeic: "945-990", ielts: "7.5-8.0" }
    ];
    
    // 랜덤 결과 선택 (중간 레벨에 가중치 부여)
    const weights = [1, 2, 3, 4, 6, 7, 6, 4, 2, 1]; // 중간 레벨에 더 높은 확률
    const totalWeight = weights.reduce((a, b) => a + b, 0);
    let random = Math.random() * totalWeight;
    
    let selectedIndex = 0;
    for (let i = 0; i < weights.length; i++) {
        random -= weights[i];
        if (random <= 0) {
            selectedIndex = i;
            break;
        }
    }
    
    const result = edLevels[selectedIndex];
    
    // 결과 표시
    document.getElementById('edLevelBadge').innerHTML = `
        <span class="level-name">${result.name}</span>
        <span class="level-desc">${result.desc}</span>
    `;
    
    document.getElementById('cefrLevel').textContent = result.cefr;
    document.getElementById('cefrLevel').className = `result-value cefr-${result.cefr.toLowerCase()}`;
    document.getElementById('toeicScore').textContent = result.toeic;
    document.getElementById('ieltsScore').textContent = result.ielts;
    
    // Step 5에서 사용할 추천 코스 설정
    let recommendedCourse = "";
    if (result.name.includes("Basic")) {
        recommendedCourse = "Basic Course";
    } else if (result.name.includes("Intermediate")) {
        recommendedCourse = "Intermediate Course";
    } else {
        recommendedCourse = "Advanced Course";
    }
    
    // 로컬 스토리지에 결과 저장 (Step 5에서 사용)
    localStorage.setItem('edDiagnosisResult', JSON.stringify({
        edLevel: result.name,
        recommendedCourse: recommendedCourse
    }));
}

// Step 5에서 최종 결과 표시
function displayFinalResults() {
    const storedResult = localStorage.getItem('edDiagnosisResult');
    
    if (storedResult) {
        const result = JSON.parse(storedResult);
        const courseBadge = document.getElementById('recommendedCourse');
        
        // 추천 코스 업데이트
        if (result.edLevel.includes("Basic")) {
            courseBadge.innerHTML = `
                <span class="course-name">Basic Course</span>
                <span class="course-duration">10주 과정</span>
            `;
        } else if (result.edLevel.includes("Intermediate")) {
            courseBadge.innerHTML = `
                <span class="course-name">Intermediate Course</span>
                <span class="course-duration">12주 과정</span>
            `;
        } else {
            courseBadge.innerHTML = `
                <span class="course-name">Advanced Course</span>
                <span class="course-duration">16주 과정</span>
            `;
        }
    }
}

// 호환성 차트 아코디언 토글
function toggleAccordion() {
    const content = document.getElementById('accordionContent');
    const icon = document.getElementById('accordionIcon');
    
    content.classList.toggle('expanded');
    icon.textContent = content.classList.contains('expanded') ? '−' : '+';
}

// 진단 다시 시작
function restartDiagnosis() {
    // 모든 상태 초기화
    currentStep = 1;
    uploadedFile = null;
    
    // 파일 업로드 초기화
    document.getElementById('audioFile').value = '';
    document.getElementById('fileInfo').classList.remove('show');
    document.getElementById('analyzeBtn').disabled = true;
    
    // 분석 결과 초기화
    document.getElementById('analysisProgress').style.display = 'block';
    document.getElementById('analysisResult').style.display = 'none';
    document.getElementById('nextToStep5').style.display = 'none';
    document.getElementById('progressFill').style.width = '0%';
    
    // 첫 번째 단계로 이동
    goToStep(1);
}

// 페이지 상단으로 스크롤
function scrollToTop() {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
}
