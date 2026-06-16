# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

TMDB 영화 커뮤니티 플랫폼. 영화 원본 데이터는 TMDB API에 위임하고, 유저 행동 데이터만 자체 DB에 저장한다.

## Tech Stack

- Runtime: Node.js
- Framework: Express
- Database: MongoDB + Mongoose
- Auth: JWT (`jsonwebtoken`) + `bcrypt`

## Architecture

### Core Principle

`movieId(Number)`를 외래 키처럼 사용해 TMDB와 연결한다. 영화 상세 정보는 DB에 저장하지 않는다.

### Models (`server/models/`)

| 모델 | 역할 | 핵심 인덱스 |
|------|------|-------------|
| `User` | 계정, JWT 발급/검증 | `email` unique |
| `Favorite` | 즐겨찾기 목록 | `{ userId, movieId }` compound unique |
| `Reaction` | like / dislike | `{ userId, movieId }` compound unique |
| `Comment` | 영화별 댓글 | `{ movieId, createdAt: -1 }` |

**Favorite 비정규화**: `movieTitle`, `moviePoster`를 저장해 목록 조회 시 TMDB 재호출을 방지한다.

**Reaction 중복 방지 2단계**:
1. DB 인덱스 — 동일 `(userId, movieId)` 쌍의 도큐먼트 중복 차단
2. Controller upsert — like ↔ dislike 전환 및 토글 처리

### Auth Flow

```
POST /login → User.comparePassword → User.generateToken → JWT 쿠키 반환
미들웨어    → User.findByToken(cookie) → req.user 주입
```

## Environment Variables

| 변수 | 설명 | 기본값(dev) |
|------|------|------------|
| `JWT_SECRET` | JWT 서명 키 | `dev_secret` |
| `JWT_EXPIRES_IN` | 토큰 만료 | `1d` |
| `MONGODB_URI` | MongoDB 연결 문자열 | — |

## Commands

```bash
# 최초 설치 (루트 + 프론트엔드)
npm install && npm install --prefix client

# 개발 (백엔드 + 프론트엔드 동시)
npm run dev:all

# 개별 실행
npm run dev     # Express 백엔드 (port 5000, nodemon)
npm run client  # React 프론트엔드 (port 3000, proxy → 5000)

# 프로덕션 빌드
npm run build   # client/build/ 생성
npm start       # Express로 빌드 서빙
```
