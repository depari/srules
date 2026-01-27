import type { NextConfig } from "next";
import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin();

const isGhPages = process.env.GH_PAGES === 'true';

const nextConfig: NextConfig = {
  output: 'export', // GitHub Pages용 정적 사이트 생성

  // GitHub Pages 배포 시에만 /srules 경로 사용
  basePath: isGhPages ? '/srules' : '',
  assetPrefix: isGhPages ? '/srules' : '',

  images: {
    unoptimized: true, // 정적 내보내기에서는 이미지 최적화 비활성화
  },
  trailingSlash: true, // URL에 trailing slash 추가
};

export default withNextIntl(nextConfig);
