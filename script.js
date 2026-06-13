async function analyzeMessage() {
    const msg = document.getElementById('message').value.trim();
    const result = document.getElementById('result');

    if (!msg) {
        result.innerHTML = '<p>Vui lòng nhập tin nhắn.</p>';
        return;
    }

    result.innerHTML = '<p>Đang phân tích...</p>';

    const prompt = `
Bạn là Thám tử ScamCheck.
Trả về JSON:
{
 "risk":"",
 "indicators":[{"quote":"","reason":""}],
 "actions":[]
}

Tin nhắn:
${msg}
`;

    try {
        const response = await fetch(
            `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${GEMINI_API_KEY}`,
            {
                method: "POST",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify({
                    contents: [{parts: [{text: prompt}]}]
                })
            }
        );

        const data = await response.json();
        result.innerHTML = '<pre>' +
            JSON.stringify(data, null, 2) +
            '</pre>';

    } catch (err) {
        result.innerHTML = '<p>Lỗi kết nối AI.</p>';
    }
}