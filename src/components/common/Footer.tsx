import Link from 'next/link';

export default function Footer() {
    return (
        <footer className="border-t border-slate-800 bg-slate-950/50 mt-16 px-4 py-12 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-7xl">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
                    <div className="col-span-1 md:col-span-2">
                        <Link href="/" className="flex items-center gap-2 mb-4">
                            <div className="h-8 w-8 rounded bg-gradient-to-br from-purple-600 to-cyan-600 p-1.5">
                                <svg className="h-full w-full text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                </svg>
                            </div>
                            <span className="text-xl font-bold bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">
                                Smart Rules Archive
                            </span>
                        </Link>
                        <p className="text-slate-400 text-sm max-w-xs leading-relaxed">
                            개발자들의 지식과 경험을 규칙 형태로 자산화하고, 누구나 쉽게 활용할 수 있도록 공유하는 오픈 아카이브입니다.
                        </p>
                    </div>

                    <div>
                        <h4 className="text-white font-semibold mb-4">링크</h4>
                        <ul className="space-y-2 text-sm text-slate-400">
                            <li><Link href="/rules" className="hover:text-purple-400 transition-colors">규칙 목록</Link></li>
                            <li><Link href="/favorites" className="hover:text-purple-400 transition-colors">즐겨찾기</Link></li>
                            <li><Link href="/submit" className="hover:text-purple-400 transition-colors">규칙 등록</Link></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="text-white font-semibold mb-4">커뮤니티</h4>
                        <ul className="space-y-2 text-sm text-slate-400">
                            <li><Link href="https://github.com/depari/srules" target="_blank" className="hover:text-purple-400 transition-colors">GitHub</Link></li>
                            <li><Link href="/docs" className="hover:text-purple-400 transition-colors">문서</Link></li>
                            <li><Link href="https://github.com/depari/srules/discussions" target="_blank" className="hover:text-purple-400 transition-colors">Discussions</Link></li>
                        </ul>
                    </div>
                </div>

                <div className="border-t border-slate-900 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
                    <p className="text-slate-500 text-xs text-center md:text-left">
                        © {new Date().getFullYear()} Smart Rules Archive. All rights reserved.
                    </p>
                    <div className="flex items-center gap-6">
                        <Link href="/privacy" className="text-slate-500 hover:text-slate-400 text-xs">개인정보처리방침</Link>
                        <Link href="/terms" className="text-slate-500 hover:text-slate-400 text-xs">이용약관</Link>
                    </div>
                </div>
            </div>
        </footer>
    );
}
