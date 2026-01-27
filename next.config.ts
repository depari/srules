import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'export', // GitHub Pages용 정적 사이트 생성
  basePath: process.env.NEXT_PUBLIC_BASE_PATH || '', // GitHub Pages 서브 디렉토리 지원
  images: {
    unoptimized: true, // 정적 내보내기에서는 이미지 최적화 비활성화
  },
  trailingSlash: true, // URL에 trailing slash 추가
};

export default nextConfig;
