// ==========================================
// 1. KHO TIN NHẮN MẪU ĐỂ KIỂM THỬ NHANH
// ==========================================
const samples = {
    1: "[VIETCOMBANK] Tai khoan cua ban dang bi dang nhap la tai thiet bi khac. Neu khong phai ban vui long truy cap vao link http://vietcornbank-login.cc de xac minh danh tinh va bao mat tai khoan ngay lap tuc!",
    2: "Bo Cong An thong bao: Ong/Ba dang lien quan den mot du an ma tuy xuyen quoc gia. Yeu cau cung cap ma OTP va rut het tien gui vao tai khoan an toan cua co quan dieu tra de kiem xat. Neu khong hop tac se bi bat giam sau 2 gio.",
    3: "Chuc mừng thue bao 090xxxxxxx da may man trung thuong 1 chiec xe may SH 150i va 100 trieu dong tien mat tu chuong trinh TRI AN KHACH HANG. Vui long nop truoc 2 trieu dong phi van chuyen vao so tai khoan sau..."
};

function fillSample(id) {
    document.getElementById('message').value = samples[id] || '';
}

document.addEventListener("DOMContentLoaded", renderHistory);

// ==========================================
// CONFIGURATION: Thay đổi địa chỉ này khi deploy lên Render/Cloud
// ==========================================
const BACKEND_URL = 'https://ten-app-cua-ban.onrender.com/api/chat';
// ==========================================
// 2. HÀM XỬ LÝ CHÍNH: PHÂN TÍCH TIN NHẮN
// ==========================================
async function analyzeMessage() {
    const msgInput = document.getElementById('message').value;
    const msg = msgInput ? msgInput.trim() : '';
    const resultDiv = document.getElementById('result');

    // --- TRƯỜNG HỢP BIÊN 1: Người dùng để trống ô nhập ---
    if (!msg) {
        resultDiv.classList.remove('hidden');
        resultDiv.innerHTML = `
            <div class="bg-orange-50 border-2 border-orange-400 text-orange-900 p-4 rounded-xl font-medium w-full">
                ⚠️ Bác ơi, vui lòng dán hoặc nhập nội dung tin nhắn vào ô trống ở trên nhé!
            </div>`;
        return;
    }

    // --- TRƯỜNG HỢP BIÊN 2: Nội dung tin nhắn quá dài ---
    if (msg.length > 5000) {
        resultDiv.classList.remove('hidden');
        resultDiv.innerHTML = `
            <div class="bg-red-50 border-2 border-red-400 text-red-900 p-4 rounded-xl font-medium w-full">
                ⚠️ Tin nhắn quá dài rồi bác ạ (vượt quá 5000 ký tự). Bác vui lòng cắt bớt các đoạn không liên quan đi nhé.
            </div>`;
        return;
    }

    // --- TRƯỜNG HỢP BIÊN 3: Kiểm tra thiết bị có kết nối mạng ---
    if (!navigator.onLine) {
        resultDiv.classList.remove('hidden');
        resultDiv.innerHTML = `
            <div class="bg-red-50 border-2 border-red-400 text-red-900 p-4 rounded-xl font-medium w-full">
                ⚠️ Không có kết nối mạng Internet. Bác vui lòng kiểm tra lại Wifi hoặc mạng 3G/4G của mình nhé!
            </div>`;
        return;
    }

    // Hiển thị trạng thái màn hình chờ xử lý thời gian thực từ API
    resultDiv.classList.remove('hidden');
    resultDiv.innerHTML = `
        <div class="flex flex-col items-center justify-center p-8 bg-slate-50 border border-slate-200 rounded-xl space-y-4 w-full">
            <div class="animate-spin rounded-full h-10 w-10 border-b-2 border-purple-600"></div>
            <div class="text-center space-y-1">
                <p class="text-slate-800 font-bold text-lg animate-pulse">🕵️‍♂️ Thám tử đang bóc tách dấu hiệu kỹ thuật...</p>
                <p class="text-purple-700 font-medium text-base animate-pulse">🧠 Cô tâm lý đang giải mã đòn thao túng cảm xúc...</p>
            </div>
        </div>`;

    try {
        // Gửi nội dung thô lên Python Backend Web Server
        const response = await fetch(BACKEND_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ prompt: msg })
        });

        if (!response.ok) {
            throw new Error(`Máy chủ trả về lỗi trạng thái: ${response.status}`);
        }

        const data = await response.json();

        if (data.error) {
            throw new Error(data.error);
        }

        // Tiến hành xử lý chuỗi văn bản Markdown từ Gemini trả về
        const aiText = data.response || '';
        
        // Tách dòng để tìm kiếm dòng "KẾT LUẬN:" của cô tâm lý
        const lines = aiText.split('\n');
        let finalVerdict = "Không thể trích xuất kết luận chính thức.";
        let analysisBody = aiText;

        // Định vị dòng kết luận đặc tả theo yêu cầu hệ thống
        for (let i = lines.length - 1; i >= 0; i--) {
            if (lines[i].trim().startsWith("KẾT LUẬN:")) {
                finalVerdict = lines[i].trim();
                // Loại bỏ dòng kết luận đó ra khỏi phần nội dung phân tích chung để không bị lặp
                lines.splice(i, 1);
                analysisBody = lines.join('\n');
                break;
            }
        }

        // Định giá mức độ rủi ro dựa trên bộ lọc từ khóa phân tích nhanh kết quả
        let currentRisk = "Nghi ngờ";
        if (aiText.includes("100%") || aiText.includes("90%") || aiText.includes("Nguy hiểm")) {
            currentRisk = "Nguy hiểm";
        } else if (aiText.includes("0%") || aiText.includes("An toàn")) {
            currentRisk = "An toàn";
        }

        // Chuyển đổi cấu trúc dữ liệu thô sang Object chuẩn để hiển thị lên UI tĩnh
        const cleanPayload = {
            risk: currentRisk,
            analysis: analysisBody,
            verdict: finalVerdict
        };

        // Lưu vào LocalStorage lịch sử và hiển thị
        saveToHistory(msg, cleanPayload);
        displayResult(msg, cleanPayload);

    } catch (err) {
        console.error("Lỗi ngoại lệ phát sinh khi gọi API:", err);
        resultDiv.innerHTML = `
            <div class="bg-red-50 border-2 border-red-400 text-red-900 p-4 rounded-xl font-medium w-full">
                ⚠️ Đã xảy ra lỗi khi kết nối với hệ thống phân tích từ xa. Bác vui lòng thử lại sau ít phút nhé! (${err.message})
            </div>`;
    }
}

