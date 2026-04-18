export interface WikiPage {
  id: string;
  title: string;
  content: string;
  updatedAt: number;
  author: string;
  authorIp?: string;
}

export type AppView = 'view' | 'edit' | 'home';

export const INITIAL_PAGES: WikiPage[] = [
  {
    id: 'welcome',
    title: '환영합니다',
    content: '# 위키마스터에 오신 것을 환영합니다\n\n이곳은 지식을 공유하고 정리하는 당신만의 공간입니다.\n\n## 주요 기능\n- **마크다운 지원**: 풍부한 텍스트 표현\n- **AI 초안 작성**: Gemini를 통한 자동 내용 생성\n- **빠른 검색**: 원하는 키워드로 즉시 이동\n\n왼쪽 사이드바에서 문서를 검색하거나 새로운 문서를 만들어보세요.',
    updatedAt: Date.now(),
    author: '시스템',
    authorIp: 'system',
  },
  {
    id: 'markdown-guide',
    title: '마크다운 가이드',
    content: '# 마크다운(Markdown) 사용법\n\n마크다운은 텍스트 기반의 마크업 언어로, 웹에서 문서를 쉽게 작성할 수 있게 도와줍니다.\n\n## 기본 문법\n1. **제목**: `#`으로 시작 (예: `# 제목 1`, `## 제목 2`)\n2. **강조**: `**텍스트**`는 굵게, `*텍스트*`는 기울임\n3. **목록**:\n   - `-` 항목 1\n   - `-` 항목 2\n4. **링크**: `[이름](URL)`\n5. **코드**: \\`코드\\` 또는 \\`\\`\\` 블록',
    updatedAt: Date.now(),
    author: '시스템',
    authorIp: 'system',
  }
];
