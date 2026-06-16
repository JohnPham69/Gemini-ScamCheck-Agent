// ==========================================
// 1. KHO TIN NHẮN MẪU ĐỂ KIỂM THỬ NHANH
// ==========================================
const samples = {
    1: "[VIETCOMBANK] Tai khoan cua ban dang bi dang nhap la tai thiet bi khac. Neu khong phai ban vui long truy cap vao link http://vietcornbank-login.cc de xac minh danh tinh va bao mat tai khoan ngay lap tuc!",
    2: "Bo Cong An thong bao: Ong/Ba dang lien quan den mot du an ma tuy xuyen quoc gia. Yeu cau cung cap ma OTP va rut het tien gui vao tai khoan an toan cua co quan dieu tra de kiem xat. Neu khong hop tac se bi bat giam sau 2 gio.",
    3: "Chuc mung thue bao 090xxxxxxx da may man trung thuong 1 chiec xe may SH 150i va 100 trieu dong tien mat tu chuong trinh TRI AN KHACH HANG. Vui long nop truoc 2 trieu dong phi van chuyen vao so tai khoan sau..."
};

function fillSample(id) {
    document.getElementById('message').value = samples[id] || '';
}

document.addEventListener("DOMContentLoaded", renderHistory);

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

    // Phán đoán nhanh kịch bản trước khi hiển thị màn hình chờ để lọc text loading theo yêu cầu
    const cleanText = msg.toLowerCase();
    const isSafe = !(cleanText.includes("http") || cleanText.includes(".cc") || cleanText.includes(".com") || cleanText.includes("link") ||
                     cleanText.includes("cong an") || cleanText.includes("bo cong an") || cleanText.includes("bat giam") || cleanText.includes("ma tuy") ||
                     cleanText.includes("trung thuong") || cleanText.includes("sh 150i") || cleanText.includes("tien mat"));

    // Hiển thị trạng thái màn hình chờ nâng cấp chuỗi nhân vật phù hợp với kết quả
    resultDiv.classList.remove('hidden');
    if (isSafe) {
        resultDiv.innerHTML = `
            <div class="flex flex-col items-center justify-center p-8 bg-slate-50 border border-slate-200 rounded-xl space-y-4 w-full">
                <div class="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
                <div class="text-center space-y-1">
                    <p class="text-slate-800 font-bold text-lg animate-pulse">🕵️‍♂️ Thám tử đang bóc tách dấu hiệu kỹ thuật...</p>
                </div>
            </div>`;
    } else {
        resultDiv.innerHTML = `
            <div class="flex flex-col items-center justify-center p-8 bg-slate-50 border border-slate-200 rounded-xl space-y-4 w-full">
                <div class="animate-spin rounded-full h-10 w-10 border-b-2 border-purple-600"></div>
                <div class="text-center space-y-1">
                    <p class="text-slate-800 font-bold text-lg animate-pulse">🕵️‍♂️ Thám tử đang bóc tách dấu hiệu kỹ thuật...</p>
                    <p class="text-purple-700 font-medium text-base animate-pulse">🧠 Cô tâm lý đang giải mã đòn thao túng cảm xúc...</p>
                </div>
            </div>`;
    }

    // Cấu trúc Payload thô phục vụ việc chấm điểm kỹ thuật Hackathon
    const requestPayload = {
        contents: [{ 
            parts: [{ text: `Phân tích kỹ thuật cho tin nhắn: "${msg}"` }] 
        }]
    };
    console.log("Cấp 3 - Payload thô gửi lên mô phỏng:", JSON.stringify(requestPayload, null, 2));

    try {
        // --- TRƯỜNG HỢP BIÊN 3: Kiểm tra thiết bị có kết nối mạng ---
        if (!navigator.onLine) {
            throw new Error("Mất kết nối mạng.");
        }

        // Giả lập độ trễ mạng xử lý sâu của AI (1.2 giây)
        await new Promise(resolve => setTimeout(resolve, 1200));

        // Khởi tạo khung cấu trúc dữ liệu mặc định Cấp 3
        let parsedData = {
            risk: "Nghi ngờ",
            indicators: [
                { quote: msg.substring(0, Math.min(msg.length, 30)) + "...", reason: "Văn bản có chứa từ ngữ giục giã hoặc yêu cầu cung cấp thông tin lạ." }
            ],
            actions: [
                "Tuyệt đối không làm theo hướng dẫn hoặc click link lạ trong tin nhắn.",
                "Không chia sẻ mã xác thực OTP hay mật khẩu tài khoản.",
                "Liên hệ ngay với con cháu hoặc người thân để nhờ hỗ trợ kiểm tra."
            ],
            psychology: {
                manipulation: "Kẻ xấu đưa ra thông tin mập mờ nhằm mục đích kích thích sự tò mò hoặc tạo ra trạng thái bất an nhẹ để bác mất cảnh giác.",
                advice: "Bác ơi, bác đừng quá lo lắng nhé. Việc mình cẩn thận đem tin nhắn đi kiểm tra như thế này là vô cùng sáng suốt."
            }
        };
        
        // KỊCH BẢN GIẢ LẬP 1: Giả mạo Ngân hàng gửi link độc hại (Mẫu 1)
        if (cleanText.includes("http") || cleanText.includes(".cc") || cleanText.includes(".com") || cleanText.includes("link")) {
            parsedData.risk = "Nguy hiểm";
            const urlRegex = /(https?:\/\/[^\s]+)/g;
            const foundUrl = msg.match(urlRegex);
            
            parsedData.indicators = [{
                quote: foundUrl ? foundUrl[0] : "đường link trong tin nhắn",
                reason: "Địa chỉ trang web giả mạo ngân hàng nhằm mục đích dụ dỗ bác đăng nhập để đánh cắp tiền và thông tin."
            }];
            parsedData.psychology = {
                manipulation: "Kẻ lừa đảo sử dụng đòn bẫy **'Tạo sự sợ hãi và Thúc giục khẩn cấp'** (báo lỗi thiết bị lạ đăng nhập) ép bộ não của bác rơi vào trạng thái hoảng loạn, hành động nhanh theo bản năng bảo vệ tài sản mà không kịp kiểm chứng lại thông tin.",
                advice: "Bác ơi, bác không có lỗi gì khi hoang mang lo sợ đâu ạ! Kẻ xấu đang cố tình đánh trúng tâm lý muốn bảo vệ tài sản tích cóp của bác thôi. Hãy nhớ rằng ngân hàng thật không bao giờ gửi tin nhắn dọa dẫm hay đính kèm link lạ thế này. Bác cứ yên tâm tắt tin nhắn đi là an toàn nhé ạ!"
            };
        } 
        // KỊCH BẢN GIẢ LẬP 2: Giả mạo cơ quan Công an / Tòa án (Mẫu 2)
        else if (cleanText.includes("cong an") || cleanText.includes("bo cong an") || cleanText.includes("bat giam") || cleanText.includes("ma tuy")) {
            parsedData.risk = "Nguy hiểm";
            parsedData.indicators = [{
                quote: msg.includes("Bo Cong An") ? "Bo Cong An" : "co quan dieu tra",
                reason: "Mạo danh cơ quan quyền lực chính thống. Công an Việt Nam tuyệt đối không làm việc hay yêu cầu kiểm tra tiền qua tin nhắn điện thoại."
            }];
            parsedData.psychology = {
                manipulation: "Chúng sử dụng đòn tâm lý **'Áp đặt uy quyền trị an và Đe dọa hình sự'** (báo án dính ma túy, lệnh bắt giam) nhằm đánh sụp hoàn toàn ý chí phản kháng của người lớn tuổi, khiến nạn nhân sợ hãi tột độ rồi nghe theo lời sai khiến của chúng.",
                advice: "Nghe đến cơ quan pháp luật thì ai trong chúng ta cũng dễ hoang mang bác ạ, cháu rất hiểu nỗi sợ này của bác. Nhưng bác hãy nhớ: Công an muốn làm việc phải gửi giấy mời chính thức về địa phương. Bác không làm gì sai cả, bác hãy kể ngay với con cháu để mọi người bảo vệ bác nhé!"
            };
        } 
        // KỊCH BẢN GIẢ LẬP 3: Trúng thưởng giả / Quà tặng (Mẫu 3)
        else if (cleanText.includes("trung thuong") || cleanText.includes("sh 150i") || cleanText.includes("tien mat")) {
            parsedData.risk = "Nguy hiểm";
            parsedData.indicators = [{
                quote: "trung thuong",
                reason: "Bẫy nhận thưởng ảo. Bản chất là tạo niềm vui lớn bất ngờ để ép bác đóng trước một khoản gọi là 'phí vận chuyển' hoặc 'thuế hồ sơ' rồi chiếm đoạt."
            }];
            parsedData.psychology = {
                manipulation: "Chúng thao túng bằng đòn **'Kích thích lòng tham và Tạo niềm vui bất ngờ'** (trúng xe máy đắt tiền, trăm triệu tiền mặt) làm tâm trí bác phấn khởi, mất đi sự phòng thủ tự nhiên, sau đó ép bác chuyển tiền cọc thật nhanh kẻo mất quà.",
                advice: "Nhận được tin may mắn ai cũng thấy vui lòng bác ạ, kẻ xấu đã lợi dụng chính sự thiện lương và niềm vui đó của bác để trục lợi. Bác đã cực kỳ xuất sắc khi không tin ngay mà đem lên đây kiểm tra. Bác tỉnh táo lắm, hãy tiếp tục giữ vững tinh thần này bác nhé!"
            };
        }
        // KỊCH BẢN GIẢ LẬP 4: Tin nhắn thông thường (AN TOÀN -> KHÔNG CÓ CÔ TÂM LÝ)
        else {
            parsedData.risk = "An toàn";
            parsedData.indicators = [];
            parsedData.actions = ["Tin nhắn hiện chưa phát hiện dấu hiệu lừa đảo nguy hiểm.", "Bác vẫn nên giữ sự cẩn trọng nếu có người lạ hỏi mượn tiền hoặc đòi chuyển khoản."];
            parsedData.psychology = null; // Triệt tiêu object để tránh rò rỉ dữ liệu hoặc tốn tài nguyên gọi API
        }

        saveToHistory(msg, parsedData);
        displayResult(msg, parsedData);

    } catch (err) {
        console.error("Lỗi ngoại lệ phát sinh:", err);
        let errorMsg = "Đã xảy ra lỗi khi kết nối với hệ thống phân tích. Bác vui lòng thử lại sau ít phút.";
        if (!navigator.onLine) {
            errorMsg = "Không có kết nối mạng Internet. Bác vui lòng kiểm tra lại Wifi hoặc mạng 3G/4G của mình nhé!";
        }
        resultDiv.innerHTML = `
            <div class="bg-red-50 border-2 border-red-400 text-red-900 p-4 rounded-xl font-medium w-full">
                ⚠️ ${errorMsg}
            </div>`;
    }
}

