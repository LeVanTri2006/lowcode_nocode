export interface AiAnalysisDetail {
  videoId: number;
  topic: string;
  topicConfidence: number;
  category: string;
  categoryConfidence: number;
  contentType: string;
  contentTypeConfidence: number;
  sentiment: string;
  sentimentConfidence: number;
  summary: string;
  keyMessage: string;
  targetAudience: string;
  keywords: string[];
  transcriptExcerpt: string;
}

export const MOCK_AI_ANALYSES: Record<number, AiAnalysisDetail> = {
  1: {
    videoId: 1,
    topic: 'Technology',
    topicConfidence: 92,
    category: 'Product Review',
    categoryConfidence: 89,
    contentType: 'Review',
    contentTypeConfidence: 95,
    sentiment: 'Tích cực (Positive)',
    sentimentConfidence: 87,
    summary:
      'MKBHD đánh giá chi tiết Xiaomi 18 Pro Max với nhiều nâng cấp đáng chú ý về camera, hiệu năng và thiết kế. Video tập trung so sánh với các đối thủ và đưa ra nhận định tích cực về giá trị sản phẩm.',
    keyMessage:
      'Xiaomi 18 Pro Max mang lại trải nghiệm cao cấp với nhiều cải tiến vượt trội.',
    targetAudience:
      'Người dùng công nghệ, người quan tâm smartphone cao cấp.',
    keywords: [
      'Xiaomi 18 Pro Max',
      'Đánh giá smartphone',
      'Camera zoom 100x',
      'Snapdragon Gen 5',
      'MKBHD Review',
      'Pin 6000mAh',
    ],
    transcriptExcerpt:
      'Hey what is up guys, MKBHD here. And this is the Xiaomi 18 Pro Max. Now on paper, this looks like the ultimate flagship phone of 2026...',
  },
  2: {
    videoId: 2,
    topic: 'Society & Culture',
    topicConfidence: 95,
    category: 'Education & Ideas',
    categoryConfidence: 91,
    contentType: 'Speech / Talk',
    contentTypeConfidence: 98,
    sentiment: 'Truyền cảm hứng (Inspiring)',
    sentimentConfidence: 92,
    summary:
      'Diễn giả chia sẻ bài học sâu sắc về sự gắn kết cộng đồng và cách con người vượt qua sự cô lập trong kỷ nguyên số hóa.',
    keyMessage:
      'Sự thấu hiểu và kết nối con người là chìa khóa xây dựng xã hội thịnh vượng bền vững.',
    targetAudience:
      'Cộng đồng học thuật, những người quan tâm tới tâm lý học xã hội và phát triển bản thân.',
    keywords: [
      'TED Talk',
      'Tâm lý học cộng đồng',
      'Gắn kết xã hội',
      'Đời sống hiện đại',
    ],
    transcriptExcerpt:
      'What happens when 180 complete strangers are brought together under one roof with a single mission to build a shared future? Here is what we discovered...',
  },
  3: {
    videoId: 3,
    topic: 'Physics & Astronomy',
    topicConfidence: 98,
    category: 'Scientific Experiment',
    categoryConfidence: 94,
    contentType: 'Explainer / Doc',
    contentTypeConfidence: 96,
    sentiment: 'Trung lập & Tò mò (Curious)',
    sentimentConfidence: 90,
    summary:
      'Thử nghiệm mô phỏng hiện tượng uốn cong không thời gian và bức xạ Hawking bằng buồng cộng hưởng vi sóng trong phòng thí nghiệm.',
    keyMessage:
      'Các nguyên lý vật lý thiên văn có thể được tái hiện qua các hệ vi mô tương đương.',
    targetAudience:
      'Học sinh, sinh viên, người yêu khoa học và vật lý hiện đại.',
    keywords: [
      'Lỗ đen',
      'Bức xạ Hawking',
      'Không thời gian',
      'Veritasium',
      'Vật lý lượng tử',
    ],
    transcriptExcerpt:
      'Black holes are some of the most mysterious objects in our universe. But can we actually create an analog of one right here in our lab?',
  },
};
