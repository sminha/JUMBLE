import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

const PROMPT = `이 영수증 이미지에서 정보를 추출해 아래 JSON 형식으로만 응답해줘. 마크다운 코드블록 없이 순수 JSON만 반환해.

{
  "purchasedAt": "YYYY-MM-DD",
  "vendor": "거래처명",
  "items": [
    {
      "name": "상품명",
      "category": "TOP | OUTER | BOTTOM | SET | BAG | SHOES | JEWELRY | ACCESSORY | ETC",
      "color": "컬러 (없으면 빈 문자열)",
      "size": "사이즈 (없으면 빈 문자열)",
      "option": "기타옵션 (없으면 빈 문자열)",
      "price": 단가(숫자),
      "quantity": 수량(숫자),
      "backorderQuantity": 0
    }
  ]
}

category 매핑 기준:
- TOP: 티셔츠, 블라우스, 니트, 셔츠 등 상의 / 상품명에 T, t가 포함된 경우
- OUTER: 자켓, 코트, 점퍼 등 아우터
- BOTTOM: 바지, 쇼츠, 스커트 등 하의
- SET: 원피스, 상하의 세트
- BAG: 가방, 파우치 등
- SHOES: 신발, 슬리퍼 등
- JEWELRY: 귀걸이, 목걸이, 반지 등
- ACCESSORY: 모자, 스카프, 벨트 등 주얼리 외 액세서리
- ETC: 위 항목에 해당하지 않는 경우

- 영수증에 "상품명/컬러/사이즈" 형식으로 기재된 경우, "/" 기준으로 분리해서 각각 name, color, size 필드에 넣어줘.
- 예: "반팔티/블랙/M" → name: "반팔티", color: "블랙", size: "M"
- size가 "F" 또는 "f"인 경우 "FREE"로 변환해줘.

날짜가 없으면 purchasedAt은 빈 문자열로, 알 수 없는 필드는 빈 문자열로 반환해.`;

export const OcrService = {
  parseReceipt: async (imageBuffer: Buffer, mimeType: string) => {
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    const imagePart = {
      inlineData: {
        data: imageBuffer.toString("base64"),
        mimeType,
      },
    };

    const result = await model.generateContent({
      contents: [{ role: "user", parts: [{ text: PROMPT }, imagePart] }],
      generationConfig: { thinkingConfig: { thinkingBudget: 0 } } as any,
    });

    const text = result.response.text();

    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch)
      throw new Error("Gemini 응답에서 JSON을 추출할 수 없습니다.");

    return JSON.parse(jsonMatch[0]);
  },
};
