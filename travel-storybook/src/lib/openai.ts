import OpenAI from 'openai';

// OpenAI 초기화 (환경 변수가 없으면 null)
let openai: OpenAI | null = null;

try {
  const apiKey = import.meta.env.VITE_OPENAI_API_KEY;
  if (apiKey && apiKey !== 'demo_openai_key') {
    openai = new OpenAI({
      apiKey,
      dangerouslyAllowBrowser: true // 주의: 프로덕션에서는 백엔드에서 처리해야 합니다
    });
  }
} catch (error) {
  console.warn('OpenAI 초기화 실패:', error);
}

export interface StorybookRequest {
  tripTitle: string;
  notes: string;
  places: string[];
  people: string[];
  photoUrls: string[];
}

export interface StorybookPage {
  page: number;
  title: string;
  caption: string;
  layout: 'full' | 'two-photos' | 'three-photos' | 'grid';
}

export interface StorybookResponse {
  summary: string;
  storybook: StorybookPage[];
}

export async function generateStorybook(request: StorybookRequest): Promise<StorybookResponse> {
  if (!openai) {
    throw new Error('OpenAI API 키가 설정되지 않았습니다. .env 파일을 확인해주세요.');
  }
  const prompt = `
당신은 감성적인 여행 스토리텔러입니다. 
다음 정보를 바탕으로 인스타그램 감성의 여행 스토리북을 만들어주세요.

여행 제목: ${request.tripTitle}
메모: ${request.notes}
장소: ${request.places.join(', ')}
함께 간 사람: ${request.people.join(', ')}
사진 개수: ${request.photoUrls.length}개

요구사항:
1. 여행 전체를 요약하는 감성적인 summary를 작성해주세요 (2-3문장)
2. 정확히 10개의 스토리 페이지를 만들어주세요
3. 각 페이지는 짧고 감성적인 제목(title)과 설명(caption)을 포함해야 합니다
4. layout은 'full', 'two-photos', 'three-photos', 'grid' 중 하나를 선택해주세요
5. 전체적으로 Instagram 감성의 따뜻하고 감성적인 톤을 유지해주세요

JSON 형식으로만 응답해주세요:
{
  "summary": "...",
  "storybook": [
    {
      "page": 1,
      "title": "...",
      "caption": "...",
      "layout": "full"
    },
    ...
  ]
}
`;

  try {
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        {
          role: 'system',
          content: '당신은 감성적인 여행 스토리를 작성하는 전문가입니다. 항상 JSON 형식으로 응답합니다.'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      response_format: { type: 'json_object' },
      temperature: 0.8,
    });

    const content = completion.choices[0].message.content;
    if (!content) {
      throw new Error('AI 응답이 비어있습니다.');
    }

    return JSON.parse(content) as StorybookResponse;
  } catch (error) {
    console.error('OpenAI API 오류:', error);
    throw new Error('스토리북 생성에 실패했습니다.');
  }
}

