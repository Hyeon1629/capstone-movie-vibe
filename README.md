# TMDB 영화 커뮤니티 — 영화 사이트 클론 코딩 프로젝트

> 학교 캡스톤 프로젝트의 일환으로, 아래 강의를 학습하며 **TMDB API 기반 영화 커뮤니티 플랫폼**을 바이브 코딩한 결과물입니다.
>
> **학습 강의:** [따라하며 배우는 노드, 리액트 시리즈 - 영화 사이트 만들기 (인프런)](https://www.inflearn.com/course/%EB%94%B0%EB%9D%BC%ED%95%98%EB%A9%B0-%EB%B0%B0%EC%9A%B0%EB%8A%94-%EB%85%B8%EB%93%9C-%EB%A6%AC%EC%95%A1%ED%8A%B8-%EC%98%81%ED%99%94%EC%82%AC%EC%9D%B4%ED%8A%B8-%EB%A7%8C%EB%93%A4%EA%B8%B0?cid=324906)

---

## 1. 프로젝트 개요

본 프로젝트는 캡스톤 프로젝트 진행에 앞서, 웹 서비스 개발에 필요한 기술 역량을 확보하기 위해 진행한 **학습 기반 클론 코딩**입니다.
위 인프런 강의를 학습하며 외부 API(TMDB)를 활용한 영화 정보 서비스의 핵심 기능을 직접 구현하였고, 그 과정에서 다음 기술들을 실무 수준으로 다루는 것을 목표로 하였습니다.

- React 기반의 SPA(Single Page Application) 개발
- **외부 REST API(TMDB)** 연동 및 자체 백엔드 API 설계
- **JWT 기반 인증/인가** 및 NoSQL(MongoDB) 데이터 모델링
- 프론트엔드와 백엔드의 분리 및 연동, 빌드/배포 구성

### 핵심 설계 원칙

영화 원본 데이터는 **TMDB API에 위임**하고, 자체 DB에는 **유저 행동 데이터(즐겨찾기·반응·댓글)만 저장**합니다.
`movieId(Number)`를 외래 키처럼 사용해 TMDB와 연결하며, 영화 상세 정보는 DB에 중복 저장하지 않습니다.

## 2. 주요 기능

| 영역 | 구현 내용 |
|------|-----------|
| **인증** | 회원가입, 로그인/로그아웃 (JWT + httpOnly 쿠키, 비밀번호 bcrypt 암호화) |
| **영화 탐색** | TMDB 인기 영화 목록, 제목 검색(디바운싱), 무한 스크롤(더 보기) |
| **영화 상세** | 배경 이미지, 장르·평점·런타임·줄거리, 출연진, 유사 영화 |
| **즐겨찾기** | 영화 북마크 추가/제거, 즐겨찾기 목록 페이지 |
| **반응(좋아요)** | like / dislike 토글 및 집계 카운트 표시 |
| **댓글** | 영화별 댓글 작성·조회·삭제 (작성자 본인만 삭제 가능) |

## 3. 기술 스택

### Frontend
- **React 18**
- **Redux** + **redux-thunk** (전역 상태 관리)
- **Ant Design** (UI 컴포넌트)
- **axios** (HTTP 통신, 백엔드/TMDB 분리)
- **React Router** (라우팅)
- 커스텀 훅: `useTMDB`, `useFavoriteToggle`, `useDebounce`

### Backend
- **Node.js**, **Express 5**
- **MongoDB** + **Mongoose (ODM)**
- **jsonwebtoken** (JWT 인증), **bcrypt** (비밀번호 암호화)
- **cookie-parser**, **body-parser**, **dotenv**

### 외부 API
- **TMDB (The Movie Database) API** — 영화 원본 데이터

## 4. 프로젝트 구조

```
V1/
├── server/             # 백엔드 (Express + Mongoose)
│   ├── index.js          # 서버 진입점 (미들웨어/라우트/정적 서빙)
│   ├── config/           # 환경별 설정 (dev / prod / key)
│   ├── models/           # 데이터 모델 (User, Favorite, Reaction, Comment)
│   ├── routes/           # REST API 라우터
│   ├── controllers/      # 라우트별 비즈니스 로직
│   └── middleware/       # JWT 인증 미들웨어 (auth)
│
└── client/             # 프론트엔드 (React)
    └── src/
        ├── components/     # 뷰/공통 컴포넌트
        │   ├── views/        # 페이지 (Landing, Login, Register, Detail, Favorite)
        │   └── common/       # 재사용 컴포넌트 (MovieCard, GridContainer 등)
        ├── hooks/          # 커스텀 훅 (useTMDB, useFavoriteToggle, useDebounce)
        ├── _actions/       # Redux 액션 (user, favorite)
        ├── _reducers/      # Redux 리듀서
        ├── hoc/            # 인증 가드 HOC (auth)
        └── utils/          # 유틸 (api 인스턴스, tmdbConfig)
```

### 데이터 모델

| 모델 | 역할 | 핵심 인덱스 |
|------|------|-------------|
| `User` | 계정, JWT 발급/검증 | `email` unique |
| `Favorite` | 즐겨찾기 목록 (제목·포스터 비정규화) | `{ userId, movieId }` compound unique |
| `Reaction` | like / dislike | `{ userId, movieId }` compound unique |
| `Comment` | 영화별 댓글 | `{ movieId, createdAt: -1 }` |

## 5. 실행 방법

### 사전 준비
- [Node.js](https://nodejs.org) (18 이상 권장)
- [MongoDB](https://www.mongodb.com/) (로컬 또는 MongoDB Atlas)
- [TMDB API Key](https://www.themoviedb.org/settings/api) 발급

### 환경 변수 설정

**백엔드** — 루트에 `.env` 파일 작성 (`.env.example` 참고)
```bash
MONGODB_URI=<MongoDB 연결 문자열>
JWT_SECRET=<JWT 서명 키>
JWT_EXPIRES_IN=1d
PORT=5000
```

**프론트엔드** — `client/.env.local` 작성
```bash
REACT_APP_TMDB_API_KEY=<TMDB API 키>
```

### 설치 및 실행
```bash
# 의존성 설치 (루트 + 프론트엔드)
npm install && npm install --prefix client

# 개발 모드 (백엔드 + 프론트엔드 동시 실행)
npm run dev:all
# → 백엔드  http://localhost:5000
# → 프론트  http://localhost:3000 (proxy → 5000)
```

### 개별 실행 / 프로덕션 빌드
```bash
npm run dev      # Express 백엔드만 (nodemon)
npm run client   # React 프론트엔드만

npm run build    # client/build/ 생성
npm start        # Express로 빌드 서빙 (NODE_ENV=production)
```

## 6. 학습 성과

본 클론 코딩을 통해 다음을 학습하였으며, 이후 캡스톤 본 프로젝트에 적용할 예정입니다.

- **외부 API 연동 설계**: 영화 원본은 TMDB에 위임하고 유저 데이터만 자체 저장하는 책임 분리 구조 설계
- **JWT 인증 흐름**: 로그인 시 토큰 발급 → httpOnly 쿠키 저장 → 미들웨어 검증 → 서버 측 로그아웃(토큰 무효화)까지의 전체 흐름 구현
- **NoSQL 데이터 모델링**: Compound Unique Index를 활용한 중복 방지, 조회 성능을 위한 의도적 비정규화 적용
- **재사용 가능한 프론트엔드 설계**: 커스텀 훅과 공통 컴포넌트로 중복 로직을 추상화하고, Redux로 전역 인증 상태 관리

---

> 본 프로젝트의 코드는 위 인프런 강의의 학습 목적으로 작성되었습니다.
