# 덕친소: 혼자서는 외로워!

<!-- 필수 항목 -->

## 카테고리

| Application | Domain | Language | Framework |
| ---- | ---- | ---- | ---- |
| :black_square_button: Desktop Web | :black_square_button: AI | :white_check_mark: JavaScript | :black_square_button: Vue.js |
| :white_check_mark: Mobile Web | :black_square_button: Big Data | :black_square_button: TypeScript | :white_check_mark: React |
| :black_square_button: Responsive Web | :black_square_button: Blockchain | :black_square_button: C/C++ | :black_square_button: Angular |
| :black_square_button: Android App | :black_square_button: IoT | :black_square_button: C# | :white_check_mark: Node.js |
| :black_square_button: iOS App | :black_square_button: AR/VR/Metaverse | :black_square_button: Python | :black_square_button: Flask/Django |
| :black_square_button: Desktop App | :black_square_button: Game | :white_check_mark: Java | :white_check_mark: Spring/Springboot |
| | | :black_square_button: Kotlin | |

<!-- 필수 항목 -->

## 프로젝트 소개

* 프로젝트명: 덕친소
* 서비스 특징: 덕후들을 위한 개방형 SNS
* 주요 기능
  - 계정 관리
  - 검색 기능
  - 피드 기능
  - 채팅 기능
* 주요 기술
  - Single Page Application
  - CSS
  - REST API
* 배포 환경
  - URL: // 웹 서비스, 랜딩 페이지, 프로젝트 소개 등의 배포 URL 기입
  - 테스트 계정: // 로그인이 필요한 경우, 사용 가능한 테스트 계정(ID/PW) 기입


## 팀 소개
* 김민정: 팀장, 프론트엔드 개발, 기획 및 와이어프레임 작성
* 김상희: 백엔드 개발, Swagger API 문서 관리
* 맹주영: 백엔드 개발 및 QA 담당
* 임혜영: 프론트엔드 개발, 기획 및 와이어프레임 작성
* 정인하: 프론트엔드 개발, 기획 및 와이어프레임 작성
* 조가예: 프론트엔드 개발, 기획 및 와이어프레임 작성

## 컨벤션

### Commit

- <타입>: <제목>
- Subject Type
    - feat: 기능(새로운 기능)
    - fix: 버그 (버그 수정)
    - refactor: 리팩토링(코드가 작성된 후에 디자인을 개선하는 작업)
    - merge: 코드 병합
- Commit Rule
    - 하나의 **기능 완성 시** !무조건! Commit 하기
    - 기능 완성 후 버그 등은 꼼꼼하게 체크한 후 Commit하기
- 커밋 형식

```json
Subject Type : {component_name} / Detail
```

- 커밋 예시

```jsx
feat: Login component / 전역적인 사용을 위해 modal로 만듦
```

### Branch

- master
- develop
- {feature_name} ex) Account
    - 각각 로컬에서 Branch를 생성 후 작업
        - ex) BE- Account - Login
    - push 후 {feature_name} Branch에 merge하기

### Merge

- 머지하기 전 최소 1명에게 코드 리뷰를 받아야 한다.
- 코드에 필요없는 로그, 주석은 모두 삭제한 뒤 병합한다.
- 머지 메세지를 자세히 설명하기.

### Jira

- 스프린트는 월 ~ 일 (주차마다)
- 아침마다 각자 스토리 포인트 배정
- 그날 작업한 내용은 종례 후에 바로 **오후 6시** 이전 무조건 반영(작업로그 수행 시간 제대로 넣기)
- 자신이 현재 무슨 일을 하고 있는지 남들이 알 수 있도록 진행 중 state 관리 잘 하기
- 스토리 포인트 까먹지 않기
- 작업로그는 참여자 이름을 구체적으로 작성. 목록 형식으로 간결하게.

에픽 - ex ) 역할 구분 : FE, BE, Server
스토리 - ex ) 요구사항(대분류) : 회원, 게시판 등등
서브테스크 - ex ) 소분류 : 로그인, 로그아웃, 회원가입 등등등
테스크 - ex ) 기타 작업 : README 작성, 문서작성 등


## 프로젝트 상세 설명
[덕친소 ](https://www.notion.so/inhassworld/e31cd0dc547748378e94cb7bd5dcffd9)
