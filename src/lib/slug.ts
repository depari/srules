/**
 * 카테고리/태그 이름을 URL용 slug로 변환 (공백 -> 하이픈, 소문자)
 * 이 함수는 클라이언트와 서버 모두에서 안전하게 사용할 수 있습니다.
 */
export function nameToSlug(name: string): string {
    return name.toLowerCase().trim().replace(/\s+/g, '-');
}