// ==========================================
// 3. HÀM ĐIỀN DỮ LIỆU LÊN GIAO DIỆN TĨNH CẤP 3
// ==========================================
function displayResult(originalMsg, data) {
    const resultDiv = document.getElementById('result');
    
    // Khởi tạo layout cấu trúc
    resultDiv.innerHTML = `
        <div id="risk-card" class="border-2 p-4 rounded-xl text-center shadow-sm transition-all">
            <span class="text-sm font-bold uppercase tracking-wider block opacity-75">Mức độ rủi ro đối chiếu</span>
            <span id="risk-status" class="text-3xl font-black"></span>
        </div>

        <div class="bg-slate-100 p-4 rounded-xl border border-slate-200">
            <h4 class="text-sm font-bold text-slate-500 mb-2">Nội dung tin nhắn gốc:</h4>
            <p id="original-text" class="text-lg whitespace-pre-wrap leading-relaxed text-slate-800"></p>
        </div>

        <div class="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-3">
            <div class="flex items-center space-x-2 border-b border-slate-100 pb-2">
                <span class="text-2xl">🕵️‍♂️</span>
                <h3 class="text-xl font-bold text-slate-800">Báo cáo phân tích chuyên sâu của Thám tử</h3>
            </div>
            <div id="detector-section" class="text-base text-slate-700 whitespace-pre-wrap leading-relaxed">
                <p id="analysis-text"></p>
            </div>
        </div>

        <div id="psychology-card" class="bg-purple-50 p-5 rounded-xl border border-purple-200 shadow-sm space-y-3">
            <div class="flex items-center space-x-2 border-b border-purple-100 pb-2">
                <span class="text-2xl">🧠</span>
                <h3 class="text-xl font-bold text-purple-900">Lời khuyên từ Cô Tâm Lý (Dành cho người lớn tuổi)</h3>
            </div>
            <div class="bg-white p-4 rounded-xl border border-purple-100 text-purple-950 text-base md:text-lg leading-relaxed shadow-sm font-medium">
                💬 <span id="psychology-verdict" class="italic font-bold text-purple-900"></span>
            </div>
        </div>
    `;

    const riskCard = document.getElementById('risk-card');
    const riskStatus = document.getElementById('risk-status');
    const originalText = document.getElementById('original-text');
    const analysisText = document.getElementById('analysis-text');
    const psychologyCard = document.getElementById('psychology-card');
    const psychVerdict = document.getElementById('psychology-verdict');

    // Thiết lập màu sắc Rủi ro phản hồi trực quan
    if (data.risk === "An toàn") riskCard.classList.add("bg-green-100", "text-green-800", "border-green-400");
    if (data.risk === "Nghi ngờ") riskCard.classList.add("bg-yellow-100", "text-yellow-800", "border-yellow-400");
    if (data.risk === "Nguy hiểm") riskCard.classList.add("bg-red-100", "text-red-800", "border-red-400");
    riskStatus.innerText = data.risk;

    // Đổ text gốc và báo cáo chi tiết
    originalText.innerText = originalMsg;
    analysisText.innerText = data.analysis;

    // Xử lý logic ẩn/hiện Thẻ Cô Tâm Lý phụ thuộc tính chất cảnh báo của tin nhắn
    if (data.risk === "An toàn") {
        psychologyCard.classList.add('hidden');
    } else {
        psychologyCard.classList.remove('hidden');
        psychVerdict.innerText = data.verdict; 
    }

    resultDiv.classList.remove('hidden');
}

