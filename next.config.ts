import type { NextConfig } from "next";
import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin();

const isProd = process.env.NODE_ENV === 'production';

const nextConfig: NextConfig = {
  output: 'export', // GitHub Pages용 정적 사이트 생성

  // GitHub Pages 배포 시 저장소 이름이 경로에 포함됨 (username.github.io/srules)
  // 개발 환경에서는 빈 문자열 사용
  basePath: isProd ? '/srules' : '',
  assetPrefix: isProd ? '/srules' : '',

  images: {
    unoptimized: true, // 정적 내보내기에서는 이미지 최적화 비활성화
  },
  trailingSlash: true, // URL에 trailing slash 추가
};

export default withNextIntl(nextConfig);
