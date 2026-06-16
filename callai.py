from google import genai
from google.genai import types


def generate(content_to_analyze: str):
    client = genai.Client(
        api_key="AQ.Ab8RN6I1MgU_t8e1AW6QsuBz0BdFnsa5zyv1kZ7a1kT7FfJg6Q"
    )

    model = "gemini-2.5-flash"

    prompt = f"""
You are a fraud investigator and cybersecurity analyst.

Analyze the following content for potential scams.

Tasks:
1. Determine the probability it is a scam (0-100%).
2. Identify every red flag.
3. Explain the scam tactics being used.
4. List evidence FOR legitimacy.
5. List evidence FOR fraud.
6. Identify what information is missing.
7. Describe the most likely scam type.
8. Assess financial, identity theft, and malware risk separately.
9. Tell me exactly how to verify it safely.
10. Give a final verdict.

IMPORTANT:
- THE VERDICT MUST BE WRITTEN ENTIRELY IN FORMAL VIETNAMESE.
- THE VERDICT MUST BE EXACTLY ONE SENTENCE.
- THE VERDICT MUST START WITH: "KẾT LUẬN: "
- NO ENGLISH WORDS OR PHRASES ARE ALLOWED IN THE VERDICT.
- USE LANGUAGE FAMILIAR TO VIETNAMESE PEOPLE AGED 40 AND ABOVE.

Content to analyze:

{content_to_analyze}
"""

    config = types.GenerateContentConfig(
        thinking_config=types.ThinkingConfig(
            thinking_budget=4096
        ),
        tools=[
            types.Tool(
                google_search=types.GoogleSearch()
            )
        ],
    )

    for chunk in client.models.generate_content_stream(
        model=model,
        contents=prompt,
        config=config,
    ):
        if chunk.text:
            print(chunk.text, end="")


if __name__ == "__main__":
    content = f"""CHÚC MỪNG!

Số điện thoại của bạn đã được chọn ngẫu nhiên và trúng giải thưởng đặc biệt trị giá 500.000.000 VNĐ cùng 1 chiếc iPhone 17 Pro Max.

Để nhận giải, vui lòng liên hệ ngay với nhân viên phụ trách qua Telegram: @NhanThuongVN và chuyển trước 2.500.000 VNĐ phí xác minh hồ sơ.

Lưu ý:  
- Chỉ còn 60 phút để xác nhận.
- Nếu quá thời hạn, giải thưởng sẽ bị hủy.
- Không thông báo cho người khác để tránh mất quyền nhận thưởng.

Sau khi chuyển khoản, gửi ảnh biên lai và thông tin cá nhân bao gồm:
- Họ tên đầy đủ
- Số CCCD
- Số tài khoản ngân hàng
- Mã OTP được gửi đến điện thoại

Chúng tôi cam kết hoàn lại phí xác minh cùng với giải thưởng trong vòng 15 phút.

Trân trọng,
Ban Tổ Chức Chương Trình Tri Ân Khách Hàng 2026 """
    generate(content)