// ==========================================
// 4. QUẢN LÝ LỊCH SỬ 10 TIN NHẮN (LOCALSTORAGE)
// ==========================================
function saveToHistory(msg, data) {
    let history = JSON.parse(localStorage.getItem('scamcheck_history')) || [];
    history = history.filter(item => item.msg !== msg);
    history.unshift({ msg, data, time: new Date().toLocaleTimeString('vi-VN', {hour: '2-digit', minute:'2-digit'}) });
    
    if (history.length > 10) {
        history.pop();
    }
    
    localStorage.setItem('scamcheck_history', JSON.stringify(history));
    renderHistory();
}

function renderHistory() {
    const historyList = document.getElementById('history-list');
    const history = JSON.parse(localStorage.getItem('scamcheck_history')) || [];

    if (history.length === 0) {
        historyList.innerHTML = `<p class="text-slate-400 italic text-base">Chưa có lịch sử kiểm tra nào gần đây.</p>`;
        return;
    }

    historyList.innerHTML = '';
    history.forEach((item) => {
        if (!item || !item.data) return;
        
        const itemBtn = document.createElement('button');
        itemBtn.className = "w-full text-left p-3 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-lg transition text-base truncate block text-slate-700 font-medium flex justify-between items-center";
        
        let riskEmoji = "✅";
        if (item.data.risk === "Nghi ngờ") riskEmoji = "⚠️";
        if (item.data.risk === "Nguy hiểm") riskEmoji = "🚨";

        itemBtn.innerHTML = `<span class="truncate mr-2">${riskEmoji} [${item.data.risk || 'Nghi ngờ'}] ${item.msg}</span> <span class="text-xs text-slate-400 flex-shrink-0">${item.time || ''}</span>`;
        
        itemBtn.onclick = () => {
            document.getElementById('message').value = item.msg;
            displayResult(item.msg, item.data);
        };
        historyList.appendChild(itemBtn);
    });
}