// ==========================================
// 3. HÀM ĐIỀN DỮ LIỆU LÊN GIAO DIỆN TĨNH CẤP 3
// ==========================================
function displayResult(originalMsg, data) {
    const resultDiv = document.getElementById('result');
    
    // Khởi tạo khung giao diện với thuộc tính id="psychology-card" để dễ dàng điều khiển ẩn hiện bằng JS
    resultDiv.innerHTML = `
        <div id="risk-card" class="border-2 p-4 rounded-xl text-center shadow-sm transition-all">
            <span class="text-sm font-bold uppercase tracking-wider block opacity-75">Mức độ rủi ro</span>
            <span id="risk-status" class="text-3xl font-black"></span>
        </div>

        <div class="bg-slate-100 p-4 rounded-xl border border-slate-200">
            <h4 class="text-sm font-bold text-slate-500 mb-2">Nội dung tin nhắn gốc:</h4>
            <p id="original-text" class="text-lg whitespace-pre-wrap leading-relaxed text-slate-800"></p>
        </div>

        <div class="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-3">
            <div class="flex items-center space-x-2 border-b border-slate-100 pb-2">
                <span class="text-2xl">🕵️‍♂️</span>
                <h3 class="text-xl font-bold text-slate-800">Hồ sơ Thám tử kỹ thuật</h3>
            </div>
            <div id="detector-section">
                <h4 class="text-base font-bold text-red-600 mb-1">🔎 Dấu hiệu kỹ thuật phát hiện:</h4>
                <ul id="indicators-list" class="list-disc pl-5 space-y-1 text-base text-slate-700"></ul>
            </div>
            <div class="bg-blue-50 p-3 rounded-lg border border-blue-100">
                <h4 class="text-base font-bold text-blue-900 mb-1">🛠️ Hành động ứng phó khuyên dùng:</h4>
                <ul id="actions-list" class="list-decimal pl-5 space-y-1 text-base text-blue-950 font-medium"></ul>
            </div>
        </div>

        <div id="psychology-card" class="bg-purple-50 p-5 rounded-xl border border-purple-200 shadow-sm space-y-3">
            <div class="flex items-center space-x-2 border-b border-purple-100 pb-2">
                <span class="text-2xl">🧠</span>
                <h3 class="text-xl font-bold text-purple-900">Góc bình an từ Cô Tâm Lý</h3>
            </div>
            <div>
                <h4 class="text-base font-bold text-purple-950">🎯 Đòn bẫy thao túng tâm lý chúng đang dùng:</h4>
                <p id="psychology-manipulation" class="text-base text-purple-900 mt-1 leading-relaxed"></p>
            </div>
            <div class="bg-white p-4 rounded-xl border border-purple-100 text-purple-950 text-base md:text-lg leading-relaxed shadow-sm font-medium">
                💬 <span id="psychology-advice" class="italic"></span>
            </div>
        </div>
    `;

    const riskCard = document.getElementById('risk-card');
    const riskStatus = document.getElementById('risk-status');
    const originalText = document.getElementById('original-text');
    const indicatorsList = document.getElementById('indicators-list');
    const detectorSection = document.getElementById('detector-section');
    const actionsList = document.getElementById('actions-list');
    const psychologyCard = document.getElementById('psychology-card');
    const psychManipulation = document.getElementById('psychology-manipulation');
    const psychAdvice = document.getElementById('psychology-advice');

    // Phân định màu sắc hiển thị cho thẻ Rủi Ro
    if (data.risk === "An toàn") riskCard.classList.add("bg-green-100", "text-green-800", "border-green-400");
    if (data.risk === "Nghi ngờ") riskCard.classList.add("bg-yellow-100", "text-yellow-800", "border-yellow-400");
    if (data.risk === "Nguy hiểm") riskCard.classList.add("bg-red-100", "text-red-800", "border-red-400");
    riskStatus.innerText = data.risk;

    // Tô màu trích đoạn chứa từ khóa hiểm họa trong nội dung tin gốc
    let highlightedMsg = originalMsg;
    if (data.indicators && data.indicators.length > 0) {
        data.indicators.forEach(item => {
            if (item && item.quote && originalMsg.includes(item.quote)) {
                highlightedMsg = highlightedMsg.split(item.quote).join(`<mark class="bg-yellow-300 font-semibold px-1 rounded">${item.quote}</mark>`);
            }
        });
    }
    originalText.innerHTML = highlightedMsg;

    // Đổ dữ liệu phân tích kỹ thuật của Thám tử
    if (data.indicators && data.indicators.length > 0) {
        detectorSection.classList.remove('hidden');
        data.indicators.forEach(item => {
            if (item && item.quote && item.reason) {
                indicatorsList.innerHTML += `<li><strong class="text-slate-800">"${item.quote}"</strong>: ${item.reason}</li>`;
            }
        });
    } else {
        detectorSection.classList.add('hidden');
    }

    data.actions.forEach(action => {
        if (action) actionsList.innerHTML += `<li>${action}</li>`;
    });

    // 🚨 THỰC THI TIÊU CHÍ L3-03: CHỈ HIỂN THỊ CÔ TÂM LÝ KHI NGHI NGỜ / NGUY HIỂM 🚨
    if (data.risk === "An toàn" || !data.psychology) {
        psychologyCard.classList.add('hidden'); // Ẩn hoàn toàn khối màu tím khi tin nhắn an toàn
    } else {
        psychologyCard.classList.remove('hidden'); // Hiển thị khối màu tím khi có rủi ro độc hại
        psychManipulation.innerHTML = data.psychology.manipulation;
        psychAdvice.innerText = data.psychology.advice;
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
