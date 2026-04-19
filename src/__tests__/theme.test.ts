/**
 * 테마 관리 기능 TC
 * - 기본값이 'dark'인지
 * - setTheme('dark') 시 <html>에 'dark' 클래스 추가
 * - setTheme('light') 시 <html>에서 'dark' 클래스 제거
 * - localStorage에 테마 저장/불러오기
 * - getTheme()에서 저장된 값 없을 때 'dark' 반환
 */

import { getTheme, setTheme } from '@/lib/storage';

describe('테마 관리', () => {
  beforeEach(() => {
    // localStorage 초기화
    localStorage.clear();
    // html 클래스 초기화
    document.documentElement.className = '';
  });

  it('저장된 테마 없을 때 기본값은 dark', () => {
    const theme = getTheme();
    expect(theme).toBe('dark');
  });

  it('setTheme(dark) 시 html에 dark 클래스가 추가된다', () => {
    setTheme('dark');
    expect(document.documentElement.classList.contains('dark')).toBe(true);
  });

  it('setTheme(light) 시 html에서 dark 클래스가 제거된다', () => {
    document.documentElement.classList.add('dark');
    setTheme('light');
    expect(document.documentElement.classList.contains('dark')).toBe(false);
  });

  it('setTheme 후 getTheme이 저장된 값을 반환한다', () => {
    setTheme('light');
    expect(getTheme()).toBe('light');
  });

  it('setTheme(dark) 후 getTheme이 dark를 반환한다', () => {
    setTheme('dark');
    expect(getTheme()).toBe('dark');
  });

  it('잘못된 값이 저장되어 있어도 dark를 기본값으로 반환한다', () => {
    localStorage.setItem('srules-theme', 'invalid-value');
    const theme = getTheme();
    expect(theme).toBe('dark');
  });
});
