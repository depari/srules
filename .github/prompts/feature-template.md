# 신규 기능 개발 프롬프트 템플릿

다음 요청을 받으면 아래 순서대로 개발을 진행해주세요:

---

## 요청 형식

"다음 기능을 개발해줘: {기능 설명}"

---

## 개발 순서 (TDD + SOLID)

**1단계: 인터페이스 정의**
`src/services/interfaces/I{Name}Service.ts`를 먼저 생성해주세요.  
구현 없이 메서드 시그니처만 정의합니다.

**2단계: 실패 TC 작성**
`src/__tests__/services/{Name}Service.test.ts`를 생성하고  
`npm test -- --testPathPattern={Name}Service`를 실행하여 **FAIL** 상태를 확인해주세요.

**3단계: 최소 구현**
TC가 PASS 되는 최소한의 코드로 `src/services/{Name}Service.ts`를 구현해주세요.

**4단계: TC PASS 확인**
`npm test`를 실행하여 전체 TC가 PASS 되는지 확인해주세요.

**5단계: 빌드 확인**
`npm run build`를 실행하여 빌드가 성공하는지 확인해주세요.

**6단계: 보고서**
`reports/report_{date}_{num}_{desc}.md`를 작성해주세요.

---

## 체크리스트

- [ ] 인터페이스 정의 완료
- [ ] TC FAIL 확인
- [ ] 구현 완료
- [ ] TC PASS 확인 (100%)
- [ ] 빌드 성공
- [ ] 보고서 작성

---

_이 파일은 GitHub Copilot Chat의 `/new` 커맨드나 커스텀 프롬프트로 활용하세요._
